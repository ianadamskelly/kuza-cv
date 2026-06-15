"use client";

import { useActionState } from "react";
import { setNewPasswordAction, type AuthState } from "@/app/(auth)/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState<
    AuthState | undefined,
    FormData
  >(setNewPasswordAction, undefined);

  return (
    <form action={formAction} className="mt-6 space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="At least 6 characters"
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" className="w-full h-11" disabled={pending}>
        {pending ? "Saving…" : "Save & continue"}
      </Button>
    </form>
  );
}
