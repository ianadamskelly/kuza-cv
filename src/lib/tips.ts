export const tips = {
  fullName: "Use the same name as on your national ID or passport.",
  title:
    "Your professional headline. Example: 'Software Engineer' or 'Customer Service Specialist'.",
  email: "Use a professional address — firstname.lastname@gmail.com works well.",
  phone: "Include the country code, e.g. +254 7XX XXX XXX.",
  location: "City and country is enough. No need for your full address.",
  summary:
    "2–3 sentences: what you do, years of experience, and one strength. Avoid 'I am...' — start with the role.",
  experienceRole: "Use the official job title from your contract or offer letter.",
  experienceBullets:
    "Start each bullet with an action verb (Led, Built, Increased). Add a number where you can. Aim for 3–5 bullets per role.",
  experienceDates: "Use Month Year format. Mark your current role as 'Present'.",
  educationQualification:
    "Write the full qualification: 'Bachelor of Commerce, Finance', not just 'BCom'.",
  skills:
    "List 6–10 relevant skills. Match them to the jobs you're applying for — don't list everything.",
  languages: "Add proficiency level: 'English (Fluent), Swahili (Native)'.",
  certifications: "Only include certifications that are still valid and relevant.",
  references:
    "'Available on request' is fine. Only list named referees if a job posting asks for them.",
} as const;

export type TipKey = keyof typeof tips;
