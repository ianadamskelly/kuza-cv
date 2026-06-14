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
import type {
  CertificationItem,
  ProjectItem,
  ReferenceItem,
  ResumeData,
} from "@/types/resume";
import { Plus, Trash2, X } from "lucide-react";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

type Extras = ResumeData["extras"];

export function ExtrasForm({
  resumeId,
  initial,
}: {
  resumeId: string;
  initial: Extras;
}) {
  const [extras, setExtras] = useState<Extras>(initial ?? {});
  const { save, saving } = useAutosave(resumeId);

  function update(next: Extras) {
    setExtras(next);
    save({ extras: next });
  }

  return (
    <>
      <StepperNav resumeId={resumeId} current="extras" />
      <main className="flex-1 px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <header>
            <h1 className="text-xl font-semibold tracking-tight">Extras</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Optional sections. Skip what doesn&apos;t apply.
            </p>
          </header>

          <Languages
            value={extras.languages ?? []}
            onChange={(languages) => update({ ...extras, languages })}
          />
          <Certifications
            value={extras.certifications ?? []}
            onChange={(certifications) =>
              update({ ...extras, certifications })
            }
          />
          <Projects
            value={extras.projects ?? []}
            onChange={(projects) => update({ ...extras, projects })}
          />
          <References
            value={extras.references ?? []}
            onChange={(references) => update({ ...extras, references })}
          />
        </div>
      </main>
      <BottomBar resumeId={resumeId} current="extras" saving={saving} />
    </>
  );
}

function Languages({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const v = draft.trim();
      if (v && !value.includes(v)) onChange([...value, v]);
      setDraft("");
    }
  }
  return (
    <Section title="Languages">
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          placeholder="English (Fluent)"
        />
        <Button
          type="button"
          className="h-9 px-4"
          onClick={() => {
            const v = draft.trim();
            if (v && !value.includes(v)) onChange([...value, v]);
            setDraft("");
          }}
        >
          Add
        </Button>
      </div>
      <Tip>{tips.languages}</Tip>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((s) => (
            <Badge
              key={s}
              variant="secondary"
              className="gap-1 pl-3 pr-1.5 py-1.5 text-sm"
            >
              {s}
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x !== s))}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
                aria-label={`Remove ${s}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </Section>
  );
}

function Certifications({
  value,
  onChange,
}: {
  value: CertificationItem[];
  onChange: (v: CertificationItem[]) => void;
}) {
  return (
    <Section
      title="Certifications"
      action={
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1.5"
          onClick={() =>
            onChange([...value, { id: uid(), name: "", issuer: "", year: "" }])
          }
        >
          <Plus className="size-3.5" /> Add
        </Button>
      }
    >
      <Tip>{tips.certifications}</Tip>
      {value.map((c, i) => (
        <div
          key={c.id}
          className="rounded-lg border p-3 grid grid-cols-1 sm:grid-cols-[1fr_1fr_120px_auto] gap-2 items-end mt-2"
        >
          <div className="space-y-1">
            <Label className="text-xs">Name</Label>
            <Input
              value={c.name}
              onChange={(e) =>
                onChange(
                  value.map((x, j) =>
                    j === i ? { ...x, name: e.target.value } : x,
                  ),
                )
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Issuer</Label>
            <Input
              value={c.issuer ?? ""}
              onChange={(e) =>
                onChange(
                  value.map((x, j) =>
                    j === i ? { ...x, issuer: e.target.value } : x,
                  ),
                )
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Year</Label>
            <Input
              value={c.year ?? ""}
              onChange={(e) =>
                onChange(
                  value.map((x, j) =>
                    j === i ? { ...x, year: e.target.value } : x,
                  ),
                )
              }
            />
          </div>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            aria-label="Remove certification"
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ))}
    </Section>
  );
}

function Projects({
  value,
  onChange,
}: {
  value: ProjectItem[];
  onChange: (v: ProjectItem[]) => void;
}) {
  return (
    <Section
      title="Projects"
      action={
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1.5"
          onClick={() =>
            onChange([
              ...value,
              { id: uid(), name: "", description: "", link: "" },
            ])
          }
        >
          <Plus className="size-3.5" /> Add
        </Button>
      }
    >
      {value.map((p, i) => (
        <div key={p.id} className="rounded-lg border p-3 space-y-2 mt-2">
          <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
            <div className="space-y-1">
              <Label className="text-xs">Name</Label>
              <Input
                value={p.name}
                onChange={(e) =>
                  onChange(
                    value.map((x, j) =>
                      j === i ? { ...x, name: e.target.value } : x,
                    ),
                  )
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Link (optional)</Label>
              <Input
                value={p.link ?? ""}
                onChange={(e) =>
                  onChange(
                    value.map((x, j) =>
                      j === i ? { ...x, link: e.target.value } : x,
                    ),
                  )
                }
              />
            </div>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              aria-label="Remove project"
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Description</Label>
            <Input
              value={p.description}
              onChange={(e) =>
                onChange(
                  value.map((x, j) =>
                    j === i ? { ...x, description: e.target.value } : x,
                  ),
                )
              }
              placeholder="One sentence on what it does and your role."
            />
          </div>
        </div>
      ))}
    </Section>
  );
}

function References({
  value,
  onChange,
}: {
  value: ReferenceItem[];
  onChange: (v: ReferenceItem[]) => void;
}) {
  return (
    <Section
      title="References"
      action={
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1.5"
          onClick={() =>
            onChange([
              ...value,
              { id: uid(), name: "", role: "", contact: "" },
            ])
          }
        >
          <Plus className="size-3.5" /> Add
        </Button>
      }
    >
      <Tip>{tips.references}</Tip>
      {value.map((r, i) => (
        <div
          key={r.id}
          className="rounded-lg border p-3 grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end mt-2"
        >
          <div className="space-y-1">
            <Label className="text-xs">Name</Label>
            <Input
              value={r.name}
              onChange={(e) =>
                onChange(
                  value.map((x, j) =>
                    j === i ? { ...x, name: e.target.value } : x,
                  ),
                )
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Role</Label>
            <Input
              value={r.role ?? ""}
              onChange={(e) =>
                onChange(
                  value.map((x, j) =>
                    j === i ? { ...x, role: e.target.value } : x,
                  ),
                )
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Contact</Label>
            <Input
              value={r.contact ?? ""}
              onChange={(e) =>
                onChange(
                  value.map((x, j) =>
                    j === i ? { ...x, contact: e.target.value } : x,
                  ),
                )
              }
              placeholder="Email or phone"
            />
          </div>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            aria-label="Remove reference"
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ))}
    </Section>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
