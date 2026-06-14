export const steps = [
  { slug: "personal", label: "Personal" },
  { slug: "summary", label: "Summary" },
  { slug: "experience", label: "Experience" },
  { slug: "education", label: "Education" },
  { slug: "skills", label: "Skills" },
  { slug: "extras", label: "Extras" },
  { slug: "preview", label: "Preview" },
] as const;

export type StepSlug = (typeof steps)[number]["slug"];

export function stepIndex(slug: StepSlug): number {
  return steps.findIndex((s) => s.slug === slug);
}

export function nextStep(slug: StepSlug): StepSlug | null {
  const i = stepIndex(slug);
  return i < steps.length - 1 ? steps[i + 1].slug : null;
}

export function prevStep(slug: StepSlug): StepSlug | null {
  const i = stepIndex(slug);
  return i > 0 ? steps[i - 1].slug : null;
}
