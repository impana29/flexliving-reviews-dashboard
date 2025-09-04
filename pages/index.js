import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Flex Living — Reviews Dashboard</h1>
      <p className="text-gray-600">Manager tools to view and approve reviews for property pages.</p>

      <div className="space-x-4">
        <Link href="/dashboard">Open Dashboard</Link>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Notes</h2>
        <ul className="list-disc pl-6 text-gray-600">
          <li>The API route <code>/api/reviews/hostaway</code> returns normalized review data used by the dashboard.</li>
          <li>Property pages only display reviews approved via the dashboard (local state example).</li>
        </ul>
      </div>
    </div>
  );
}

