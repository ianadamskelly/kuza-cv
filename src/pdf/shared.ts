import type { ResumeData } from "@/types/resume";

export function formatDateRange(start?: string, end?: string, current?: boolean) {
  const s = start?.trim();
  const e = current ? "Present" : end?.trim();
  if (s && e) return `${s} — ${e}`;
  return s || e || "";
}

export function contactLine(p: ResumeData["personal"]): string[] {
  return [p.email, p.phone, p.location, p.linkedin, p.website].filter(
    (x): x is string => !!x && x.trim().length > 0,
  );
}

export function hasContent(r: ResumeData) {
  return {
    summary: r.summary.trim().length > 0,
    experience: r.experience.length > 0,
    education: r.education.length > 0,
    skills: r.skills.length > 0,
    languages: (r.extras.languages ?? []).length > 0,
    certifications: (r.extras.certifications ?? []).length > 0,
    projects: (r.extras.projects ?? []).length > 0,
    references: (r.extras.references ?? []).length > 0,
  };
}
