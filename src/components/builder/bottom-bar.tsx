"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { nextStep, prevStep, type StepSlug } from "@/lib/steps";

export function BottomBar({
  resumeId,
  current,
  saving,
}: {
  resumeId: string;
  current: StepSlug;
  saving?: boolean;
}) {
  const prev = prevStep(current);
  const next = nextStep(current);

  return (
    <div className="sticky bottom-0 border-t bg-background z-10">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {prev ? (
          <Link
            href={`/builder/${resumeId}/${prev}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 px-4 gap-1",
            )}
          >
            <ChevronLeft className="size-4" />
            Back
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 px-4 gap-1",
            )}
          >
            <ChevronLeft className="size-4" />
            Dashboard
          </Link>
        )}
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          {saving ? (
            <>
              <Loader2 className="size-3 animate-spin" />
              Saving…
            </>
          ) : (
            "Saved"
          )}
        </span>
        {next ? (
          <Link
            href={`/builder/${resumeId}/${next}`}
            className={cn(buttonVariants(), "h-11 px-4 gap-1")}
          >
            Next
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <Button disabled variant="outline" className="h-11 px-4">
            Done
          </Button>
        )}
      </div>
    </div>
  );
}
