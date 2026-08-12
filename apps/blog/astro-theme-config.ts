type NavItem = {
  label: string;
  href: string;
};

type CareerItem = {
  period: string;
  title: string;
  description: string;
};

/**
 * astro-theme-config.ts
 *
 * Central configuration for the Tone theme.
 * Most site-level customization should happen in this file.
 */

const config = {
  site: {
    /** Production origin, used for canonical links, sitemap, and Open Graph metadata. */
    url: 'https://blog.estebanmurcia.dev',
    /** Subpath such as '/repo-name'. Keep empty when deploying at a domain root. */
    base: '',
    lang: 'en',
    locale: 'en_US',
    dateLocale: 'en-US',
    title: "Esteban's Blog",
    logoLabel: 'Esteban',
    description: 'Technical articles, working notes, and lessons from building software.',
    author: 'Esteban',
    /** Add an absolute or root-relative image after creating blog-specific social artwork. */
    defaultOgImage: '',
  },

  // The logo already links to `/`. Add items here if you want visible header links.
  // Example: [{ label: 'Posts', href: '/posts' }, { label: 'About', href: '/about' }]
  nav: [] as NavItem[],

  // Footer links stay visible by default so readers have a stable way to move around.
  footerNav: [
    { label: 'Posts', href: '/posts' },
    { label: 'About', href: '/about' },
    { label: 'Search', href: '/search' },
  ] as NavItem[],

  content: {
    categoryOrder: ['Technical Articles', 'Notes'],
  },

  behavior: {
    smoothScroll: true,
  },

  comments: {
    // One-line switch after you fill the giscus values:
    // mode: 'off'           -> no comments
    // mode: 'giscus'        -> original giscus theme
    // mode: 'giscus-custom' -> Tone custom giscus theme
    // Local preview can also use PUBLIC_GISCUS_MODE and PUBLIC_GISCUS_* in .env.local.
    mode: 'off',
    provider: 'giscus',
    giscus: {
      repo: '',
      repoId: '',
      category: '',
      categoryId: '',
      mapping: 'pathname',
      strict: '0',
      reactionsEnabled: '0',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: 'preferred_color_scheme',
      customLightTheme: '/giscus-light.css',
      customDarkTheme: '/giscus-dark.css',
      lang: 'en',
      loading: 'eager',
    },
  },

  social: {
    website: '', // Add the production URL after the domain is chosen.
    email: '', // e.g. 'hello@your-site.com'
    linkedin: '', // e.g. 'https://www.linkedin.com/in/yourhandle'
    github: 'https://github.com/esteban389',
  },

  about: {
    /** Profile image URL. Leave empty to use the text-only About layout. */
    profileImage: '',
    name: 'Esteban',
    role: 'Software engineer writing about the systems and decisions behind the code.',
    location: 'UTC-5',
    focus: 'Backend engineering, architecture, and deliberate learning.',
    lead: 'I write technical articles and working notes about building software, understanding tradeoffs, and keeping useful lessons accessible.',
    headline: ['Build.', 'Understand.'],
    statementLabel: 'Writing',
    statementTitle: 'Technical work, made explicit.',
    statement:
      'The goal is to turn implementation details, architectural decisions, experiments, and reading notes into explanations that remain useful after the immediate problem is gone.',
    careerLabel: 'Experience',
    career: [] as CareerItem[],
    interests: [
      'Backend engineering and distributed systems',
      'Software architecture and explicit tradeoffs',
      'Learning through experiments, notes, and explanation',
    ],
    interestsLabel: 'Topics',
    interestsHeading: 'What I keep returning to',
  },
};

export default config;
