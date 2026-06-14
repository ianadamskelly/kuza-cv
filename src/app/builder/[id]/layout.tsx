import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";

export default async function BuilderLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("resumes")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) redirect("/dashboard");

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <AppHeader email={user.email ?? undefined} />
      {children}
    </div>
  );
}
