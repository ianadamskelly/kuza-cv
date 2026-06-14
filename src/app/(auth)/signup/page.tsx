"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction, type AuthState } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleButton } from "@/components/auth/google-button";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<
    AuthState | undefined,
    FormData
  >(signupAction, undefined);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Start building your CV in under 10 minutes.
      </p>

      <div className="mt-6 space-y-3">
        <GoogleButton />
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>
      </div>

      <form action={formAction} className="mt-3 space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            placeholder="Jane Doe"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="At least 6 characters"
          />
        </div>
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        <Button type="submit" className="w-full h-11" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground font-medium underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
