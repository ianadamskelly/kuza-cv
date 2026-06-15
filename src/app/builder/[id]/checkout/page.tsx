import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { emptyResume, type ResumeData, type TemplateId } from "@/types/resume";
import { getTemplate } from "@/lib/templates";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { startCheckoutAction } from "./actions";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("resumes")
    .select("title, template_id, data")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!data) redirect("/dashboard");

  const resume = (data.data ?? emptyResume) as ResumeData;
  const template = getTemplate((data.template_id ?? "classic") as TemplateId);
  const price = process.env.NEXT_PUBLIC_PRICE_KES ?? "130";

  return (
    <main className="flex-1 px-4 py-8">
      <div className="max-w-xl mx-auto">
          <Link
            href={`/builder/${id}/preview`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-8 gap-1 mb-4 -ml-2",
            )}
          >
            <ChevronLeft className="size-4" />
            Back to preview
          </Link>

          <h1 className="text-2xl font-semibold tracking-tight">
            Checkout
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            One-time payment. Unlimited downloads for 14 days.
          </p>

          <div className="mt-6 rounded-xl border bg-card p-5 space-y-4">
            <Row label="Resume" value={data.title || "Untitled"} />
            <Row label="Template" value={template.name} />
            <Row
              label="Name on CV"
              value={resume.personal.fullName || "(not set)"}
            />
            <hr className="border-border" />
            <Row label="Total" value={`KES ${price}`} bold />
          </div>

          <form action={startCheckoutAction} className="mt-5">
            <input type="hidden" name="resumeId" value={id} />
            <Button type="submit" className="w-full h-12 text-base">
              Pay KES {price}
            </Button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground flex items-start gap-2">
            <ShieldCheck className="size-3.5 mt-0.5 shrink-0 text-green-600" />
            You&apos;ll be redirected to Flutterwave to complete the payment with
            M-Pesa, card, or USSD. We never see your payment details.
          </p>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-semibold text-base" : ""}>{value}</span>
    </div>
  );
}
