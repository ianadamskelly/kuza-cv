"use server";

import { redirect } from "next/navigation";
import crypto from "node:crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { initPayment } from "@/lib/flutterwave";

export async function startCheckoutAction(formData: FormData) {
  const resumeId = formData.get("resumeId") as string;
  if (!resumeId) throw new Error("Missing resume id");

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: resume, error: resumeErr } = await supabase
    .from("resumes")
    .select("id, title, data")
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .single();
  if (resumeErr || !resume) throw new Error("Resume not found");

  const personal = (resume.data as { personal?: { fullName?: string; phone?: string } })
    ?.personal;
  const name = personal?.fullName?.trim() || user.email || "Kuza User";
  const phone = personal?.phone?.trim() || undefined;
  const amount = Number(process.env.NEXT_PUBLIC_PRICE_KES ?? "130");

  const txRef = `kuza_${resumeId.slice(0, 8)}_${crypto.randomBytes(6).toString("hex")}`;

  const admin = createSupabaseAdminClient();
  const { error: insertErr } = await admin.from("payments").insert({
    user_id: user.id,
    resume_id: resumeId,
    tx_ref: txRef,
    amount,
    currency: "KES",
    status: "pending",
  });
  if (insertErr) throw new Error(insertErr.message);

  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/builder/${resumeId}/paid`;

  const result = await initPayment({
    txRef,
    amount,
    currency: "KES",
    email: user.email ?? "noreply@kuzakizazi.com",
    name,
    phone,
    redirectUrl,
    title: "Kuza Resume",
    description: `Download for ${resume.title}`,
  });

  if (!result.ok) {
    await admin
      .from("payments")
      .update({ status: "failed", raw_payload: { initError: result.error } })
      .eq("tx_ref", txRef);
    throw new Error(result.error);
  }

  redirect(result.link);
}
