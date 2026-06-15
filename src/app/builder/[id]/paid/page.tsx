import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { confirmPaymentByTxRef } from "@/lib/payments";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Download, XCircle, Clock } from "lucide-react";

export default async function PaidPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; tx_ref?: string }>;
}) {
  const { id } = await params;
  const { status, tx_ref } = await searchParams;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let confirmedOk = false;
  let confirmError: string | null = null;

  if (status === "cancelled") {
    confirmError = "Payment was cancelled.";
  } else if (tx_ref) {
    const result = await confirmPaymentByTxRef(tx_ref);
    if (result.ok) confirmedOk = true;
    else confirmError = result.error;
  } else {
    confirmError = "Missing transaction reference.";
  }

  const { data: version } = confirmedOk
    ? await supabase
        .from("resume_versions")
        .select("expires_at")
        .eq("resume_id", id)
        .eq("user_id", user.id)
        .order("paid_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null };

  return (
    <main className="flex-1 px-4 py-10">
      <div className="max-w-md mx-auto text-center">
          {confirmedOk ? (
            <>
              <div className="size-14 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="size-7 text-green-600" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Payment received
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your clean PDF is ready to download.
              </p>

              <div className="mt-6 rounded-xl border bg-card p-5 text-left">
                <Link
                  href={`/api/resume/${id}/pdf`}
                  className={cn(buttonVariants(), "w-full h-11 gap-2")}
                >
                  <Download className="size-4" />
                  Download CV
                </Link>
                {version?.expires_at && (
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5 justify-center">
                    <Clock className="size-3.5" />
                    Re-download until{" "}
                    {new Date(version.expires_at).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>

              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "mt-4 h-10",
                )}
              >
                Back to dashboard
              </Link>
            </>
          ) : (
            <>
              <div className="size-14 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <XCircle className="size-7 text-destructive" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Payment incomplete
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {confirmError ?? "Something went wrong."}
              </p>
              <Link
                href={`/builder/${id}/checkout`}
                className={cn(buttonVariants(), "mt-6 h-11 px-5")}
              >
                Try again
              </Link>
            </>
          )}
      </div>
    </main>
  );
}
