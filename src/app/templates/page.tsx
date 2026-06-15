import Image from "next/image";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { templates } from "@/lib/templates";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { createResumeAction } from "./actions";

export default async function TemplatesPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <AppHeader email={user.email ?? undefined} />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-semibold tracking-tight">
            Choose a template
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            You can switch templates later — your details carry across.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border bg-card p-3 flex flex-col"
              >
                <div
                  className="aspect-[210/297] rounded-md overflow-hidden border bg-white relative"
                  style={{ borderColor: t.accentColor + "33" }}
                >
                  <Image
                    src={t.previewSrc}
                    alt={`${t.name} resume template preview`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-2 pt-3 flex-1 flex flex-col">
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t.tagline}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3 flex-1">
                    Best for: {t.bestFor}
                  </p>
                  <form action={createResumeAction} className="mt-4">
                    <input type="hidden" name="templateId" value={t.id} />
                    <Button type="submit" className="w-full h-10">
                      Use this template
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
