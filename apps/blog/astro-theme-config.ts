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

  i18n: {
    defaultLocale: 'en',
    locales: {
      en: {
        lang: 'en',
        locale: 'en_US',
        dateLocale: 'en-US',
        title: "Esteban's Blog",
        description: 'Technical articles, working notes, and lessons from building software.',
      },
      es: {
        lang: 'es',
        locale: 'es_CO',
        dateLocale: 'es-CO',
        title: 'Blog de Esteban',
        description:
          'Artículos técnicos, notas de trabajo y lecciones aprendidas construyendo software.',
      },
    },
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
    linkedin: 'https://www.linkedin.com/in/estebanamurciaa/',
    github: 'https://github.com/esteban389',
  },

  about: {
    /** Profile image URL. Leave empty to use the text-only About layout. */
    profileImage: '',
    name: 'Esteban',
    locales: {
      en: {
        pageTitle: 'About',
        role: 'Software engineer writing about the systems and decisions behind the code.',
        location: 'Colombia',
        focus: 'Backend engineering, architecture, and deliberate learning.',
        lead: 'I write technical articles and working notes about building software, understanding tradeoffs, and keeping useful lessons accessible.',
        headline: ['Build.', 'Understand.'],
        statementLabel: 'Writing',
        statementTitle: 'Technical work, made explicit.',
        statement:
          'The goal is to turn implementation details, architectural decisions, experiments, and reading notes into explanations that remain useful after the immediate problem is gone.',
        careerLabel: 'Experience',
        career: [
          {
            period: 'Sep 2023 — Present',
            title: 'Software Engineer · Plumii (formerly Euler)',
            description:
              'I build and operate Java 17 and Spring Boot services for a production Student Information System. My work includes historical-data modeling, Keycloak identity reliability, transactional workflows, reporting, query performance, incident diagnosis, Jenkins releases, and technical coordination for up to three junior developers.',
          },
          {
            period: 'Jan 2025 — Jun 2025',
            title: 'Full-Stack Developer Intern · Instituto Departamental de Salud',
            description:
              'I owned an institutional document-management platform from requirements and relational modeling through Laravel and MySQL implementation, deployment, and support. The system includes role-based access, document version history, and controlled public access, and remains in use.',
          },
          {
            period: '2024 — 2025',
            title: 'Sole Software Developer · Universidad Libre',
            description:
              'I designed, built, tested, and deployed a production university system with Laravel, Next.js, and MySQL. I owned the architecture, access control, auditing, surveys, reports, Docker deployment, database hosting, backups, and post-delivery support.',
          },
        ] as CareerItem[],
        interests: [
          'Backend engineering and distributed systems',
          'Software architecture and explicit tradeoffs',
          'Learning through experiments, notes, and explanation',
        ],
        interestsLabel: 'Topics',
        interestsHeading: 'What I keep returning to',
        profileAriaLabel: 'Profile preview',
        profileAlt: 'Esteban profile portrait',
        metaLabels: {
          location: 'Location',
          focus: 'Focus',
          links: 'Links',
        },
      },
      es: {
        pageTitle: 'Acerca de mí',
        role: 'Ingeniero de software que escribe sobre los sistemas y las decisiones detrás del código.',
        location: 'Colombia',
        focus: 'Ingeniería backend, arquitectura y aprendizaje deliberado.',
        lead: 'Escribo artículos técnicos y notas de trabajo sobre la construcción de software, sus decisiones y las lecciones que vale la pena conservar.',
        headline: ['Construir.', 'Entender.'],
        statementLabel: 'Escritura',
        statementTitle: 'El trabajo técnico, hecho explícito.',
        statement:
          'El objetivo es convertir detalles de implementación, decisiones de arquitectura, experimentos y notas de aprendizaje en explicaciones que sigan siendo útiles después de resolver el problema inmediato.',
        careerLabel: 'Experiencia',
        career: [
          {
            period: 'Sep 2023 — Actualidad',
            title: 'Ingeniero de software · Plumii (antes Euler)',
            description:
              'Construyo y opero servicios con Java 17 y Spring Boot para un sistema de información estudiantil en producción. Mi trabajo incluye modelado de datos históricos, confiabilidad de identidad con Keycloak, flujos transaccionales, reportes, rendimiento de consultas, diagnóstico de incidentes, despliegues con Jenkins y coordinación técnica de hasta tres desarrolladores junior.',
          },
          {
            period: 'Ene 2025 — Jun 2025',
            title: 'Desarrollador full-stack en práctica · Instituto Departamental de Salud',
            description:
              'Me encargué de una plataforma institucional de gestión documental desde los requisitos y el modelado relacional hasta su implementación con Laravel y MySQL, despliegue y soporte. El sistema incluye acceso por roles, historial de versiones y acceso público controlado, y continúa en uso.',
          },
          {
            period: '2024 — 2025',
            title: 'Único desarrollador de software · Universidad Libre',
            description:
              'Diseñé, construí, probé y desplegué un sistema universitario en producción con Laravel, Next.js y MySQL. Me encargué de la arquitectura, el control de acceso, la auditoría, las encuestas, los reportes, el despliegue con Docker, el alojamiento de la base de datos, las copias de seguridad y el soporte posterior.',
          },
        ] as CareerItem[],
        interests: [
          'Ingeniería backend y sistemas distribuidos',
          'Arquitectura de software y decisiones explícitas',
          'Aprendizaje mediante experimentos, notas y explicaciones',
        ],
        interestsLabel: 'Temas',
        interestsHeading: 'Los temas a los que siempre regreso',
        profileAriaLabel: 'Resumen del perfil',
        profileAlt: 'Retrato de perfil de Esteban',
        metaLabels: {
          location: 'Ubicación',
          focus: 'Enfoque',
          links: 'Enlaces',
        },
      },
    },
  },
};

export default config;
