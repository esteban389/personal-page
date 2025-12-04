import type { Interest } from "./interests";

export const platformsInterests: Interest[] = [
    {
        id: "p1",
        name: "Write the World",
        type: "platform",
        image: "https://writetheworld.org/static/media/wtw%20new%20logo.07ad9e991c9e101b76df08d0fc31dd44.svg",
        description: "Write the World is a platform that allows you to write and share your thoughts with the world.",
        link: "https://writetheworld.org/",
        tags: ["writing", "sharing", "thoughts", "world"],
        isCurrent: false,
    },
    {
        id: "p2",
        name: "Instituto Tramontana",
        type: "platform",
        description: "El Instituto Tramontana existe para elevar el nivel de quienes crean empresas, productos y servicios digitales.",
        link: "https://tramontana.net/",
        tags: ["reasoning", "logic"],
        image: "https://tramontana.net/wp-content/uploads/2025/06/logo_instituto.svg"
    },
    {
        id: "p3",
        name: "Kialo",
        type: "platform",
        description: "Kialo is an online structured debate platform with argument maps in the form of debate trees. It is a collaborative reasoning tool for thoughtful discussion, understanding different points of view, and collaborative decision-making, showing arguments for and against claims underneath user-submitted theses or questions.\nThe deliberative discourse platform is designed to present hundreds of supporting or opposing arguments in a dynamic argument tree and is streamlined for rational civil debate on topics such as philosophical questions, policy deliberations, entertainment, ethics, science questions, and unsolved problems or subjects of disagreement in general.",
        link: "https://kialo.com/",
        tags: ["reasoning", "logic", "debate", "discussion"],
    },
    {
        id: "p4",
        name: "Escuela de Debate",
        type: "platform",
        description: "Una plataforma de encuentro y formación, para el fortalecimiento de competencias comunicativas orales, pensamiento crítico, y liderazgo en convivencia democrática, a través del debate educativo.",
        link: "https://escueladebate.com/",
        tags: ["debate", "discussion", "learning", "skills", "communication", "critical-thinking", "leadership", "democracy"],
        image: "https://escueladebate.com/wp-content/uploads/2022/06/WEB-Disen%CC%83os-BLANCO-SIMBOLOS-TRANSPRENTES-Escuela-Debate.png"
    },
    {
        id: "p5",
        name: "The Foundation For Critical Thinking",
        type: "platform",
        description: "The Foundation for Critical Thinking is a non-profit organization that promotes critical thinking and rational thinking.",
        link: "https://www.criticalthinking.org/",
        tags: ["reasoning", "logic", "critical-thinking", "rational-thinking"],
        image: "https://www.criticalthinking.org/images/logo.png",
        isCurrent: true
    }
]