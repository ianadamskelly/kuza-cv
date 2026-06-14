"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tip } from "@/components/builder/tip";
import { StepperNav } from "@/components/builder/stepper-nav";
import { BottomBar } from "@/components/builder/bottom-bar";
import { useAutosave } from "@/components/builder/use-autosave";
import { tips } from "@/lib/tips";
import type { EducationItem } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}
function emptyItem(): EducationItem {
  return { id: uid(), institution: "", qualification: "" };
}

export function EducationForm({
  resumeId,
  initial,
}: {
  resumeId: string;
  initial: EducationItem[];
}) {
  const [items, setItems] = useState<EducationItem[]>(initial);
  const { save, saving } = useAutosave(resumeId);

  function update(next: EducationItem[]) {
    setItems(next);
    save({ education: next });
  }
  function patch(idx: number, p: Partial<EducationItem>) {
    update(items.map((it, i) => (i === idx ? { ...it, ...p } : it)));
  }

  return (
    <>
      <StepperNav resumeId={resumeId} current="education" />
      <main className="flex-1 px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Education
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Highest or most relevant qualification first.
              </p>
            </div>
            <Button
              size="sm"
              className="h-9 gap-1.5 shrink-0"
              onClick={() => update([...items, emptyItem()])}
            >
              <Plus className="size-4" />
              Add
            </Button>
          </header>

          {items.length === 0 && (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No qualifications listed yet.
              </p>
              <Button
                className="mt-4 h-10 gap-1.5"
                onClick={() => update([emptyItem()])}
              >
                <Plus className="size-4" />
                Add education
              </Button>
            </div>
          )}

          {items.map((it, idx) => (
            <article
              key={it.id}
              className="rounded-xl border bg-card p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Qualification {idx + 1}
                </span>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => update(items.filter((_, i) => i !== idx))}
                  aria-label="Delete"
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
              <div className="space-y-1.5">
                <Label>Qualification</Label>
                <Input
                  value={it.qualification}
                  onChange={(e) =>
                    patch(idx, { qualification: e.target.value })
                  }
                  placeholder="Bachelor of Commerce, Finance"
                />
                <Tip>{tips.educationQualification}</Tip>
              </div>
              <div className="space-y-1.5">
                <Label>Institution</Label>
                <Input
                  value={it.institution}
                  onChange={(e) =>
                    patch(idx, { institution: e.target.value })
                  }
                  placeholder="University of Nairobi"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Start</Label>
                  <Input
                    value={it.startDate ?? ""}
                    onChange={(e) =>
                      patch(idx, { startDate: e.target.value })
                    }
                    placeholder="2018"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>End</Label>
                  <Input
                    value={it.endDate ?? ""}
                    onChange={(e) =>
                      patch(idx, { endDate: e.target.value })
                    }
                    placeholder="2022"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Details (optional)</Label>
                <Textarea
                  rows={2}
                  value={it.details ?? ""}
                  onChange={(e) => patch(idx, { details: e.target.value })}
                  placeholder="Second class honours, upper division. Relevant coursework: Financial Modelling, Corporate Finance."
                />
              </div>
            </article>
          ))}
        </div>
      </main>
      <BottomBar resumeId={resumeId} current="education" saving={saving} />
    </>
  );
}
