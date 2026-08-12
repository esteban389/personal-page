const en = {
  backLink: '← All Posts',
  readingTime: (n: number) => `${n} min read`,
  updated: 'Updated',
  relatedPosts: 'Related',
  allPosts: 'All Posts →',
  postsEyebrow: 'Archive',
  postsTitle: 'All Posts',
  heroTitle: 'Build. Learn.',
  heroTitleLine2: 'Write.',
  viewAll: 'All Posts →',
  readLink: 'Read →',
  postFeed: {
    all: 'All',
    filterLabel: 'Filter posts by category',
    previousCategories: 'Scroll categories left',
    nextCategories: 'Scroll categories right',
    searchLabel: 'Search posts',
    empty: 'No posts match this filter.',
    more: 'Load more',
    read: 'Read',
  },
  search: {
    title: 'Search',
    description: 'Search posts',
    loading: 'Loading search...',
    requiresJavaScript: 'Search needs JavaScript.',
    browseArchive: 'Browse the posts archive instead.',
    placeholder: 'Search posts...',
    zeroResults: 'No results for [QUERY]',
    productionOnly: 'Search is available after a production build.',
  },
  navigation: {
    posts: 'Posts',
    about: 'About',
    search: 'Search',
    switchLanguage: 'Leer en español',
  },
};

const es = {
  backLink: '← Todos los artículos',
  readingTime: (n: number) => `${n} min de lectura`,
  updated: 'Actualizado',
  relatedPosts: 'Relacionados',
  allPosts: 'Todos los artículos →',
  postsEyebrow: 'Archivo',
  postsTitle: 'Todos los artículos',
  heroTitle: 'Construye. Aprende.',
  heroTitleLine2: 'Escribe.',
  viewAll: 'Todos los artículos →',
  readLink: 'Leer →',
  postFeed: {
    all: 'Todos',
    filterLabel: 'Filtrar artículos por categoría',
    previousCategories: 'Desplazar categorías a la izquierda',
    nextCategories: 'Desplazar categorías a la derecha',
    searchLabel: 'Buscar artículos',
    empty: 'Ningún artículo coincide con este filtro.',
    more: 'Cargar más',
    read: 'Leer',
  },
  search: {
    title: 'Buscar',
    description: 'Buscar artículos',
    loading: 'Cargando búsqueda...',
    requiresJavaScript: 'La búsqueda necesita JavaScript.',
    browseArchive: 'Puedes consultar el archivo de artículos.',
    placeholder: 'Buscar artículos...',
    zeroResults: 'No hay resultados para [QUERY]',
    productionOnly: 'La búsqueda está disponible después de generar la versión de producción.',
  },
  navigation: {
    posts: 'Artículos',
    about: 'Acerca de',
    search: 'Buscar',
    switchLanguage: 'Read in English',
  },
};

const dictionaries = { en, es };

export function getUiText(locale: keyof typeof dictionaries = 'en') {
  return dictionaries[locale];
}
