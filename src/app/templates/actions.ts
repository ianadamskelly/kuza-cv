"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { emptyResume, type TemplateId } from "@/types/resume";
import { templates } from "@/lib/templates";

export async function createResumeAction(formData: FormData) {
  const templateId = formData.get("templateId") as TemplateId;
  if (!templates.some((t) => t.id === templateId)) {
    throw new Error("Invalid template");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      template_id: templateId,
      title: "Untitled resume",
      data: emptyResume,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Could not create resume");
  redirect(`/builder/${data.id}`);
}
