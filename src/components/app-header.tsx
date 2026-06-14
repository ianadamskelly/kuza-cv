import Link from "next/link";
import { signoutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

export function AppHeader({ email }: { email?: string }) {
  return (
    <header className="border-b sticky top-0 bg-background/80 backdrop-blur z-10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="font-semibold tracking-tight">
          Kuza Resume
        </Link>
        <div className="flex items-center gap-2">
          {email && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {email}
            </span>
          )}
          <form action={signoutAction}>
            <Button variant="ghost" size="sm" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
