import type { TemplateId } from "@/types/resume";

export type Template = {
  id: TemplateId;
  name: string;
  tagline: string;
  bestFor: string;
  accentColor: string;
};

export const templates: Template[] = [
  {
    id: "classic",
    name: "Classic",
    tagline: "ATS-safe, clean, traditional",
    bestFor: "Corporate, finance, government, formal applications",
    accentColor: "#1f2937",
  },
  {
    id: "modern",
    name: "Modern",
    tagline: "Two-column with a subtle accent",
    bestFor: "Tech, marketing, creative roles",
    accentColor: "#0ea5e9",
  },
  {
    id: "minimal",
    name: "Minimal",
    tagline: "Education and skills forward",
    bestFor: "Students and entry-level applicants",
    accentColor: "#16a34a",
  },
];

export function getTemplate(id: TemplateId): Template {
  return templates.find((t) => t.id === id) ?? templates[0];
}
