import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
        Kuza Resume
      </p>
      <h1 className="mt-3 text-6xl sm:text-7xl font-semibold tracking-tight">
        404
      </h1>
      <p className="mt-3 text-base text-muted-foreground max-w-sm">
        We couldn&apos;t find that page. The link may be old or the page might
        have moved.
      </p>
      <div className="mt-7 flex gap-2">
        <Link href="/" className={cn(buttonVariants(), "h-11 px-5")}>
          Go home
        </Link>
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 px-5",
          )}
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
