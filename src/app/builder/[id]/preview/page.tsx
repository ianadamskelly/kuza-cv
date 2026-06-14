import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { emptyResume, type ResumeData, type TemplateId } from "@/types/resume";
import { StepperNav } from "@/components/builder/stepper-nav";
import { BottomBar } from "@/components/builder/bottom-bar";
import { getTemplate } from "@/lib/templates";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Download, Eye } from "lucide-react";

export default async function PreviewPage({
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
    .single();

  const resume = (data?.data ?? emptyResume) as ResumeData;
  const template = getTemplate((data?.template_id ?? "classic") as TemplateId);
  const price = process.env.NEXT_PUBLIC_PRICE_KES ?? "130";

  const filled = {
    personal: !!resume.personal.fullName,
    summary: resume.summary.length > 20,
    experience: resume.experience.length > 0,
    education: resume.education.length > 0,
    skills: resume.skills.length > 0,
  };
  const complete = Object.values(filled).every(Boolean);

  return (
    <>
      <StepperNav resumeId={id} current="preview" />
      <main className="flex-1 px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <header>
            <h1 className="text-xl font-semibold tracking-tight">Preview</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Using the <strong>{template.name}</strong> template. You can
              switch templates anytime.
            </p>
          </header>

          {!complete && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
              <p className="font-medium text-amber-900">
                A few sections are still empty
              </p>
              <ul className="mt-2 space-y-1 text-amber-800">
                {!filled.personal && <li>• Add your personal details</li>}
                {!filled.summary && (
                  <li>• Write a short professional summary</li>
                )}
                {!filled.experience && <li>• Add at least one role</li>}
                {!filled.education && <li>• Add education</li>}
                {!filled.skills && <li>• Add a few skills</li>}
              </ul>
            </div>
          )}

          <div className="rounded-xl border bg-card p-6 text-center">
            <div className="inline-flex size-12 items-center justify-center rounded-full bg-muted mb-3">
              <Eye className="size-5" />
            </div>
            <h2 className="font-semibold">PDF preview</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              See your CV with the {template.name} template. The free preview is
              watermarked. Pay KES {price} to download the clean version.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                href={`/api/resume/${id}/pdf?preview=1`}
                target="_blank"
                className={cn(buttonVariants({ variant: "outline" }), "h-11 px-5 gap-2")}
              >
                <Eye className="size-4" />
                Open preview
              </Link>
              <Link
                href={`/builder/${id}/checkout`}
                className={cn(buttonVariants(), "h-11 px-5 gap-2")}
              >
                <Download className="size-4" />
                Pay & download (KES {price})
              </Link>
            </div>
          </div>
        </div>
      </main>
      <BottomBar resumeId={id} current="preview" />
    </>
  );
}
