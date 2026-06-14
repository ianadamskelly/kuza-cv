"use client";

import { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tip } from "@/components/builder/tip";
import { StepperNav } from "@/components/builder/stepper-nav";
import { BottomBar } from "@/components/builder/bottom-bar";
import { useAutosave } from "@/components/builder/use-autosave";
import { tips } from "@/lib/tips";
import { X } from "lucide-react";

export function SkillsForm({
  resumeId,
  initial,
}: {
  resumeId: string;
  initial: string[];
}) {
  const [skills, setSkills] = useState<string[]>(initial);
  const [draft, setDraft] = useState("");
  const { save, saving } = useAutosave(resumeId);

  function commit(next: string[]) {
    setSkills(next);
    save({ skills: next });
  }

  function addSkill() {
    const v = draft.trim();
    if (!v) return;
    if (skills.includes(v)) {
      setDraft("");
      return;
    }
    commit([...skills, v]);
    setDraft("");
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    } else if (e.key === "Backspace" && draft === "" && skills.length > 0) {
      commit(skills.slice(0, -1));
    }
  }

  return (
    <>
      <StepperNav resumeId={resumeId} current="skills" />
      <main className="flex-1 px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          <header>
            <h1 className="text-xl font-semibold tracking-tight">Skills</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Press Enter or comma to add each skill.
            </p>
          </header>

          <div className="space-y-2">
            <Label htmlFor="skill-input">Add a skill</Label>
            <div className="flex gap-2">
              <Input
                id="skill-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKey}
                placeholder="e.g. Customer service"
              />
              <Button onClick={addSkill} type="button" className="h-9 px-4">
                Add
              </Button>
            </div>
            <Tip>{tips.skills}</Tip>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <Badge
                  key={s}
                  variant="secondary"
                  className="gap-1 pl-3 pr-1.5 py-1.5 text-sm"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() =>
                      commit(skills.filter((x) => x !== s))
                    }
                    aria-label={`Remove ${s}`}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomBar resumeId={resumeId} current="skills" saving={saving} />
    </>
  );
}
