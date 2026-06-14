import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { templates } from "@/lib/templates";
import { Check, FileText, Smartphone, ShieldCheck } from "lucide-react";
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
        <section className="px-4 pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
              Built for mobile · Made in Kenya
            </p>
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-tight">
              A professional CV.
              <br />
              <span className="text-muted-foreground">
                Built on your phone.
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              Pick a template, fill in your details with guided tips, and download
              a polished PDF. Pay only when you&apos;re ready to download.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className={cn(buttonVariants({ size: "lg" }), "h-12 px-8")}
              >
                Start free
              </Link>
              <Link
                href="#templates"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 px-8",
                )}
              >
                Browse templates
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              KES {price} per download · M-Pesa & card
            </p>
          </div>
        </section>

        <section className="px-4 py-12 border-y bg-muted/30">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8">
            <Feature
              icon={<Smartphone className="size-5" />}
              title="Mobile first"
              body="Designed for budget Android phones and mobile data. Auto-saves so you never lose work."
            />
            <Feature
              icon={<FileText className="size-5" />}
              title="Guided writing"
              body="Tooltips and examples on every field. Built around what hiring managers actually want."
            />
            <Feature
              icon={<ShieldCheck className="size-5" />}
              title="Pay once, download often"
              body="One payment unlocks unlimited downloads of your CV for 14 days."
            />
          </div>
        </section>

        <section id="templates" className="px-4 py-16">
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
                  className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow"
                >
                  <div
                    className="aspect-[3/4] rounded-lg border mb-4 bg-gradient-to-b from-white to-muted flex items-end p-3"
                    style={{ borderColor: t.accentColor + "33" }}
                  >
                    <div
                      className="w-full h-1.5 rounded-full"
                      style={{ background: t.accentColor }}
                    />
                  </div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t.tagline}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Best for: {t.bestFor}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 bg-muted/30 border-t">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Simple pricing
            </h2>
            <div className="mt-8 rounded-2xl border bg-card p-6 text-left">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-semibold">KES {price}</span>
                <span className="text-muted-foreground">per resume</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                {[
                  "Unlimited downloads for 14 days",
                  "M-Pesa or card via Flutterwave",
                  "Editing creates a new version (pay once per version)",
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
                Create your CV
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-4 text-sm text-muted-foreground">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Kuza Resume</span>
          <span>cv.kuzakizazi.com</span>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{body}</p>
    </div>
  );
}
