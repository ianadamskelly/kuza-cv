"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginAction, type AuthState } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleButton } from "@/components/auth/google-button";

export function LoginForm() {
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/dashboard";
  const [state, formAction, pending] = useActionState<
    AuthState | undefined,
    FormData
  >(loginAction, undefined);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Log in to continue your CV.
      </p>

      <div className="mt-6 space-y-3">
        <GoogleButton next={redirect} />
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>
      </div>

      <form action={formAction} className="mt-3 space-y-3">
        <input type="hidden" name="redirect" value={redirect} />
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        <Button type="submit" className="w-full h-11" disabled={pending}>
          {pending ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-center text-muted-foreground">
        New to Kuza Resume?{" "}
        <Link href="/signup" className="text-foreground font-medium underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
