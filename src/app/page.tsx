import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { templates } from "@/lib/templates";
import {
  Check,
  LayoutGrid,
  PencilLine,
  Download,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const price = process.env.NEXT_PUBLIC_PRICE_KES ?? "130";

  return (
    <div className="flex flex-col flex-1">
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            Kuza Resume
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 pt-14 pb-16 sm:pt-24 sm:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
              Built for mobile · Made for hustlers
            </p>
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.1]">
              Your CV.
              <br />
              <span className="text-muted-foreground">In your hands.</span>
            </h1>
            <p className="mt-7 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              No cyber café. No waiting for a friend to fix the formatting.
              No paying someone KES 500 to change one line. Build a clean,
              professional CV from your phone — in minutes.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className={cn(buttonVariants({ size: "lg" }), "h-12 px-8")}
              >
                Start free
              </Link>
              <Link
                href="#how"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 px-8",
                )}
              >
                See how it works
              </Link>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              KES {price} when you&apos;re ready to download · M-Pesa &amp; card
            </p>
          </div>
        </section>

        {/* The promise — pain → power */}
        <section className="px-4 py-16 sm:py-20 border-y bg-muted/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">
              The job won&apos;t wait. Neither should your CV.
            </h2>
            <p className="text-center text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">
              You see the post on WhatsApp at 9pm. Deadline is tomorrow. Your CV
              still has last year&apos;s phone number. Sound familiar?
            </p>
            <div className="mt-12 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="rounded-xl border bg-card p-5">
                <p className="text-sm font-semibold text-muted-foreground">
                  Without Kuza
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>Find a cyber. Pay KES 50/hour.</li>
                  <li>Hope the format doesn&apos;t break.</li>
                  <li>Or beg a friend with a laptop.</li>
                  <li>Wait until tomorrow. Miss the deadline.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-foreground/20 bg-card p-5 shadow-sm">
                <p className="text-sm font-semibold">With Kuza Resume</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex gap-2">
                    <Check className="size-4 mt-0.5 shrink-0 text-green-600" />
                    Open the site on your phone.
                  </li>
                  <li className="flex gap-2">
                    <Check className="size-4 mt-0.5 shrink-0 text-green-600" />
                    Pick a template. Fill in your details.
                  </li>
                  <li className="flex gap-2">
                    <Check className="size-4 mt-0.5 shrink-0 text-green-600" />
                    Pay KES {price} via M-Pesa.
                  </li>
                  <li className="flex gap-2">
                    <Check className="size-4 mt-0.5 shrink-0 text-green-600" />
                    Download. Apply. Done.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How it works — 3 steps */}
        <section id="how" className="px-4 py-16 sm:py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">
              Three steps. That&apos;s it.
            </h2>
            <p className="text-center text-muted-foreground mt-2">
              No design skills. No laptop. No middleman.
            </p>
            <ol className="mt-10 grid sm:grid-cols-3 gap-6">
              <Step
                n="1"
                icon={<LayoutGrid className="size-5" />}
                title="Pick a template"
                body="Three clean designs to choose from. ATS-friendly so recruiters can actually read them."
              />
              <Step
                n="2"
                icon={<PencilLine className="size-5" />}
                title="Fill in your details"
                body="Guided fields with examples and tips. We auto-save every step — no lost work."
              />
              <Step
                n="3"
                icon={<Download className="size-5" />}
                title="Download your CV"
                body="Preview free anytime. Pay KES 130 once. Re-download for 14 days, edits included."
              />
            </ol>
          </div>
        </section>

        {/* Templates */}
        <section id="templates" className="px-4 pb-16 sm:pb-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">
              Three templates to start with
            </h2>
            <p className="text-muted-foreground text-center mt-2">
              More designs coming soon.
            </p>
            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              {templates.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl border bg-card p-3 hover:shadow-md transition-shadow"
                >
                  <div
                    className="aspect-[210/297] rounded-md overflow-hidden border bg-white relative"
                    style={{ borderColor: t.accentColor + "33" }}
                  >
                    <Image
                      src={t.previewSrc}
                      alt={`${t.name} resume template preview`}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="p-2 pt-3">
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {t.tagline}
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                      Best for: {t.bestFor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="px-4 py-16 sm:py-20 bg-muted/30 border-y">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              One small payment. No subscription.
            </h2>
            <p className="text-muted-foreground mt-2">
              Less than a chapati. Cleaner than what most agents charge.
            </p>
            <div className="mt-8 rounded-2xl border bg-card p-6 text-left">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-semibold">KES {price}</span>
                <span className="text-muted-foreground">per resume</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                {[
                  "Unlimited downloads for 14 days",
                  "M-Pesa, card, or USSD via Flutterwave",
                  "Editing creates a new version — pay only when you download a new one",
                  "Free watermarked preview anytime",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="size-4 mt-0.5 shrink-0 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full mt-6 h-11",
                )}
              >
                Build my CV
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-16 sm:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
              Don&apos;t miss the next opportunity.
            </h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              The CV that gets you the interview is the one that&apos;s ready
              when the job comes up. Build yours tonight.
            </p>
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-7 h-12 px-8",
              )}
            >
              Start free
            </Link>
            <p className="mt-6 text-sm text-muted-foreground flex items-center gap-2 justify-center">
              <Mail className="size-4" />
              Questions?{" "}
              <a
                href="mailto:cv@kuzakizazi.com"
                className="underline text-foreground"
              >
                cv@kuzakizazi.com
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-4 text-sm text-muted-foreground">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Kuza Resume</span>
          <span className="flex items-center gap-3">
            <a
              href="mailto:cv@kuzakizazi.com"
              className="hover:text-foreground"
            >
              cv@kuzakizazi.com
            </a>
            <span>·</span>
            <span>cv.kuzakizazi.com</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

function Step({
  n,
  icon,
  title,
  body,
}: {
  n: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="relative rounded-xl border bg-card p-5">
      <div className="flex items-center gap-3">
        <span className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </span>
        <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Step {n}
        </span>
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1.5">{body}</p>
    </li>
  );
}
