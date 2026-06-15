import { writeFileSync } from "node:fs";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
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
        "Led the team to a Q4 2024 CSAT score of 96%, the highest in the region.",
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
    "Swahili–English bilingual",
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

const templates: [string, React.ComponentType<{ data: ResumeData; preview?: boolean }>][] = [
  ["classic", ClassicTemplate],
  ["modern", ModernTemplate],
  ["minimal", MinimalTemplate],
];

async function main() {
  for (const [name, Component] of templates) {
    const buf = await renderToBuffer(
      React.createElement(Component, { data: sample, preview: true }),
    );
    writeFileSync(`/tmp/kuza-${name}.pdf`, buf);
    console.log(`✅ /tmp/kuza-${name}.pdf  (${buf.length} bytes)`);
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
