export type ResumeData = {
  personal: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
  };
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  extras: {
    languages?: string[];
    certifications?: CertificationItem[];
    projects?: ProjectItem[];
    references?: ReferenceItem[];
  };
};

export type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  bullets: string[];
};

export type EducationItem = {
  id: string;
  institution: string;
  qualification: string;
  startDate?: string;
  endDate?: string;
  details?: string;
};

export type CertificationItem = {
  id: string;
  name: string;
  issuer?: string;
  year?: string;
};

export type ProjectItem = {
  id: string;
  name: string;
  description: string;
  link?: string;
};

export type ReferenceItem = {
  id: string;
  name: string;
  role?: string;
  contact?: string;
};

export type TemplateId = "classic" | "modern" | "minimal";

export const emptyResume: ResumeData = {
  personal: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  extras: {},
};
