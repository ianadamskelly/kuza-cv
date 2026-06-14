import { Lightbulb } from "lucide-react";

export function Tip({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-xs text-muted-foreground flex gap-1.5">
      <Lightbulb className="size-3.5 shrink-0 mt-0.5 text-amber-500" />
      <span>{children}</span>
    </p>
  );
}
