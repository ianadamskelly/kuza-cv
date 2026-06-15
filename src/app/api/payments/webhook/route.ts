import { NextResponse, type NextRequest } from "next/server";
import { confirmPaymentByTxRef } from "@/lib/payments";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  const signature = request.headers.get("verif-hash");
  if (!secretHash || signature !== secretHash) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: { data?: { tx_ref?: string }; event?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const txRef = body?.data?.tx_ref;
  if (!txRef) {
    return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });
  }

  const result = await confirmPaymentByTxRef(txRef);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, alreadyConfirmed: result.alreadyConfirmed });
}
