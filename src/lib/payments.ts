import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyByReference } from "@/lib/flutterwave";

type ConfirmResult =
  | { ok: true; alreadyConfirmed: boolean; paymentId: string; resumeId: string }
  | { ok: false; error: string; status?: number };

// Marks a payment successful and snapshots a resume_version. Idempotent — safe
// to call from both the webhook and the user redirect. Verifies with
// Flutterwave directly before trusting any state change.
export async function confirmPaymentByTxRef(txRef: string): Promise<ConfirmResult> {
  const admin = createSupabaseAdminClient();

  const { data: payment, error: payErr } = await admin
    .from("payments")
    .select("id, user_id, resume_id, status, amount")
    .eq("tx_ref", txRef)
    .single();
  if (payErr || !payment) {
    return { ok: false, error: "Payment not found", status: 404 };
  }
  if (payment.status === "successful") {
    return {
      ok: true,
      alreadyConfirmed: true,
      paymentId: payment.id,
      resumeId: payment.resume_id,
    };
  }

  const v = await verifyByReference(txRef);
  if (!v.ok) return { ok: false, error: v.error };
  if (!v.successful) {
    await admin
      .from("payments")
      .update({
        status: "failed",
        flw_transaction_id: v.transactionId,
        raw_payload: v.raw as object,
      })
      .eq("id", payment.id);
    return { ok: false, error: "Payment not successful" };
  }
  if (Number(v.amount) < Number(payment.amount)) {
    return { ok: false, error: "Amount mismatch" };
  }

  const { data: resume, error: resumeErr } = await admin
    .from("resumes")
    .select("template_id, data")
    .eq("id", payment.resume_id)
    .single();
  if (resumeErr || !resume) {
    return { ok: false, error: "Resume not found" };
  }

  const now = new Date();
  const expires = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const { error: snapErr } = await admin.from("resume_versions").insert({
    resume_id: payment.resume_id,
    user_id: payment.user_id,
    template_id: resume.template_id,
    data: resume.data,
    paid_at: now.toISOString(),
    expires_at: expires.toISOString(),
    payment_id: payment.id,
  });
  if (snapErr) return { ok: false, error: snapErr.message };

  await admin
    .from("payments")
    .update({
      status: "successful",
      flw_transaction_id: v.transactionId,
      raw_payload: v.raw as object,
    })
    .eq("id", payment.id);

  return {
    ok: true,
    alreadyConfirmed: false,
    paymentId: payment.id,
    resumeId: payment.resume_id,
  };
}
