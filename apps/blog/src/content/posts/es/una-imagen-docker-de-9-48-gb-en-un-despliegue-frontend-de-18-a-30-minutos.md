---
title: 'Una imagen Docker de 9,48 GB en un despliegue frontend de 18–30 minutos'
description: 'Cómo una imagen de Next.js de 9,48 GB pasó a formar parte de un despliegue de 18–30 minutos, por qué decidí optimizar el artefacto compartido sin rediseñar los flujos por tenant y qué cambió después del despliegue.'
pubDate: '2026-08-28T00:00:00-05:00'
category: 'Artículos técnicos'
lang: 'es'
translationKey: 'shrinking-nextjs-docker-image'
heroImage: '../../../assets/posts/shrinking-nextjs-docker-image/freight-gate-runtime-boundary.webp'
heroImageAlt: 'Una gran caja de carga de madera está bloqueada frente a una compuerta estrecha de acero, mientras una caja azul más pequeña aparece al otro lado de la misma abertura.'
draft: false
---

Los despliegues del frontend podían tardar entre 18 y 30 minutos. Con el tiempo,
empecé a dejar que los cambios se acumularan para que la espera pareciera más
justificada.

Algunas veces no había problema. Otras, un cambio se quedaba pendiente más tiempo
del que debería. La misma demora era más difícil de aceptar cuando se trataba de
una corrección crítica. Empecé a temerle al despliegue del frontend, y la espera
comenzó a influir en el momento en que decidía publicar cambios.

Yo no escribí el Dockerfile detrás de esos despliegues. Ya estaba en el repositorio
cuando entré como junior, y en ese momento no tenía una opinión sobre él. Para el
desarrollo y las compilaciones locales normalmente ejecutaba Node.js directamente.
El Dockerfile quedó casi fuera de mi radar hasta que adquirí más
experiencia y pude hacer despliegues por mi cuenta.

Una vez que el costo pasó a formar parte de mi propio flujo de trabajo, investigué
por qué la tarea del frontend tardaba mucho más que dos tareas de backend en el
mismo pipeline. Inspeccionar la ruta de despliegue convirtió al artefacto que
enviábamos en el siguiente objeto que debía medir.

## El despliegue movía la imagen completa

La tarea de despliegue que inspeccioné no obtenía la imagen del frontend desde un
registro. Usaba un comando con esta forma:

```sh
docker save <image> | ssh <server> docker load
```

En este incidente, la tarea transmitía la imagen completa al servidor y la cargaba
allí. Una imagen más grande significaba más bytes por transferir y cargar en esa
ruta.

Por eso los dos servicios de backend también fueron pistas útiles. Usaban el mismo
mecanismo general de despliegue, pero distribuían una imagen base con JRE y un solo
JAR de la aplicación. Sus tareas terminaban mucho antes. La imagen del frontend
usaba Node.js y Next.js; distintos stacks de ejecución no tienen por qué producir
imágenes del mismo tamaño. La comparación solo nos dio un lugar concreto donde
investigar.

Esto no demuestra que la transferencia de la imagen consumiera cada minuto de los
18–30 minutos observados. La compilación, el rendimiento de la red y del disco
remoto, la carga de la imagen, el reemplazo del contenedor y los health checks
también pueden contribuir. Sí establece que esta tarea movía el artefacto completo,
por lo que su contenido formaba parte del rendimiento del despliegue.

Otros pipelines pueden comportarse de manera distinta. Un registro puede reutilizar
capas y cambia el modelo de transferencia. Este diagnóstico pertenece a la tarea de
transferencia completa que inspeccioné, no a todos los despliegues lentos con Docker.

## La imagen de ejecución todavía contenía el workspace de compilación

El Dockerfile del frontend ya usaba varias etapas, pero la etapa final copiaba mucho
más de lo que la aplicación necesitaba para ejecutarse. Su estructura se parecía al
siguiente ejemplo.

```dockerfile
# Esqueleto simplificado y anonimizado; no es el Dockerfile de producción
FROM node:<full-version> AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:<full-version> AS runtime
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json

CMD ["npm", "start"]
```

La sintaxis de múltiples etapas no hizo pequeña la imagen de ejecución por sí sola.
Las instrucciones `COPY` de la etapa final todavía seleccionaban el directorio
completo de dependencias y todo el directorio de compilación de Next.js. Eso incluía
dependencias de desarrollo y resultados de compilación que el servidor no necesitaba
para ejecutarse.

Construimos e inspeccionamos la imagen existente en lugar de adivinar a partir del
Dockerfile. Medía 9,48 GB. El directorio `.next` ocupaba 6,55 GB y `node_modules`
otros 1,78 GB. En esta compilación, `.next` incluía el caché persistente de webpack
además de los archivos necesarios en ejecución.

Esos números mostraron que el workspace de compilación se había convertido en el
contrato de ejecución.

## Hacer explícito el límite del runtime

El modo standalone de Next.js generó la salida `.next/standalone` que usaría la
etapa final. Lo habilitamos en la configuración de Next.js:

```js
// Fragmento de configuración simplificado; no es el archivo de producción
module.exports = {
  output: 'standalone',
};
```

Esa salida le dio a la etapa de ejecución un conjunto de archivos más limitado para
copiar. La nueva estructura se parecía a esta:

```dockerfile
# Esqueleto simplificado y anonimizado; no es el Dockerfile de producción
FROM node:<version> AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:<slim-version> AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

USER node
CMD ["node", "server.js"]
```

El límite de copia cambió. La etapa de ejecución recibe la salida
`.next/standalone`, los archivos estáticos y los archivos públicos en lugar de los
directorios completos `node_modules` y `.next`. También usa una imagen base delgada
de Node y se ejecuta con un usuario que no es root.

Construidas desde el mismo código fuente, las imágenes resultantes quedaron en el
rango aproximado de 350–380 MB. El tamaño quedó cerca de una vigesimoquinta parte
del original, una reducción aproximada del 96 %.

El tamaño por sí solo no bastaba para dar el cambio por terminado. Un límite de
copia estrecho puede omitir un archivo que se resuelve durante la ejecución. Cambiar
el usuario de ejecución puede revelar un error de permisos. El artefacto más pequeño
tenía que ejecutar la aplicación, no solo terminar `docker build`.

## Una imagen más pequeña todavía tiene que funcionar

Iniciamos localmente el contenedor standalone contra instancias activas de los
servicios de usuarios y academia, además del servicio de identidad. Después
completamos un inicio de sesión real y navegamos por una parte autenticada de la
aplicación.

Ese recorrido ejercitó más que un endpoint público de salud. Requirió que el
servidor del frontend iniciara, se comunicara con sus dependencias, completara la
autenticación, sirviera sus archivos y manejara una ruta autenticada. Durante esa
validación no vimos errores de ejecución, fallos por archivos faltantes ni problemas
de permisos.

La prueba respalda una conclusión concreta: la imagen reducida contenía lo que
necesitaba esa ruta autenticada. No demuestra que todas las rutas estén cubiertas ni
mide cuánto tardará la imagen en llegar al servidor de destino.

Estas comprobaciones responden preguntas distintas. El tamaño del artefacto responde
«¿cuánto estamos enviando?». Un flujo real de la aplicación responde «¿conservamos
lo necesario para este comportamiento en ejecución?». Ningún resultado sustituye
al otro.

## Por qué dejé el flujo de despliegue fuera del alcance

Cambiar el flujo de despliegue era técnicamente posible. Decidí no empezar por ahí.
Hacemos despliegues por tenant, y algunos tenants usan un flujo distinto debido a
decisiones organizacionales internas. Rediseñar esas rutas habría ampliado el
alcance más allá del problema que intentaba resolver.

La imagen era compartida entre esas rutas y era el mayor cuello de botella que
habíamos identificado. Mejorar ese artefacto nos permitió abordar el costo común de
transferencia sin cambiar primero los flujos específicos de cada tenant.

Después de desplegar el cambio, el flujo que tardaba aproximadamente 18–30 minutos
bajó a unos 5–6 minutos. Un segundo flujo ya era más rápido, con tiempos aproximados
de 5–10 minutos; con la imagen más pequeña, sus despliegues tardaron desde unos
pocos segundos hasta aproximadamente 2 minutos.

Estas son observaciones operativas, no benchmarks controlados. Los flujos y las
condiciones de cada tenant son distintos, así que los dos rangos no deben compararse
como si solo hubiera cambiado una variable. Ambos mejoraron lo suficiente para
confirmar que la imagen representaba un costo material en cada ruta de despliegue.

## Inspeccionar, minimizar y probar

Heredé un Dockerfile con el que apenas interactuaba y, más adelante, heredé el costo
operativo de lo que distribuía. Acumular cambios hacía que la espera pareciera más
razonable, pero no aceleraba la entrega. Mirar dentro del artefacto nos mostró una
cantidad concreta de datos que el despliegue debía transferir y que podíamos
reducir.

Este caso respalda tres comprobaciones para una imagen de ejecución heredada:

1. Inspeccionar la imagen real y medir qué ocupa más espacio.
2. Limitar las copias de la etapa final a lo que la aplicación necesita para
   ejecutarse.
3. Probar un flujo real de la aplicación que pueda revelar archivos faltantes,
   problemas de permisos y supuestos sobre las dependencias.

En este caso, los dos primeros pasos redujeron la imagen a cerca de una
vigesimoquinta parte de su tamaño anterior. El tercero mostró que un flujo
autenticado real seguía funcionando. Después del despliegue, una ruta bajó de
aproximadamente 18–30 minutos a 5–6 minutos y la otra pasó de aproximadamente 5–10
minutos a un rango entre unos pocos segundos y 2 minutos. Mediciones futuras podrán
mostrar si otra etapa del pipeline se convierte en el siguiente costo dominante.
