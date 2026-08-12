export const portfolio = {
  name: 'Esteban Murcia',
  initials: 'EM',
  role: 'Java Backend Engineer',
  description:
    'Java backend engineer building and operating correctness-sensitive, data-heavy systems with Spring Boot, MySQL, REST APIs, and Keycloak.',
  location: 'Cúcuta, Colombia',
  siteUrl: 'https://estebanmurcia.dev',
  blogUrl: 'https://blog.estebanmurcia.dev',
  githubUrl: 'https://github.com/esteban389',
  linkedinUrl: 'https://www.linkedin.com/in/esteban-andres-murcia',
  email: 'estebana.murciaa@gmail.com',
  phone: '+57 310 778 4403',
  about:
    'I have nearly three years of experience building and operating production software, including a Student Information System used by nine institutions in Colombia. My work spans historical-data modeling, identity consistency, transactional workflows, reporting, production diagnosis, deployments, and technical coordination.',
  focus: [
    'Java 17',
    'Spring Boot',
    'REST APIs',
    'JPA / Hibernate',
    'MySQL & SQL',
    'Flyway',
    'Keycloak',
    'Docker',
    'Jenkins',
    'Grafana & Loki',
    'Next.js & React',
    'TypeScript',
  ],
  experience: [
    {
      organization: 'Plumii (formerly Euler)',
      role: 'Software Engineer · Independent Contractor',
      location: 'Remote, Colombia',
      period: 'Sep 2023 - Present',
      summary:
        'Build Java 17 and Spring Boot services for a production Student Information System covering enrollment, grades, identity, reporting, and administration.',
      highlights: [
        'Introduced historical and time-scoped data models, migrated legacy relationships, and corrected records that produced inaccurate certificates and enrollment states.',
        'Improved identity reliability with Keycloak provisioning retries, account reconciliation, and deterministic identity matching.',
        'Reworked evaluation-assignment generation using bulk retrieval, deduplication, batching, indexes, and transactional safeguards to eliminate N+1-style access patterns.',
        'Diagnose production incidents across logs, database state, request flows, code, and deployed configuration; deliver releases through Jenkins.',
        'Assign tasks, review pull requests, and guide delivery for up to three junior developers.',
      ],
    },
    {
      organization: 'Instituto Departamental de Salud (IDS)',
      role: 'Full-Stack Developer Intern',
      location: 'Cúcuta, Colombia',
      period: 'Jan 2025 - Jun 2025',
      summary:
        'Owned the lifecycle of an institutional document-management platform from requirements and relational modeling through implementation, deployment, and support.',
      highlights: [
        'Built the application with Laravel and MySQL, including administrator provisioning, RBAC, departmental access, uploads, and document version history.',
        'Configured Apache as a reverse proxy in a legacy PHP/MySQL environment; the application remains in use and received follow-up support in 2026.',
      ],
    },
    {
      organization: 'Universidad Libre',
      role: 'Sole Software Developer · University Thesis Project',
      location: 'Cúcuta, Colombia',
      period: '2024 - 2025',
      summary:
        'Owned requirements, architecture, documentation, data modeling, backend, frontend, auditing, surveys, reports, and testing for a production university system.',
      highlights: [
        'Built the system with Laravel, Next.js, and MySQL, with RBAC and auditing.',
        'Dockerized and deployed it to university-owned physical servers, moved MySQL to the host, and introduced backups after identifying container-volume data-loss risk.',
      ],
    },
  ],
  education: {
    institution: 'Universidad Libre',
    degree: 'Information and Communications Technology Engineering',
    location: 'Cúcuta, Colombia',
    year: '2025',
  },
  certifications: [
    'Meta Back-End Developer Professional Certificate',
    'Spring Framework · LearnQuest / Coursera',
    'Database Design · Oracle Academy',
  ],
  languages: ['Spanish · Native', 'English · B2 upper-intermediate'],
} as const;
