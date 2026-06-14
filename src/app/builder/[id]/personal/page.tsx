import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { emptyResume, type ResumeData } from "@/types/resume";
import { PersonalForm } from "./form";

export default async function PersonalPage({
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
    .select("data")
    .eq("id", id)
    .single();

  const resume = (data?.data ?? emptyResume) as ResumeData;
  return <PersonalForm resumeId={id} initial={resume.personal} />;
}
