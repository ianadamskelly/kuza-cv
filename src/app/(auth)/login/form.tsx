"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  loginAction,
  resendConfirmationAction,
  type AuthState,
} from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleButton } from "@/components/auth/google-button";
import { CheckCircle2, Mail } from "lucide-react";

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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Forgot?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        {state?.error && !state.needsConfirmation && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        <Button type="submit" className="w-full h-11" disabled={pending}>
          {pending ? "Logging in…" : "Log in"}
        </Button>
      </form>

      {state?.needsConfirmation && state.email && (
        <UnconfirmedNotice email={state.email} message={state.error} />
      )}

      <p className="mt-6 text-sm text-center text-muted-foreground">
        New to Kuza Resume?{" "}
        <Link href="/signup" className="text-foreground font-medium underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

function UnconfirmedNotice({
  email,
  message,
}: {
  email: string;
  message?: string;
}) {
  const [state, formAction, pending] = useActionState<
    AuthState | undefined,
    FormData
  >(resendConfirmationAction, undefined);

  return (
    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-sm">
      <p className="flex items-start gap-2 text-amber-900">
        <Mail className="size-4 mt-0.5 shrink-0" />
        <span>{message ?? "Confirm your email to log in."}</span>
      </p>
      {state?.ok ? (
        <p className="mt-2 inline-flex items-center gap-1.5 text-green-700 text-xs">
          <CheckCircle2 className="size-3.5" />
          New confirmation email sent. Check your inbox.
        </p>
      ) : (
        <form action={formAction} className="mt-2.5">
          <input type="hidden" name="email" value={email} />
          {state?.error && (
            <p className="text-xs text-destructive mb-2">{state.error}</p>
          )}
          <Button
            type="submit"
            size="sm"
            variant="outline"
            className="h-8 bg-white"
            disabled={pending}
          >
            {pending ? "Sending…" : "Resend confirmation email"}
          </Button>
        </form>
      )}
    </div>
  );
}
