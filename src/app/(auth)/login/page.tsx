import { Suspense } from "react";
import { LoginForm } from "./form";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-40" />}>
      <LoginForm />
    </Suspense>
  );
}
