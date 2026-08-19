---
title: 'Desmitificando la autenticación en Spring Security'
description: 'Un recorrido por la autenticación en Spring Security, sus providers, cadenas de filtros y la persistencia del contexto de seguridad.'
pubDate: '2025-03-19'
category: 'Artículos técnicos'
heroImage: '../../../assets/spring-security-authentication-cover.webp'
lang: 'es'
translationKey: 'spring-security-authentication'
homeFeatured: true
---

> Esta es la edición en español de mi artículo [publicado originalmente en DEV Community](https://dev.to/esteban389/demystifying-authentication-in-spring-security-57oj) el 19 de marzo de 2025.

La autenticación es una de las funciones fundamentales de las aplicaciones modernas. Está presente al iniciar sesión en un sitio web, acceder a una API o verificar una contraseña de un solo uso.

Si trabajas dentro del ecosistema de Spring, probablemente ya conoces Spring Security, el framework de referencia para gestionar autenticación y seguridad.

Pero seamos honestos: Spring Security puede resultar abrumador. Entre authentication providers, detalles de usuario y authentication managers, es fácil perderse. Si alguna vez te preguntaste «¿dónde se comprueba mi contraseña?», no eres el único.

En este artículo dividiré la autenticación en Spring Security en pasos sencillos. Compararemos un flujo básico de usuario y contraseña con la forma en que Spring Security resuelve cada paso internamente.

Al final tendrás un modelo más claro de lo que sucede detrás de escena. Empecemos.

## Entendiendo la autenticación básica

Antes de revisar cómo Spring Security maneja la autenticación, hablemos de por qué la necesitamos. En la mayoría de las aplicaciones queremos controlar el acceso a ciertas funciones o datos.

Para hacerlo necesitamos confirmar que los usuarios son quienes dicen ser. Eso es precisamente lo que hace la autenticación.

> En un sistema informático, la autenticación es el proceso que verifica que un usuario es quien afirma ser. [IBM: ¿Qué es la autenticación?](https://www.ibm.com/es-es/think/topics/authentication)

Aunque las aplicaciones web pueden ser muy diferentes, sus flujos de autenticación suelen parecerse. Un único flujo general puede cubrir la gran mayoría de los casos de uso.

![Diagrama de un flujo común de autenticación](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cgalqfpkhz1esducey85.png)

Veámoslo paso a paso.

### Visitar el servidor

Todo comienza cuando un usuario visita el sitio o hace una solicitud inicial al servidor. Según las necesidades de seguridad, el servidor puede incluir un token CSRF en su respuesta. Son los pasos 1 y 1.1 del diagrama.

Puedes pensar en el token CSRF como un pequeño «apretón de manos secreto» que ayuda a proteger la aplicación frente a determinados ataques.

### Solicitar un recurso autenticado

Luego, el usuario intenta acceder a un recurso que requiere autenticación: por ejemplo, una página o un endpoint de API disponible únicamente para usuarios que iniciaron sesión.

El servidor solicita credenciales para que el usuario demuestre su identidad. Algunas credenciales comunes son:

- Nombre de usuario y contraseña.
- Correo electrónico para enviar un magic link.
- Credenciales WebAuthn, como llaves físicas de seguridad.
- Cualquier otra prueba única de identidad.

Esto corresponde a los pasos 2 a 4 del diagrama.

### Buscar al usuario

Cuando las credenciales llegan al servidor, el siguiente paso es buscar al usuario en la base de datos o en otro sistema de almacenamiento.

Si el usuario no existe, el servidor devuelve un error inmediatamente, como muestran los pasos 5 a 7.1.

Si existe, pasamos a la fase final: comprobar la validez de sus credenciales.

### Autenticar

En este punto el servidor valida las credenciales. El proceso exacto depende del método de autenticación elegido:

- **Usuario y contraseña:** se aplica una función hash a la contraseña recibida y se compara con el hash almacenado.
- **Magic link:** se comprueba que el token del enlace sea válido y no haya expirado.
- **WebAuthn:** se verifica el desafío de seguridad con el dispositivo o navegador del usuario.

Si las credenciales son válidas, el servidor devuelve una respuesta exitosa junto con algún identificador, normalmente una cookie de sesión o un token como un JWT.

Así el usuario no necesita iniciar sesión de nuevo en cada solicitud. Esto corresponde a los pasos 7.2 y 8 del diagrama. Puedes pensar en ese identificador como una insignia que dice «ya inicié sesión».

Ahora veamos cómo Spring Security gestiona internamente cada uno de estos pasos.

### Relacionando el flujo con los componentes de Spring Security

Antes de profundizar, aclaremos algo. Si ya intentaste aprender Spring Security, probablemente escuchaste sobre CORS, la cadena de filtros y muchos otros conceptos.

En este artículo nos concentraremos exclusivamente en la autenticación y en cómo Spring Security la maneja en una API REST. Los mismos conceptos también pueden trasladarse a una aplicación full stack.

Esta tabla relaciona el flujo habitual con los componentes de Spring Security:

| **Paso del flujo**                | **Componente de Spring Security**                                   |
| --------------------------------- | ------------------------------------------------------------------- |
| El usuario envía sus credenciales | `Authentication`, por ejemplo `UsernamePasswordAuthenticationToken` |
| El servidor busca al usuario      | `UserDetailsService`                                                |
| Se comprueba si el usuario existe | `UsernameNotFoundException`                                         |
| Se verifican las credenciales     | `AuthenticationProvider`, por ejemplo `DaoAuthenticationProvider`   |
| Éxito o fallo de la autenticación | `AuthenticationManager` coordina el proceso                         |
| Se devuelve un identificador      | Normalmente lo gestiona un mecanismo de sesión o token              |

Es una vista de alto nivel. A continuación descompondremos cada parte.

### Authentication

Cada vez que un usuario accede a un recurso protegido debe demostrar su identidad mediante credenciales. Aquí entra en juego la interfaz `Authentication`.

Según la documentación de Spring, representa el token de una solicitud de autenticación o de un principal autenticado una vez procesada la solicitud mediante `AuthenticationManager.authenticate(Authentication)`.

El objeto `Authentication` contiene:

- Credenciales, como una contraseña.
- Permisos o authorities.
- El principal, que representa al usuario autenticado.
- El estado de autenticación.
- Otros detalles relacionados con la solicitud.

Una implementación común es `UsernamePasswordAuthenticationToken`. Otros ejemplos son:

- `OneTimeTokenAuthenticationToken`
- `AnonymousAuthenticationToken`
- `JwtAuthenticationToken`
- `BearerTokenAuthenticationToken`

Existen muchas más y también puedes crear una propia, aunque recomiendo hacerlo únicamente con fines de aprendizaje.

### UserDetailsService

Si has trabajado con Spring y el patrón MVC, probablemente conoces los servicios que conectan la lógica de negocio con las interacciones de base de datos.

En Spring Security, `UserDetailsService` es el punto habitual para recuperar los datos de un usuario.

La interfaz define un único método: `loadUserByUsername(String username)`. Su trabajo consiste en:

1. Localizar al usuario a partir del nombre proporcionado.
2. Devolver un objeto `UserDetails` centrado en la información de autenticación y autorización.

La entidad de usuario puede conservar otros atributos y extender otras clases. `UserDetails` solo ofrece una vista enfocada en seguridad.

Técnicamente podrías evitar `UserDetailsService` y `UserDetails` mediante un provider personalizado, pero estarías trabajando contra las convenciones del framework.

Spring incluye algunas implementaciones predeterminadas:

- `InMemoryUserDetailsManager`, útil para prototipos porque almacena todo en memoria.
- `JdbcDaoImpl`, que recupera los detalles mediante consultas JDBC.
- `JdbcUserDetailsManager`, una versión ampliada de `JdbcDaoImpl`.

### UsernameNotFoundException

Cuando `UserDetailsService` no encuentra al usuario, lanza `UsernameNotFoundException`.

Esta excepción extiende `AuthenticationException`, la clase base de los errores relacionados con intentos fallidos de autenticación. Otros ejemplos son:

- `BadCredentialsException`
- `AuthenticationCredentialsNotFoundException`
- `CompromisedPasswordException`

Estas excepciones permiten que Spring Security comunique qué salió mal durante el proceso.

### AuthenticationManager y AuthenticationProvider

Llegamos al punto donde se verifica que las credenciales sean correctas. El responsable es `AuthenticationManager`, que procesa un objeto `Authentication` autenticado o todavía sin autenticar.

La implementación más habitual es `ProviderManager`. Mantiene una lista de objetos `AuthenticationProvider` y los recorre hasta encontrar uno capaz de gestionar correctamente la solicitud.

```java
public Authentication authenticate(Authentication authentication) throws AuthenticationException {
	Class<? extends Authentication> toTest = authentication.getClass();
	AuthenticationException lastException = null;
	Authentication result = null;

	for (AuthenticationProvider provider : getProviders()) {
		if (!provider.supports(toTest)) {
			continue;
		}
		result = provider.authenticate(authentication);
		if (result != null) {
			copyDetails(authentication, result);
			break;
		}
	}
}
```

`ProviderManager` pregunta a cada provider si soporta el tipo de autenticación solicitado y se detiene cuando uno consigue autenticarla.

La interfaz `AuthenticationProvider` define dos métodos:

- `supports(Class<?> authentication)`: indica si el provider puede gestionar el tipo recibido.
- `authenticate(Authentication authentication)`: contiene la lógica que verifica las credenciales.

Spring Security ofrece implementaciones como `DaoAuthenticationProvider` para usuario y contraseña, o `JwtAuthenticationProvider` para JWT.

```java
@Override
public Authentication authenticate(Authentication authentication) throws AuthenticationException {
	BearerTokenAuthenticationToken bearer = (BearerTokenAuthenticationToken) authentication;
	Jwt jwt = getJwt(bearer);
	AbstractAuthenticationToken token = this.jwtAuthenticationConverter.convert(jwt);
	if (token.getDetails() == null) {
		token.setDetails(bearer.getDetails());
	}
	this.logger.debug("Authenticated token");
	return token;
}

@Override
public boolean supports(Class<?> authentication) {
	return BearerTokenAuthenticationToken.class.isAssignableFrom(authentication);
}
```

El provider convierte el objeto `Authentication` al tipo esperado, procesa el JWT y devuelve un token autenticado.

Si devuelve `null`, `ProviderManager` continúa con el siguiente. Este mecanismo permite encontrar la estrategia correcta para cada solicitud.

### Devolver una respuesta

Al terminar la autenticación, la aplicación debe responder. En una implementación propia esto podría significar:

- Configurar una cookie para autenticación basada en sesión.
- Devolver un JWT para una API stateless.
- Utilizar cualquier otro mecanismo elegido.

Por ejemplo, un `AuthController` podría exponer un endpoint de login que reciba este record:

```java
public record LoginRequest(String username, String passsword){}
```

El controlador crearía un `UsernamePasswordAuthenticationToken`, iniciaría el proceso y devolvería una cookie o un token según el resultado.

## Profundizando en el mecanismo de login de Spring Security

Hasta aquí cubrimos los elementos esenciales. Con estas piezas podrías construir tu propio flujo, pero vale la pena revisar la forma habitual en que Spring gestiona el login.

> Si esta sección introduce demasiados conceptos nuevos, puedes saltarla y volver después. Incluso una comprensión general ayuda a entender qué sucede internamente.

### ¿Cómo gestiona Spring Security el login?

Spring Security proporciona un mecanismo de login predeterminado. Cuando el usuario envía sus credenciales, la solicitud llega al endpoint de login configurado.

Spring Security intercepta la solicitud mediante `UsernamePasswordAuthenticationFilter` y ejecuta el flujo que acabamos de estudiar.

Si la autenticación tiene éxito, guarda el objeto `Authentication` en `SecurityContextHolder`. Antes de responder, persiste el `SecurityContext` mediante un `SecurityContextRepository`.

Esta secuencia permite mantener la autenticación entre distintas solicitudes.

![Reacción ante los nuevos conceptos](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tkgpv6rpa5gepvjpcbxj.png)

Es mucha información en muy poco espacio. Definamos nuevamente qué necesitamos y qué componente resuelve cada necesidad.

### ¿Qué es un filtro?

Spring Security se apoya en una cadena de filtros: una serie de filtros que procesan solicitudes y respuestas. Cada uno atiende tareas como autenticación, autorización o protección CSRF.

![Ilustración de una cadena de filtros](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/822rnemv0geujebgj54z.png)

[Arquitectura de Spring Security](https://docs.spring.io/spring-security/reference/servlet/architecture.html)

Cuando un cliente hace una solicitud HTTP:

- La solicitud pasa por varios filtros de seguridad.
- Se realizan las comprobaciones de autenticación y autorización.
- Si está permitida, llega al servlet para continuar su procesamiento.

Spring Boot configura estos filtros automáticamente. Puedes comenzar con una configuración como esta:

```java
@Bean
public UserDetailsService inMemoryUserDetails() {
    UserDetails admin = User.builder()
            .username("admin")
            .password("{noop}admin")
            .roles("ADMIN")
            .build();
    return new InMemoryUserDetailsManager(admin);
}

@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
            .authorizeHttpRequests(authorizeHttp -> {
                authorizeHttp.requestMatchers("/login").permitAll();
                authorizeHttp.anyRequest().authenticated();
            })
        .formLogin(withDefaults());
    return http.build();
}
```

Esta configuración:

- Crea un usuario administrador en memoria.
- Habilita el comportamiento predeterminado del login.
- Permite acceder a `/login` y protege los demás endpoints.

### Explorando la cadena de filtros de seguridad

Spring Security gestiona los filtros mediante `FilterChainProxy`, que contiene una o varias cadenas `SecurityFilterChain`.

La `SecurityFilterChain` es específica de Spring y se integra con el framework. No es lo mismo que la `FilterChain` estándar de Servlet.

Puedes inspeccionar las cadenas activas mediante este endpoint:

```java
@GetMapping
private Map<Integer, Map<Integer, String>> getSecurityFilterChainProxy(){
    Map<Integer, Map<Integer, String>> filterChains = new HashMap<>();

    int i = 1;
    for (SecurityFilterChain securityFilterChain : this.filterChainProxy.getFilterChains()){
        Map<Integer, String> filterChain = new HashMap<>();
        int j = 1;
        for (Filter filter : securityFilterChain.getFilters()){
            filterChain.put(j, filter.getClass().getName());
            j++;
        }
        filterChains.put(i, filterChain);
    }

    return filterChains;
}
```

Antes simplificamos un poco la explicación. En realidad, Spring registra un `FilterChainProxy` dentro de la cadena de filtros de Servlet.

Ese proxy contiene las cadenas de seguridad de Spring. Gracias a ello pueden utilizar características como `ApplicationContext`. Es la abstracción con la que trabajarás casi siempre.

El endpoint anterior obtiene las cadenas registradas en el proxy y devuelve los nombres de las clases de sus filtros. El resultado se parece a este:

```json
{
  "1": {
    "1": "org.springframework.security.web.session.DisableEncodeUrlFilter",
    "2": "org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter",
    "3": "org.springframework.security.web.context.SecurityContextHolderFilter",
    "4": "org.springframework.security.web.header.HeaderWriterFilter",
    "5": "org.springframework.security.web.csrf.CsrfFilter",
    "6": "org.springframework.security.web.authentication.logout.LogoutFilter",
    "7": "org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter",
    "8": "org.springframework.security.web.authentication.ui.DefaultResourcesFilter",
    "9": "org.springframework.security.web.authentication.ui.DefaultLoginPageGeneratingFilter",
    "10": "org.springframework.security.web.authentication.ui.DefaultLogoutPageGeneratingFilter",
    "11": "org.springframework.security.web.savedrequest.RequestCacheAwareFilter",
    "12": "org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter",
    "13": "org.springframework.security.web.authentication.AnonymousAuthenticationFilter",
    "14": "org.springframework.security.web.access.ExceptionTranslationFilter",
    "15": "org.springframework.security.web.access.intercept.AuthorizationFilter"
  }
}
```

### Filtros importantes de Spring Security

No explicaré cada filtro. Nos concentraremos en los que importan para este recorrido:

- **`SecurityContextHolderFilter`:** recupera el `SecurityContext` de la solicitud.
- **`CsrfFilter`:** comprueba los tokens CSRF cuando esta protección está habilitada.
- **`LogoutFilter`:** gestiona el cierre de sesión mediante `LogoutHandler` y redirige tras completarlo.
- **`UsernamePasswordAuthenticationFilter`:** extrae las credenciales del login y las entrega al mecanismo de autenticación.
- **`DefaultLoginPageGeneratingFilter`:** genera la página de login predeterminada.
- **`DefaultLogoutPageGeneratingFilter`:** genera la página de logout predeterminada.
- **`AnonymousAuthenticationFilter`:** asigna una autenticación anónima si no existe un usuario autenticado.
- **`ExceptionTranslationFilter`:** convierte `AccessDeniedException` y `AuthenticationException` en respuestas HTTP.
- **`AuthorizationFilter`:** aplica las políticas de autorización.

### Configurando la cadena de filtros

Este ejemplo configura varios de los filtros relevantes:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
            .securityContext(securityContextConfigurer ->
                    securityContextConfigurer.securityContextRepository(new MyCustonSecurityContextRepository())
            )
            .csrf(csrfConfigurer -> csrfConfigurer.disable())
            .logout(logoutConfigurer -> {
                logoutConfigurer.logoutUrl("/logout");
                logoutConfigurer.invalidateHttpSession(true);
            })
            .formLogin(loginConfigurer -> {
                        loginConfigurer.loginPage("/login");
                        loginConfigurer.failureForwardUrl("/login?error");
                        loginConfigurer.usernameParameter("username");
                    }
            )
            .anonymous(anonymousConfigurer -> {
                anonymousConfigurer.principal("anonymous");
            })
            .exceptionHandling(exceptionHandlingConfigurer -> {
                exceptionHandlingConfigurer.accessDeniedPage("/access-denied");
            })
            .authorizeHttpRequests(authorizeHttp -> {
                authorizeHttp.requestMatchers("/login").permitAll();
                authorizeHttp.anyRequest().authenticated();
            });
    return http.build();
}
```

Esta configuración:

- Define un `SecurityContextRepository` personalizado.
- Deshabilita CSRF si el caso de uso lo requiere.
- Personaliza el comportamiento de login y logout.
- Gestiona los usuarios anónimos y los accesos denegados.
- Exige autenticación en todas las rutas excepto `/login`.

Ahora podemos profundizar en la implementación de `UsernamePasswordAuthenticationFilter`, `LogoutFilter`, `AnonymousAuthenticationFilter`, `SecurityContextHolderFilter` y `SecurityContextRepository`.

### SecurityContextHolderFilter

Este filtro se asegura de establecer correctamente el `SecurityContext` antes de continuar con la solicitud.

Se ejecuta al principio de la cadena para que los filtros posteriores puedan acceder a la información de seguridad.

```java
private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {
    if (request.getAttribute(FILTER_APPLIED) != null) {
        chain.doFilter(request, response);
        return;
    }
    request.setAttribute(FILTER_APPLIED, Boolean.TRUE);
    Supplier<SecurityContext> deferredContext = this.securityContextRepository.loadDeferredContext(request);
    try {
        this.securityContextHolderStrategy.setDeferredContext(deferredContext);
        chain.doFilter(request, response);
    }
    finally {
        this.securityContextHolderStrategy.clearContext();
        request.removeAttribute(FILTER_APPLIED);
    }
}
```

La implementación comprueba si el filtro ya fue aplicado. Si todavía no lo fue, entrega al `SecurityContextHolder` la operación que cargará el contexto y continúa con el siguiente filtro.

Al finalizar, limpia el contexto y elimina la marca que identifica la ejecución del filtro.

### SecurityContextRepository

Sus responsabilidades principales son:

- Recuperar y restaurar el `SecurityContext` durante una solicitud.
- Persistir el contexto entre solicitudes cuando se usa autenticación basada en sesión.

Dos implementaciones comunes son:

- `HttpSessionSecurityContextRepository`, que almacena el contexto en la sesión HTTP.
- `RequestAttributeSecurityContextRepository`, que lo almacena en los atributos de la solicitud.

### AnonymousAuthenticationFilter

Este filtro asigna un objeto `Authentication` anónimo cuando no hay un usuario autenticado.

Así, incluso los usuarios sin autenticar disponen de un `SecurityContext` válido. La autenticación anónima utiliza normalmente `ROLE_ANONYMOUS`, lo que permite reglas de acceso más precisas.

Veamos una parte de la implementación:

```java
private SecurityContext defaultWithAnonymous(HttpServletRequest request, SecurityContext currentContext) {
	Authentication currentAuthentication = currentContext.getAuthentication();
	if (currentAuthentication == null) {
		Authentication anonymous = createAuthentication(request);
		if (this.logger.isTraceEnabled()) {
			this.logger.trace(LogMessage.of(() -> "Set SecurityContextHolder to " + anonymous));
		}
		else {
			this.logger.debug("Set SecurityContextHolder to anonymous SecurityContext");
		}
		SecurityContext anonymousContext = this.securityContextHolderStrategy.createEmptyContext();
		anonymousContext.setAuthentication(anonymous);
		return anonymousContext;
	}
	else {
		if (this.logger.isTraceEnabled()) {
			this.logger.trace(LogMessage.of(() -> "Did not set SecurityContextHolder since already authenticated "
					+ currentAuthentication));
		}
	}
	return currentContext;
}

protected Authentication createAuthentication(HttpServletRequest request) {
	AnonymousAuthenticationToken token = new AnonymousAuthenticationToken(this.key, this.principal,
			this.authorities);
	token.setDetails(this.authenticationDetailsSource.buildDetails(request));
	return token;
}
```

`defaultWithAnonymous` obtiene la autenticación actual. Si ya existe, registra que no necesita modificar `SecurityContextHolder`.

Si no existe, crea un `AnonymousAuthenticationToken`, crea un contexto vacío y coloca allí la autenticación.

El token anónimo utiliza una clave, un principal representado como `String` y los detalles construidos a partir de la solicitud HTTP, como la dirección IP y el identificador de sesión.

### UsernamePasswordAuthenticationFilter

Este filtro es un poco especial. Los filtros personalizados suelen extender `GenericFilterBean` o `OncePerRequestFilter`.

Sin embargo, los filtros que manejan autenticaciones HTTP basadas en navegador, como `UsernamePasswordAuthenticationFilter`, `OAuth2LoginAuthenticationFilter` o `WebAuthnAuthenticationFilter`, extienden `AbstractAuthenticationProcessingFilter`.

Esta clase requiere:

- Un `AuthenticationManager` que procese la solicitud de autenticación.
- Un `RequestMatcher` que decida si debe intentarse la autenticación para la solicitud actual.

También define el flujo que invoca `attemptAuthentication`. Si la autenticación tiene éxito, el resultado se coloca en el `SecurityContext` y se llama al `AuthenticationSuccessHandler` configurado.

Si falla, el proceso delega en un `AuthenticationFailureHandler`.

La implementación de `UsernamePasswordAuthenticationFilter` es relativamente sencilla:

```java
@Override
public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
        throws AuthenticationException {
    if (this.postOnly && !request.getMethod().equals("POST")) {
        throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
    }
    String username = obtainUsername(request);
    username = (username != null) ? username.trim() : "";
    String password = obtainPassword(request);
    password = (password != null) ? password : "";
    UsernamePasswordAuthenticationToken authRequest = UsernamePasswordAuthenticationToken.unauthenticated(username,
            password);
    // Allow subclasses to set the "details" property
    setDetails(request, authRequest);
    return this.getAuthenticationManager().authenticate(authRequest);
}
```

Primero comprueba si la solicitud debe ser `POST`. Después obtiene el usuario y la contraseña, crea un objeto `Authentication` con los detalles de la solicitud y lo entrega al `AuthenticationManager`.

Veamos cómo lo usa `AbstractAuthenticationProcessingFilter`:

```java
private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
    if (!this.requiresAuthentication(request, response)) {
        chain.doFilter(request, response);
    } else {
        try {
            Authentication authenticationResult = this.attemptAuthentication(request, response);
            if (authenticationResult == null) {
                return;
            }

            this.sessionStrategy.onAuthentication(authenticationResult, request, response);
            if (this.continueChainBeforeSuccessfulAuthentication) {
                chain.doFilter(request, response);
            }

            this.successfulAuthentication(request, response, chain, authenticationResult);
        } catch (InternalAuthenticationServiceException failed) {
            this.logger.error("An internal error occurred while trying to authenticate the user.", failed);
            this.unsuccessfulAuthentication(request, response, failed);
        } catch (AuthenticationException ex) {
            this.unsuccessfulAuthentication(request, response, ex);
        }
    }
}

protected boolean requiresAuthentication(HttpServletRequest request, HttpServletResponse response) {
    if (this.requiresAuthenticationRequestMatcher.matches(request)) {
        return true;
    } else {
        if (this.logger.isTraceEnabled()) {
            this.logger.trace(LogMessage.format("Did not match request to %s", this.requiresAuthenticationRequestMatcher));
        }
        return false;
    }
}
```

El filtro usa el `RequestMatcher` configurado para decidir si debe autenticar. Si corresponde, llama a `attemptAuthentication`.

Cuando el resultado es exitoso, ejecuta algunas operaciones adicionales y finalmente llama a `successfulAuthentication`. Si el proceso falla, utiliza `unsuccessfulAuthentication` y el handler configurado.

```java
protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
        Authentication authResult) throws IOException, ServletException {
    SecurityContext context = this.securityContextHolderStrategy.createEmptyContext();
    context.setAuthentication(authResult);
    this.securityContextHolderStrategy.setContext(context);
    this.securityContextRepository.saveContext(context, request, response);
    if (this.logger.isDebugEnabled()) {
        this.logger.debug(LogMessage.format("Set SecurityContextHolder to %s", authResult));
    }
    this.rememberMeServices.loginSuccess(request, response, authResult);
    if (this.eventPublisher != null) {
        this.eventPublisher.publishEvent(new InteractiveAuthenticationSuccessEvent(authResult, this.getClass()));
    }
    this.successHandler.onAuthenticationSuccess(request, response, authResult);
}
```

Aquí aparecen operaciones como la publicación de eventos y los servicios de remember-me. La parte que quiero destacar es la persistencia del contexto mediante `SecurityContextRepository`.

Ese bean procede de la configuración. Las implementaciones predeterminadas de estos filtros suelen configurarse con el builder `HttpSecurity` de `SecurityFilterChain`.

Más concretamente, se utilizan clases que extienden `AbstractAuthenticationFilterConfigurer`, como `FormLoginConfigurer`.

```java
@Override
public void configure(B http) throws Exception {
	...
	SecurityContextConfigurer securityContextConfigurer = http.getConfigurer(SecurityContextConfigurer.class);
	if (securityContextConfigurer != null && securityContextConfigurer.isRequireExplicitSave()) {
		SecurityContextRepository securityContextRepository = securityContextConfigurer
			.getSecurityContextRepository();
		this.authFilter.setSecurityContextRepository(securityContextRepository);
	}
	this.authFilter.setSecurityContextHolderStrategy(getSecurityContextHolderStrategy());
	F filter = postProcess(this.authFilter);
	http.addFilter(filter);
}
```

Este configurer obtiene el repositorio necesario para guardar y recuperar sesiones cuando así se configuró.

En el ejemplo anterior de la cadena de filtros, el método `.securityContext()` corresponde a `SecurityContextConfigurer`. Revisemos qué repositorio usa de forma predeterminada:

```java
SecurityContextRepository getSecurityContextRepository() {
	SecurityContextRepository securityContextRepository = getBuilder()
		.getSharedObject(SecurityContextRepository.class);
	if (securityContextRepository == null) {
		securityContextRepository = new DelegatingSecurityContextRepository(
				new RequestAttributeSecurityContextRepository(), new HttpSessionSecurityContextRepository());
	}
	return securityContextRepository;
}
```

Spring utiliza el repositorio proporcionado en la configuración o crea un `DelegatingSecurityContextRepository` compuesto por:

- `RequestAttributeSecurityContextRepository`, que persiste el contexto únicamente durante la solicitud actual.
- `HttpSessionSecurityContextRepository`, que persiste el contexto en la sesión HTTP.

Hay algunos detalles adicionales, pero no son indispensables para comprender el resto del flujo.

### LogoutFilter

`LogoutFilter` usa una serie de objetos `LogoutHandler` en el orden configurado.

Después de un logout exitoso realiza una redirección mediante `LogoutSuccessHandler` o la `logoutSuccessUrl` configurada.

Su implementación se parece a la anterior, así que revisaremos uno de los handlers que Spring proporciona:

```java
@Override
public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
	Assert.notNull(request, "HttpServletRequest required");
	if (this.invalidateHttpSession) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			session.invalidate();
			if (this.logger.isDebugEnabled()) {
				this.logger.debug(LogMessage.format("Invalidated session %s", session.getId()));
			}
		}
	}
	SecurityContext context = this.securityContextHolderStrategy.getContext();
	this.securityContextHolderStrategy.clearContext();
	if (this.clearAuthentication) {
		context.setAuthentication(null);
	}
	SecurityContext emptyContext = this.securityContextHolderStrategy.createEmptyContext();
	this.securityContextRepository.saveContext(emptyContext, request, response);
}
```

El código pertenece a `SecurityContextLogoutHandler`, uno de los handlers predeterminados de Spring Security.

Comprueba que exista una solicitud y, si está configurado para hacerlo, invalida la sesión. Luego limpia el contexto y puede eliminar también la autenticación.

Finalmente utiliza `SecurityContextRepository` para persistir un contexto sin autenticar.

## Conclusión y próximos pasos

Hemos recorrido los componentes principales del flujo de autenticación de Spring Security: desde piezas sencillas como la interfaz `Authentication` hasta elementos más complejos como `SecurityContextRepository`.

Entender cómo colaboran permite comprender mejor lo que Spring Security hace detrás de escena. También ayuda a decidir cuándo usar las implementaciones predeterminadas y cuándo escribir una propia.

Quiero continuar esta serie con implementaciones de autenticación personalizadas y mecanismos alternativos a usuario y contraseña.

También podría cubrir configuraciones con OAuth2, autenticación basada en JWT y estrategias de control de acceso más detalladas.

No soy un experto en seguridad ni en Spring. Preparar estos artículos requiere mucha documentación y cada entrega tomará tiempo.

Si tienes preguntas o sugerencias, me encantará leerlas. Gracias por llegar hasta aquí.
