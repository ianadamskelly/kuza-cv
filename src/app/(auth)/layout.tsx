import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="font-semibold tracking-tight">
            Kuza Resume
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
