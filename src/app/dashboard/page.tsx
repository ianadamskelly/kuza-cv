import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import { buttonVariants } from "@/components/ui/button";
import { getTemplate } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { FileText, Plus } from "lucide-react";
import type { TemplateId } from "@/types/resume";
import { ResumeCardMenu } from "@/components/dashboard/resume-card-menu";

type ResumeRow = {
  id: string;
  title: string;
  template_id: TemplateId;
  updated_at: string;
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: resumes } = await supabase
    .from("resumes")
    .select("id, title, template_id, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const list = (resumes ?? []) as ResumeRow[];

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <AppHeader email={user.email ?? undefined} />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Your resumes
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {list.length === 0
                  ? "Pick a template to get started."
                  : `${list.length} resume${list.length === 1 ? "" : "s"}`}
              </p>
            </div>
            <Link
              href="/templates"
              className={cn(buttonVariants(), "h-10 px-4 gap-2")}
            >
              <Plus className="size-4" />
              New
            </Link>
          </div>

          {list.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <FileText className="size-8 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">No resumes yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a template to start building.
              </p>
              <Link
                href="/templates"
                className={cn(
                  buttonVariants(),
                  "h-10 px-4 mt-5 inline-flex gap-2",
                )}
              >
                <Plus className="size-4" />
                Browse templates
              </Link>
            </div>
          ) : (
            <ul className="grid sm:grid-cols-2 gap-3">
              {list.map((r) => {
                const tpl = getTemplate(r.template_id);
                return (
                  <li
                    key={r.id}
                    className="relative rounded-xl border bg-card hover:shadow-md transition-shadow"
                  >
                    <Link href={`/builder/${r.id}`} className="block p-4 pr-12">
                      <div className="flex items-start gap-2">
                        <span
                          className="size-2.5 rounded-full mt-1.5 shrink-0"
                          style={{ background: tpl.accentColor }}
                        />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{r.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {tpl.name} template
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        Updated{" "}
                        {new Date(r.updated_at).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </Link>
                    <div className="absolute top-3 right-3">
                      <ResumeCardMenu
                        resumeId={r.id}
                        currentTitle={r.title}
                        currentTemplate={r.template_id}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
