"use client";

import Link from "next/link";
import { steps, stepIndex, type StepSlug } from "@/lib/steps";
import { cn } from "@/lib/utils";

export function StepperNav({
  resumeId,
  current,
}: {
  resumeId: string;
  current: StepSlug;
}) {
  const idx = stepIndex(current);
  return (
    <div className="border-b bg-background sticky top-14 z-10">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>
            Step {idx + 1} of {steps.length}
          </span>
          <span className="font-medium text-foreground">
            {steps[idx].label}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((idx + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="mt-3 flex gap-1 overflow-x-auto -mx-1 px-1 pb-1">
          {steps.map((s, i) => (
            <Link
              key={s.slug}
              href={`/builder/${resumeId}/${s.slug}`}
              className={cn(
                "text-xs px-2.5 py-1 rounded-md whitespace-nowrap transition-colors",
                i === idx
                  ? "bg-primary text-primary-foreground"
                  : i < idx
                    ? "text-foreground hover:bg-muted"
                    : "text-muted-foreground hover:bg-muted",
              )}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
