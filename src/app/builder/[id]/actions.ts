"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ResumeData, TemplateId } from "@/types/resume";

async function loadResume(id: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("resumes")
    .select("id, title, template_id, data, updated_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (error || !data) throw new Error("Resume not found");
  return { supabase, user, resume: data };
}

export async function saveResumeSection(
  id: string,
  patch: Partial<ResumeData>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { supabase, resume } = await loadResume(id);
    const next = { ...(resume.data as ResumeData), ...patch };
    const { error } = await supabase
      .from("resumes")
      .update({ data: next })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}

export async function renameResume(id: string, title: string) {
  const { supabase } = await loadResume(id);
  await supabase.from("resumes").update({ title }).eq("id", id);
  return { ok: true as const };
}

export async function switchTemplate(id: string, templateId: TemplateId) {
  const { supabase } = await loadResume(id);
  await supabase.from("resumes").update({ template_id: templateId }).eq("id", id);
  return { ok: true as const };
}

export async function deleteResume(id: string) {
  const { supabase } = await loadResume(id);
  await supabase.from("resumes").delete().eq("id", id);
  redirect("/dashboard");
}
