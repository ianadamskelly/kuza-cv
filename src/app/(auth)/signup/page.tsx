"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  signupAction,
  resendConfirmationAction,
  type AuthState,
} from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleButton } from "@/components/auth/google-button";
import { Mail, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<
    AuthState | undefined,
    FormData
  >(signupAction, undefined);

  if (state?.needsConfirmation) {
    return <ConfirmEmailNotice email={state.email ?? ""} />;
  }

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
        <p className="text-xs text-center text-muted-foreground">
          We&apos;ll send you a confirmation email before you can log in.
        </p>
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

function ConfirmEmailNotice({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState<
    AuthState | undefined,
    FormData
  >(resendConfirmationAction, undefined);

  return (
    <div className="text-center">
      <div className="size-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Mail className="size-6 text-primary" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
        We sent a confirmation link to{" "}
        <span className="text-foreground font-medium">{email}</span>. Click it
        to activate your account, then log in.
      </p>

      <div className="mt-6 rounded-lg border bg-muted/30 p-4 text-left text-sm space-y-1.5 text-muted-foreground">
        <p className="font-medium text-foreground">Not seeing it?</p>
        <p>• Check your spam or junk folder.</p>
        <p>• The link expires in 1 hour.</p>
        <p>• You can request a fresh one below.</p>
      </div>

      {state?.ok ? (
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-green-700">
          <CheckCircle2 className="size-4" />
          Sent. Check your inbox again.
        </p>
      ) : (
        <form action={formAction} className="mt-4">
          <input type="hidden" name="email" value={email} />
          {state?.error && (
            <p className="text-sm text-destructive mb-2">{state.error}</p>
          )}
          <Button
            type="submit"
            variant="outline"
            className="h-10"
            disabled={pending}
          >
            {pending ? "Sending…" : "Resend confirmation email"}
          </Button>
        </form>
      )}

      <Link
        href="/login"
        className="block mt-6 text-sm text-foreground font-medium underline"
      >
        Back to login
      </Link>
    </div>
  );
}
