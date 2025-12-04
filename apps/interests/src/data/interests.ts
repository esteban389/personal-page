import { booksInterests } from "./booksInterests";
import { githubProjectsInterests } from "./githubProjectsInterests";

type InterestType = 'book'
 //| 'movie' 
 //| 'series'
 //| 'game' 
 | 'podcast'
 | 'project'
 //| 'course'
 //| 'certification'
 //| 'video'
 //| 'idea'
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

const defaultImages: Record<InterestType, string> = {
  book: "https://www.shutterstock.com/image-photo/book-open-pages-close-up-600nw-2562942291.jpg",
  podcast: "https://t3.ftcdn.net/jpg/05/10/75/30/360_F_510753092_f4AOmCJAczuGgRLCmHxmowga2tC9VYQP.jpg",
  project: "https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_1280.png",
  "blog-post": "https://plus.unsplash.com/premium_photo-1720744786849-a7412d24ffbf?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D",
}

const allInterests: Interest[] = [
  ...booksInterests,
  ...githubProjectsInterests,
]

// Apply default images to interests that don't have one
export const interests: Interest[] = allInterests.map(interest => ({
  ...interest,
  image: interest.image || defaultImages[interest.type]
}))