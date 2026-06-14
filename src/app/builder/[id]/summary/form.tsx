"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tip } from "@/components/builder/tip";
import { StepperNav } from "@/components/builder/stepper-nav";
import { BottomBar } from "@/components/builder/bottom-bar";
import { useAutosave } from "@/components/builder/use-autosave";
import { tips } from "@/lib/tips";

const MAX = 500;

export function SummaryForm({
  resumeId,
  initial,
}: {
  resumeId: string;
  initial: string;
}) {
  const [value, setValue] = useState(initial);
  const { save, saving } = useAutosave(resumeId);

  return (
    <>
      <StepperNav resumeId={resumeId} current="summary" />
      <main className="flex-1 px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          <header>
            <h1 className="text-xl font-semibold tracking-tight">
              Professional summary
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your hook at the top of the CV.
            </p>
          </header>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="summary">Summary</Label>
              <span
                className={`text-xs ${
                  value.length > MAX ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {value.length} / {MAX}
              </span>
            </div>
            <Textarea
              id="summary"
              rows={6}
              maxLength={MAX}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                save({ summary: e.target.value });
              }}
              placeholder="Customer service specialist with 4+ years in retail and telecoms. Strong at de-escalating complaints, training new agents, and hitting CSAT targets above 92%."
            />
            <Tip>{tips.summary}</Tip>
          </div>
        </div>
      </main>
      <BottomBar resumeId={resumeId} current="summary" saving={saving} />
    </>
  );
}
