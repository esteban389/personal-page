export const portfolio = {
  name: 'Esteban Murcia',
  initials: 'EM',
  role: 'Software Engineer',
  description:
    'Backend-focused software engineer building reliable systems and thoughtful developer experiences.',
  location: 'Colombia',
  siteUrl: 'https://estebanmurcia.dev',
  blogUrl: 'https://blog.estebanmurcia.dev',
  githubUrl: 'https://github.com/esteban389',
  about:
    'I work across backend engineering, architecture, and distributed systems. I care about clear domain models, operational reliability, and software that remains understandable as it grows.',
  focus: [
    'Java & Spring',
    'Distributed systems',
    'Software architecture',
    'PostgreSQL',
    'Cloud infrastructure',
    'Developer tooling',
  ],
  projects: [
    {
      name: 'Technical writing',
      description:
        'Notes and long-form articles on backend engineering, architecture, debugging, and deliberate learning.',
      href: 'https://blog.estebanmurcia.dev',
      label: 'Read the blog',
    },
    {
      name: 'Open-source work',
      description:
        'Experiments, learning projects, and software engineering work published on GitHub.',
      href: 'https://github.com/esteban389',
      label: 'View GitHub',
    },
  ],
} as const;
