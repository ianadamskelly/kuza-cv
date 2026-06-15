"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction, type AuthState } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState<
    AuthState | undefined,
    FormData
  >(requestPasswordResetAction, undefined);

  if (state?.ok) {
    return (
      <div className="text-center">
        <CheckCircle2 className="size-10 mx-auto text-green-600 mb-3" />
        <h1 className="text-xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-sm text-muted-foreground mt-2">
          We sent a reset link. It expires in 1 hour. Don&apos;t see it? Check
          your spam folder.
        </p>
        <Link
          href="/login"
          className="inline-block mt-6 text-sm text-foreground font-medium underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Reset your password
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        Enter your email — we&apos;ll send a link to set a new one.
      </p>

      <form action={formAction} className="mt-6 space-y-3">
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
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        <Button type="submit" className="w-full h-11" disabled={pending}>
          {pending ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-center text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className="text-foreground font-medium underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
