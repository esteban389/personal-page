import type { Interest } from "./interests";

const baseVideoInterests: Omit<Interest, "type">[] = [
    {
        id: "v1",
        name: "Use Gemini to get best UI designs",
        description: "37 minutes video showing how to use Gemini to get best UI designs",
        link: "https://x.com/MengTo/status/1991489885690364187",
        tags: ["video", "x", "gemini", "ui", "design", "ai"],
        isCurrent: true,
    },
    {
        id: "v2",
        name: " How To Force Your Brain To Crave Doing Hard Things ",
        description: "This guide walks you through the ONE powerful protocol to force your brain to crave hard things — and unlock limitless motivation.",
        link: "https://www.youtube.com/watch?v=K8ZgwZf1E3E",
        image: "https://i.ytimg.com/vi/K8ZgwZf1E3E/maxresdefault.jpg",
        tags: ["video", "youtube", "motivation", "hard things", "brain", "self-improvement"],
        isCurrent: true,
    },
    {
        id: "v3",
        name: "System 2 Thinking Will Change Your Life",
        description: "This video explains how to use system 2 thinking to change your life.",
        link: "https://www.youtube.com/watch?v=-ugdgGKE6IE",
        image: "https://i.ytimg.com/vi/-ugdgGKE6IE/maxresdefault.jpg",
        tags: ["video", "youtube", "system 2 thinking", "life", "change", "self-improvement"],
        isCurrent: true,
    },
    {
        id: "v4",
        name: "MIT PhD taught me to unlock my brain’s “Sage Mode” - Deep Work (Full Summary)",
        description: "This video explains how to use deep work to change your life.",
        link: "https://www.youtube.com/watch?v=tKkd6Zsz9gA",
        image: "https://i.ytimg.com/vi/tKkd6Zsz9gA/maxresdefault.jpg",
        tags: ["video", "youtube", "deep work", "life", "change", "self-improvement"],
        isCurrent: true,
    },
    {
        id: "v5",
        link: "https://www.youtube.com/watch?v=6NwR7AEaPko",
        name: "Go beyond duoling with these German drills",
        description: "Master German Grammar with Daily Drills for REAL Fluency! ",
        tags: ["video", "youtube", "german", "grammar", "fluency", "self-improvement", "language", "learning"],
    }
]

export const videoInterests: Interest[] = baseVideoInterests.map(interest => ({
    ...interest,
    type: "video",
}))