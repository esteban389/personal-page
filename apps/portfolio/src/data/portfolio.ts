export const portfolio = {
  name: 'Esteban Murcia',
  initials: 'EM',
  role: 'Java Backend Engineer',
  description:
    'Backend engineer building reliable, data-heavy business systems with Java, Spring Boot, and MySQL.',
  location: 'Cúcuta, Colombia',
  siteUrl: 'https://estebanmurcia.dev',
  blogUrl: 'https://blog.estebanmurcia.dev',
  githubUrl: 'https://github.com/esteban389',
  linkedinUrl: 'https://www.linkedin.com/in/esteban-andres-murcia',
  email: 'estebana.murciaa@gmail.com',
  about:
    'I have nearly three years of experience building and operating production software used by nine institutions in Colombia. I work across backend services, data integrity, identity, reporting, production diagnosis, and delivery—and I step into the frontend when the product needs it.',
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
} as const;
