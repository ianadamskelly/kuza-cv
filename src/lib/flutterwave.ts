const BASE_URL =
  process.env.FLUTTERWAVE_BASE_URL ?? "https://api.flutterwave.com/v3";

function authHeaders() {
  const key = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!key) throw new Error("FLUTTERWAVE_SECRET_KEY is not set");
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

export type InitPaymentInput = {
  txRef: string;
  amount: number;
  currency: "KES" | "USD";
  email: string;
  name: string;
  phone?: string;
  redirectUrl: string;
  title: string;
  description: string;
};

export type InitPaymentResult =
  | { ok: true; link: string }
  | { ok: false; error: string };

export async function initPayment(
  input: InitPaymentInput,
): Promise<InitPaymentResult> {
  try {
    const res = await fetch(`${BASE_URL}/payments`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        tx_ref: input.txRef,
        amount: input.amount,
        currency: input.currency,
        redirect_url: input.redirectUrl,
        payment_options: "card,mobilemoney,mobilemoneyfranco,ussd",
        customer: {
          email: input.email,
          name: input.name,
          phonenumber: input.phone,
        },
        customizations: {
          title: input.title,
          description: input.description,
        },
      }),
    });
    const json = (await res.json()) as {
      status?: string;
      message?: string;
      data?: { link?: string };
    };
    if (json.status === "success" && json.data?.link) {
      return { ok: true, link: json.data.link };
    }
    return { ok: false, error: json.message ?? "Flutterwave init failed" };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

export type VerifyResult =
  | {
      ok: true;
      successful: boolean;
      amount: number;
      currency: string;
      txRef: string;
      transactionId: string;
      raw: unknown;
    }
  | { ok: false; error: string };

export async function verifyByReference(txRef: string): Promise<VerifyResult> {
  try {
    const res = await fetch(
      `${BASE_URL}/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef)}`,
      { headers: authHeaders(), cache: "no-store" },
    );
    const json = (await res.json()) as {
      status?: string;
      message?: string;
      data?: {
        id?: number;
        status?: string;
        amount?: number;
        currency?: string;
        tx_ref?: string;
      };
    };
    if (json.status !== "success" || !json.data) {
      return { ok: false, error: json.message ?? "Verification failed" };
    }
    return {
      ok: true,
      successful: json.data.status === "successful",
      amount: json.data.amount ?? 0,
      currency: json.data.currency ?? "KES",
      txRef: json.data.tx_ref ?? txRef,
      transactionId: String(json.data.id ?? ""),
      raw: json.data,
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}
