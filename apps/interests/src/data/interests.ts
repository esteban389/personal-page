type InterestType = 'book'
 | 'movie' 
 | 'series'
 | 'game' 
 | 'podcast'
 | 'project'
 | 'course'
 | 'certification'
 | 'video'
 | 'idea';

 type AdditionalUrl = {
    url: string;
    description: string;
 }

type Interest = {
    id: string;
    name: string;
    description: string;
    type: InterestType;
    image?: string;
    link?: string;
    tags?: string[];
    additionalUrls?: AdditionalUrl[];
    isCurrent?: boolean;
}

export const interests: Interest[] = [
    {
        id: '1',
        name: 'The Great Gatsby',
        description: 'A classic novel by F. Scott Fitzgerald',
        type: 'book',
        image: 'https://example.com/the-great-gatsby.jpg',
        link: 'https://example.com/the-great-gatsby',
        tags: ['book', 'classic'],
        additionalUrls: [],
        isCurrent: false,
    },
    {
        id: "3",
        name: "Personal Portfolio Redesign",
        type: "project",
        tags: ["web-development", "design", "accessibility", "performance"],
        image: "",
        link: "https://github.com/yourusername/portfolio",
        description: "A complete overhaul of my portfolio site using modern web technologies. Focus areas include WCAG 2.1 AA compliance, Core Web Vitals optimization, and implementing a design system from scratch.",
        additionalUrls: [
          { url: "https://portfolio-live.com", description: "Live demo site" },
          { url: "https://figma.com/portfolio-design", description: "Design mockups in Figma" },
        ],
        isCurrent: true,
      },
]