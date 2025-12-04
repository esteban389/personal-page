import type { Interest } from "./interests";

export const githubProjectsInterests: Interest[] = [
    {
        id: "g1",
        name: "d2ts",
        description: "D2TS is a TypeScript implementation of differential dataflow - a powerful data-parallel programming framework that enables incremental computations over changing input data. \nYou can use D2TS to build data pipelines that can be executed incrementally, meaning you can process data as it comes in, and only recompute the parts that have changed.This could be as simple as remapping data, or as complex as performing a full join combining two datasources where one is a computed aggregate.\nD2TS can be used in conjunction with ElectricSQL to build data pipelines on top of ShapeStreams that can be executed incrementally.\nA D2TS pipeline is also fully type safe, inferring the types at each step of the pipeline, and supports auto- complete in your IDE.",
        type: "project",
        image: "https://raw.githubusercontent.com/electric-sql/meta/main/identity/ElectricSQL-logo-next.svg",
        tags: ["typescript", "dataflow", "data-parallel", "incremental-computation", "electric-sql", "data"],
        link: "https://github.com/electric-sql/d2ts",
        isCurrent: false,
    },
    {
        id: "g2",
        name: "",
        description: "Create PowerPoint presentations with React",
        type: "project",
        link: "https://github.com/wyozi/react-pptx?tab=readme-ov-file",
        tags: ["react", "pptx", "presentation", "typescript", "javascript", "frontend"],
        isCurrent: false,
    },
    {
        id: "g3",
        name: "react-doc-viewer",
        description: "A React component for displaying documents. It supports various document formats and provides a flexible API for customization.",
        type: "project",
        link: "https://github.com/cyntler/react-doc-viewer",
        tags: ["react", "document", "viewer", "typescript", "javascript", "frontend"],
        isCurrent: false,
    }
]