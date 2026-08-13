export type Locale = 'en' | 'es';

const shared = {
  name: 'Esteban Murcia',
  siteUrl: 'https://estebanmurcia.dev',
  blogUrl: 'https://blog.estebanmurcia.dev',
  githubUrl: 'https://github.com/esteban389',
  linkedinUrl: 'https://www.linkedin.com/in/esteban-andres-murcia',
  email: 'estebana.murciaa@gmail.com',
  skills: [
    'Java 17',
    'Spring Boot',
    'REST APIs',
    'JPA / Hibernate',
    'MySQL',
    'Flyway',
    'Keycloak',
    'Jenkins',
    'Docker',
    'Grafana / Loki',
    'Next.js',
    'React',
    'TypeScript',
  ],
} as const;

export const portfolios = {
  en: {
    ...shared,
    locale: 'en',
    role: 'Java Backend Engineer',
    description:
      'Backend engineer building reliable, data-heavy business systems with Java, Spring Boot, and MySQL.',
    greeting: 'Hi, I’m Esteban',
    about:
      'I have nearly three years of experience building and operating production software used by nine institutions in Colombia. I work across backend services, data integrity, identity, reporting, production diagnosis, and delivery—and I step into the frontend when the product needs it.',
    labels: {
      home: 'Home',
      work: 'Work experience',
      projects: 'Projects',
      blog: 'Blog',
      theme: 'Toggle color theme',
      language: 'Versión en español',
      about: 'About',
      education: 'Education',
      skills: 'Skills',
      selectedSystems: 'Selected systems',
      productionWork: 'Production work',
      systemsIntro:
        'A few systems I’ve helped take from requirements and incidents to dependable production software.',
      certifications: 'Certifications',
      contact: 'Contact',
      getInTouch: 'Get in touch',
      contactCopy:
        'Have a backend problem, a production system to improve, or just want to compare notes?',
      emailMe: 'Email me',
    },
    work: [
      {
        company: 'Plumii (formerly Euler)',
        role: 'Software Engineer · Independent Contractor',
        period: 'Sep 2023 - Present',
        location: 'Remote, Colombia',
        description:
          'Build and operate Java 17 and Spring Boot services for a production Student Information System. My work includes historical-data modeling, Keycloak identity reliability, transactional workflows, reporting, query performance, incident diagnosis, Jenkins releases, and technical coordination for up to three junior developers.',
      },
      {
        company: 'Instituto Departamental de Salud',
        role: 'Full-Stack Developer Intern',
        period: 'Jan 2025 - Jun 2025',
        location: 'Cúcuta, Colombia',
        description:
          'Owned an institutional document-management platform from requirements and relational modeling through Laravel/MySQL implementation, deployment, and support. The system includes role-based access, document version history, and controlled public access, and remains in use.',
      },
      {
        company: 'Universidad Libre',
        role: 'Sole Software Developer · Thesis Project',
        period: '2024 - 2025',
        location: 'Cúcuta, Colombia',
        description:
          'Designed, built, tested, and deployed a production university system with Laravel, Next.js, and MySQL. Owned the architecture, RBAC, auditing, surveys, reports, Docker deployment, database hosting, backups, and post-delivery support.',
      },
    ],
    education: {
      institution: 'Universidad Libre',
      degree: 'Information and Communications Technology Engineering',
      period: '2025',
    },
    systems: [
      {
        name: 'Student Information System',
        status: 'Production · 9 institutions',
        description:
          'Enrollment, grades, identity, historical records, reporting, and document generation for Colombian educational institutions.',
        technologies: ['Java', 'Spring Boot', 'MySQL', 'Keycloak', 'Jenkins'],
      },
      {
        name: 'Institutional Document Platform',
        status: 'Deployed · In use',
        description:
          'Governed document publishing with departmental access, version history, role-based administration, and public access controls.',
        technologies: ['Laravel', 'MySQL', 'Apache', 'RBAC'],
      },
      {
        name: 'University Thesis Platform',
        status: 'Production · University hosted',
        description:
          'A full-stack system with auditing, surveys, reports, access control, backups, and deployment to university-owned infrastructure.',
        technologies: ['Laravel', 'Next.js', 'MySQL', 'Docker'],
      },
    ],
    certifications: [
      'Meta Back-End Developer Professional Certificate',
      'Spring Framework · LearnQuest / Coursera',
      'Database Design · Oracle Academy',
    ],
  },
  es: {
    ...shared,
    locale: 'es',
    role: 'Ingeniero Backend Java',
    description:
      'Ingeniero backend que construye sistemas de negocio confiables e intensivos en datos con Java, Spring Boot y MySQL.',
    greeting: 'Hola, soy Esteban',
    about:
      'Tengo casi tres años de experiencia construyendo y operando software en producción usado por nueve instituciones en Colombia. Trabajo en servicios backend, integridad de datos, identidad, reportes, diagnóstico en producción y entregas; también intervengo en el frontend cuando el producto lo necesita.',
    labels: {
      home: 'Inicio',
      work: 'Experiencia laboral',
      projects: 'Proyectos',
      blog: 'Blog',
      theme: 'Cambiar tema de color',
      language: 'English version',
      about: 'Acerca de mí',
      education: 'Educación',
      skills: 'Habilidades',
      selectedSystems: 'Sistemas seleccionados',
      productionWork: 'Trabajo en producción',
      systemsIntro:
        'Algunos sistemas que he ayudado a llevar desde requisitos e incidentes hasta software confiable en producción.',
      certifications: 'Certificaciones',
      contact: 'Contacto',
      getInTouch: 'Hablemos',
      contactCopy:
        '¿Tienes un problema de backend, un sistema en producción por mejorar o simplemente quieres intercambiar ideas?',
      emailMe: 'Escríbeme',
    },
    work: [
      {
        company: 'Plumii (antes Euler)',
        role: 'Ingeniero de software · Contratista independiente',
        period: 'Sep 2023 - Actualidad',
        location: 'Remoto, Colombia',
        description:
          'Construyo y opero servicios con Java 17 y Spring Boot para un sistema de información estudiantil en producción. Mi trabajo incluye modelado de datos históricos, confiabilidad de identidad con Keycloak, flujos transaccionales, reportes, rendimiento de consultas, diagnóstico de incidentes, despliegues con Jenkins y coordinación técnica de hasta tres desarrolladores junior.',
      },
      {
        company: 'Instituto Departamental de Salud',
        role: 'Desarrollador full-stack en práctica',
        period: 'Ene 2025 - Jun 2025',
        location: 'Cúcuta, Colombia',
        description:
          'Me encargué de una plataforma institucional de gestión documental desde los requisitos y el modelado relacional hasta su implementación con Laravel/MySQL, despliegue y soporte. El sistema incluye acceso por roles, historial de versiones y acceso público controlado, y continúa en uso.',
      },
      {
        company: 'Universidad Libre',
        role: 'Único desarrollador de software · Proyecto de grado',
        period: '2024 - 2025',
        location: 'Cúcuta, Colombia',
        description:
          'Diseñé, construí, probé y desplegué un sistema universitario en producción con Laravel, Next.js y MySQL. Me encargué de la arquitectura, RBAC, auditoría, encuestas, reportes, despliegue con Docker, alojamiento de la base de datos, copias de seguridad y soporte posterior.',
      },
    ],
    education: {
      institution: 'Universidad Libre',
      degree: 'Ingeniería en Tecnologías de la Información y las Comunicaciones',
      period: '2025',
    },
    systems: [
      {
        name: 'Sistema de información estudiantil',
        status: 'Producción · 9 instituciones',
        description:
          'Matrículas, calificaciones, identidad, registros históricos, reportes y generación de documentos para instituciones educativas colombianas.',
        technologies: ['Java', 'Spring Boot', 'MySQL', 'Keycloak', 'Jenkins'],
      },
      {
        name: 'Plataforma institucional de documentos',
        status: 'Desplegada · En uso',
        description:
          'Publicación gobernada de documentos con acceso departamental, historial de versiones, administración por roles y controles de acceso público.',
        technologies: ['Laravel', 'MySQL', 'Apache', 'RBAC'],
      },
      {
        name: 'Plataforma universitaria de grado',
        status: 'Producción · Alojada por la universidad',
        description:
          'Sistema full-stack con auditoría, encuestas, reportes, control de acceso, copias de seguridad y despliegue en infraestructura universitaria.',
        technologies: ['Laravel', 'Next.js', 'MySQL', 'Docker'],
      },
    ],
    certifications: [
      'Certificado profesional Meta Back-End Developer',
      'Spring Framework · LearnQuest / Coursera',
      'Database Design · Oracle Academy',
    ],
  },
} as const;

export type Portfolio = (typeof portfolios)[Locale];
