import { booksInterests } from "./booksInterests";
import { githubProjectsInterests } from "./githubProjectsInterests";

type InterestType = 'book'
 | 'movie' 
 | 'series'
 | 'game' 
 | 'podcast'
 | 'project'
 | 'course'
 | 'certification'
 | 'video'
 | 'idea'
 | "blog-post";

 type AdditionalUrl = {
    url: string;
    description: string;
 }

export type Interest = {
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
  ...booksInterests,
  ...githubProjectsInterests,
]