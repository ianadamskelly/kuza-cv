"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Pencil, Trash2, Palette, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  renameResume,
  deleteResume,
  switchTemplate,
} from "@/app/builder/[id]/actions";
import { templates } from "@/lib/templates";
import type { TemplateId } from "@/types/resume";

type Mode = "none" | "rename" | "delete" | "switch";

export function ResumeCardMenu({
  resumeId,
  currentTitle,
  currentTemplate,
}: {
  resumeId: string;
  currentTitle: string;
  currentTemplate: TemplateId;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("none");
  const [title, setTitle] = useState(currentTitle);
  const [pending, startTransition] = useTransition();

  function close() {
    setMode("none");
    setTitle(currentTitle);
  }

  function handleRename() {
    const next = title.trim();
    if (!next) return;
    startTransition(async () => {
      await renameResume(resumeId, next);
      close();
      router.refresh();
      toast.success("Renamed");
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteResume(resumeId);
      // deleteResume redirects, so refresh isn't strictly needed.
    });
  }

  function handleSwitch(id: TemplateId) {
    startTransition(async () => {
      await switchTemplate(resumeId, id);
      close();
      router.refresh();
      toast.success("Template switched");
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="More options"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="inline-flex size-7 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onSelect={() => setMode("rename")}>
            <Pencil className="size-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setMode("switch")}>
            <Palette className="size-4" />
            Switch template
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setMode("delete")}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={mode === "rename"} onOpenChange={(o) => !o && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename resume</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rename-title">Title</Label>
            <Input
              id="rename-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close} disabled={pending}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={mode === "delete"} onOpenChange={(o) => !o && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this resume?</DialogTitle>
            <DialogDescription>
              This permanently deletes the resume and any unused paid versions.
              You can&apos;t undo it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={close} disabled={pending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={pending}
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={mode === "switch"} onOpenChange={(o) => !o && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch template</DialogTitle>
            <DialogDescription>
              Your details carry across. The look changes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSwitch(t.id)}
                disabled={pending || t.id === currentTemplate}
                className={`rounded-lg border p-2 text-left transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed ${
                  t.id === currentTemplate ? "border-primary" : ""
                }`}
              >
                <div
                  className="aspect-[210/297] rounded-md border bg-muted mb-2"
                  style={{ borderColor: t.accentColor + "33" }}
                />
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.tagline}</p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
