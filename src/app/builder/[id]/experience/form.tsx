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
import type { ExperienceItem } from "@/types/resume";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function emptyItem(): ExperienceItem {
  return {
    id: uid(),
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    current: false,
    bullets: [""],
  };
}

export function ExperienceForm({
  resumeId,
  initial,
}: {
  resumeId: string;
  initial: ExperienceItem[];
}) {
  const [items, setItems] = useState<ExperienceItem[]>(
    initial.length > 0 ? initial : [],
  );
  const { save, saving } = useAutosave(resumeId);

  function update(next: ExperienceItem[]) {
    setItems(next);
    save({ experience: next });
  }

  function patch(idx: number, p: Partial<ExperienceItem>) {
    update(items.map((it, i) => (i === idx ? { ...it, ...p } : it)));
  }

  function setBullet(idx: number, bIdx: number, value: string) {
    const bullets = [...items[idx].bullets];
    bullets[bIdx] = value;
    patch(idx, { bullets });
  }

  function addBullet(idx: number) {
    patch(idx, { bullets: [...items[idx].bullets, ""] });
  }

  function removeBullet(idx: number, bIdx: number) {
    patch(idx, { bullets: items[idx].bullets.filter((_, i) => i !== bIdx) });
  }

  function move(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[idx], next[j]] = [next[j], next[idx]];
    update(next);
  }

  return (
    <>
      <StepperNav resumeId={resumeId} current="experience" />
      <main className="flex-1 px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Work experience
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Most recent role first.
              </p>
            </div>
            <Button
              size="sm"
              className="h-9 gap-1.5 shrink-0"
              onClick={() => update([...items, emptyItem()])}
            >
              <Plus className="size-4" />
              Add role
            </Button>
          </header>

          {items.length === 0 && (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No roles yet. Add your most recent role to get started.
              </p>
              <Button
                className="mt-4 h-10 gap-1.5"
                onClick={() => update([emptyItem()])}
              >
                <Plus className="size-4" />
                Add your first role
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
                  Role {idx + 1}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    aria-label="Move up"
                  >
                    <ChevronUp className="size-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => move(idx, 1)}
                    disabled={idx === items.length - 1}
                    aria-label="Move down"
                  >
                    <ChevronDown className="size-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => update(items.filter((_, i) => i !== idx))}
                    aria-label="Delete role"
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor={`role-${idx}`}>Job title</Label>
                  <Input
                    id={`role-${idx}`}
                    value={it.role}
                    onChange={(e) => patch(idx, { role: e.target.value })}
                    placeholder="e.g. Marketing Assistant"
                  />
                  <Tip>{tips.experienceRole}</Tip>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`company-${idx}`}>Company</Label>
                  <Input
                    id={`company-${idx}`}
                    value={it.company}
                    onChange={(e) => patch(idx, { company: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor={`start-${idx}`}>Start (Month Year)</Label>
                  <Input
                    id={`start-${idx}`}
                    value={it.startDate}
                    onChange={(e) =>
                      patch(idx, { startDate: e.target.value })
                    }
                    placeholder="Jan 2022"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`end-${idx}`}>End</Label>
                  <Input
                    id={`end-${idx}`}
                    value={it.current ? "Present" : (it.endDate ?? "")}
                    disabled={it.current}
                    onChange={(e) => patch(idx, { endDate: e.target.value })}
                    placeholder="Dec 2024"
                  />
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <input
                      type="checkbox"
                      checked={!!it.current}
                      onChange={(e) =>
                        patch(idx, {
                          current: e.target.checked,
                          endDate: e.target.checked ? "" : it.endDate,
                        })
                      }
                    />
                    I currently work here
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>What you did</Label>
                {it.bullets.map((b, bIdx) => (
                  <div key={bIdx} className="flex gap-2">
                    <Textarea
                      rows={2}
                      value={b}
                      onChange={(e) => setBullet(idx, bIdx, e.target.value)}
                      placeholder="Increased customer retention by 18% over 6 months."
                    />
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => removeBullet(idx, bIdx)}
                      disabled={it.bullets.length === 1}
                      aria-label="Remove bullet"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5"
                  onClick={() => addBullet(idx)}
                >
                  <Plus className="size-3.5" />
                  Add bullet
                </Button>
                <Tip>{tips.experienceBullets}</Tip>
              </div>
            </article>
          ))}
        </div>
      </main>
      <BottomBar resumeId={resumeId} current="experience" saving={saving} />
    </>
  );
}
