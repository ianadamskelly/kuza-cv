import type { TemplateId } from "@/types/resume";

export type Template = {
  id: TemplateId;
  name: string;
  tagline: string;
  bestFor: string;
  accentColor: string;
  previewSrc: string;
};

export const templates: Template[] = [
  {
    id: "classic",
    name: "Classic",
    tagline: "ATS-safe, clean, traditional",
    bestFor: "Corporate, finance, government, formal applications",
    accentColor: "#1f2937",
    previewSrc: "/templates/classic.png",
  },
  {
    id: "modern",
    name: "Modern",
    tagline: "Two-column with a subtle accent",
    bestFor: "Tech, marketing, creative roles",
    accentColor: "#0ea5e9",
    previewSrc: "/templates/modern.png",
  },
  {
    id: "minimal",
    name: "Minimal",
    tagline: "Education and skills forward",
    bestFor: "Students and entry-level applicants",
    accentColor: "#1e293b",
    previewSrc: "/templates/minimal.png",
  },
];

export function getTemplate(id: TemplateId): Template {
  return templates.find((t) => t.id === id) ?? templates[0];
}
