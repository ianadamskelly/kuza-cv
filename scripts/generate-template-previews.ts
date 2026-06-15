// Renders each template with sample data and writes a PNG preview to
// /public/templates/<id>.png. Run once whenever you change a template:
//   npx tsx scripts/generate-template-previews.ts
import { writeFileSync } from "node:fs";
import path from "node:path";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { pdfToPng } from "pdf-to-png-converter";
import { ClassicTemplate } from "../src/pdf/templates/classic";
import { ModernTemplate } from "../src/pdf/templates/modern";
import { MinimalTemplate } from "../src/pdf/templates/minimal";
import type { ResumeData } from "../src/types/resume";

const sample: ResumeData = {
  personal: {
    fullName: "Jane Wanjiku",
    title: "Customer Service Specialist",
    email: "jane.wanjiku@example.com",
    phone: "+254 712 345 678",
    location: "Nairobi, Kenya",
    linkedin: "linkedin.com/in/janewanjiku",
  },
  summary:
    "Customer service specialist with 4+ years in retail and telecoms. Strong at de-escalating complaints, training new agents, and consistently hitting CSAT targets above 92%.",
  experience: [
    {
      id: "a",
      role: "Senior Customer Service Agent",
      company: "Safaricom",
      startDate: "Mar 2022",
      current: true,
      bullets: [
        "Resolved 60+ calls per day with a 94% first-call resolution rate.",
        "Trained 12 new agents on objection handling and escalation flow.",
        "Led the team to a Q4 2024 CSAT score of 96%.",
      ],
    },
    {
      id: "b",
      role: "Customer Care Representative",
      company: "Naivas Supermarket",
      startDate: "Jan 2020",
      endDate: "Feb 2022",
      bullets: [
        "Managed loyalty programme enquiries for 8 stores.",
        "Cut average response time on returns from 3 days to 1.",
      ],
    },
  ],
  education: [
    {
      id: "e1",
      qualification: "Bachelor of Commerce, Marketing",
      institution: "University of Nairobi",
      startDate: "2016",
      endDate: "2020",
      details: "Second class honours, upper division.",
    },
  ],
  skills: [
    "Customer service",
    "Conflict resolution",
    "Salesforce",
    "Bilingual",
    "Training",
    "CSAT reporting",
  ],
  extras: {
    languages: ["English (Fluent)", "Swahili (Native)"],
    certifications: [
      { id: "c1", name: "ITIL Foundation", issuer: "AXELOS", year: "2023" },
    ],
  },
};

const outDir = path.join(process.cwd(), "public", "templates");

async function generate(
  id: string,
  Component: React.ComponentType<{ data: ResumeData; preview?: boolean }>,
) {
  const pdfBuf = await renderToBuffer(
    React.createElement(Component, { data: sample }),
  );
  const pages = await pdfToPng(pdfBuf, {
    viewportScale: 2,
    pagesToProcess: [1],
  });
  const outPath = path.join(outDir, `${id}.png`);
  if (!pages[0]?.content) throw new Error(`No PNG output for ${id}`);
  writeFileSync(outPath, pages[0].content);
  console.log(`✅ ${outPath}`);
}

async function main() {
  await generate("classic", ClassicTemplate);
  await generate("modern", ModernTemplate);
  await generate("minimal", MinimalTemplate);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
