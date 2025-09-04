import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/"><a className="font-bold text-lg">FlexLiving Dashboard</a></Link>
          <nav className="space-x-4">
            <Link href="/dashboard"><a className="text-sm">Manager Dashboard</a></Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="mt-12 py-6 text-center text-sm text-gray-500">
        Built for assessment — shows mock Hostaway and Places API exploration.
      </footer>
    </div>
  );
}

