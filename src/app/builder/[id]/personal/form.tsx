"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tip } from "@/components/builder/tip";
import { StepperNav } from "@/components/builder/stepper-nav";
import { BottomBar } from "@/components/builder/bottom-bar";
import { useAutosave } from "@/components/builder/use-autosave";
import { tips } from "@/lib/tips";
import type { ResumeData } from "@/types/resume";
import { useEffect } from "react";

type Personal = ResumeData["personal"];

export function PersonalForm({
  resumeId,
  initial,
}: {
  resumeId: string;
  initial: Personal;
}) {
  const { save, saving } = useAutosave(resumeId);
  const { register, watch } = useForm<Personal>({ defaultValues: initial });

  useEffect(() => {
    const sub = watch((value) => {
      save({ personal: value as Personal });
    });
    return () => sub.unsubscribe();
  }, [watch, save]);

  return (
    <>
      <StepperNav resumeId={resumeId} current="personal" />
      <main className="flex-1 px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          <header>
            <h1 className="text-xl font-semibold tracking-tight">
              Personal details
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              How recruiters reach you.
            </p>
          </header>

          <Field label="Full name" htmlFor="fullName">
            <Input id="fullName" {...register("fullName")} />
            <Tip>{tips.fullName}</Tip>
          </Field>

          <Field label="Professional title" htmlFor="title">
            <Input
              id="title"
              placeholder="e.g. Customer Service Specialist"
              {...register("title")}
            />
            <Tip>{tips.title}</Tip>
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                type="email"
                inputMode="email"
                {...register("email")}
              />
              <Tip>{tips.email}</Tip>
            </Field>

            <Field label="Phone" htmlFor="phone">
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                placeholder="+254 7XX XXX XXX"
                {...register("phone")}
              />
              <Tip>{tips.phone}</Tip>
            </Field>
          </div>

          <Field label="Location" htmlFor="location">
            <Input
              id="location"
              placeholder="Nairobi, Kenya"
              {...register("location")}
            />
            <Tip>{tips.location}</Tip>
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="LinkedIn (optional)" htmlFor="linkedin">
              <Input
                id="linkedin"
                placeholder="linkedin.com/in/yourname"
                {...register("linkedin")}
              />
            </Field>
            <Field label="Website (optional)" htmlFor="website">
              <Input
                id="website"
                placeholder="yourdomain.com"
                {...register("website")}
              />
            </Field>
          </div>
        </div>
      </main>
      <BottomBar resumeId={resumeId} current="personal" saving={saving} />
    </>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
