"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import type { ResumeData } from "@/types/resume";
import { saveResumeSection } from "@/app/builder/[id]/actions";
import { toast } from "sonner";

export function useAutosave(resumeId: string) {
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();
  const queue = useRef<Partial<ResumeData>>({});
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    const patch = queue.current;
    queue.current = {};
    if (Object.keys(patch).length === 0) return;
    setSaving(true);
    startTransition(async () => {
      const res = await saveResumeSection(resumeId, patch);
      setSaving(false);
      if (!res.ok) toast.error(`Save failed: ${res.error}`);
    });
  }, [resumeId]);

  const save = useCallback(
    (patch: Partial<ResumeData>) => {
      queue.current = { ...queue.current, ...patch };
      if (flushTimer.current) clearTimeout(flushTimer.current);
      flushTimer.current = setTimeout(flush, 400);
    },
    [flush],
  );

  return { save, saving, flush };
}
