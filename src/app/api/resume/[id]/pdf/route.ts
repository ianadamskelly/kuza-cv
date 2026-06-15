import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { renderResumePdf } from "@/pdf/render";
import { emptyResume, type ResumeData, type TemplateId } from "@/types/resume";
import { canonicalUrl } from "@/lib/canonical-url";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const preview = request.nextUrl.searchParams.get("preview") === "1";

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(canonicalUrl(request, "/login"));
  }

  // Preview path: render from live data (any owner can preview their own).
  if (preview) {
    const { data, error } = await supabase
      .from("resumes")
      .select("template_id, data")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const pdf = await renderResumePdf(
      data.template_id as TemplateId,
      (data.data ?? emptyResume) as ResumeData,
      true,
    );
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="resume-preview.pdf"',
        "Cache-Control": "no-store",
      },
    });
  }

  // Clean download: must come from a paid, non-expired version.
  const { data: version } = await supabase
    .from("resume_versions")
    .select("template_id, data, expires_at")
    .eq("resume_id", id)
    .eq("user_id", user.id)
    .order("paid_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!version) {
    return NextResponse.json(
      { error: "No paid version. Pay to download." },
      { status: 402 },
    );
  }
  if (new Date(version.expires_at).getTime() < Date.now()) {
    return NextResponse.json(
      { error: "Download window expired. Pay again to renew." },
      { status: 410 },
    );
  }

  const pdf = await renderResumePdf(
    version.template_id as TemplateId,
    version.data as ResumeData,
    false,
  );
  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="resume.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
