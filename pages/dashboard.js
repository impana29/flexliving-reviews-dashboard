import useSWR from "swr";
import { useState, useMemo } from "react";
import ReviewCard from "../components/ReviewCard";
import Filters from "../components/Filters";
import Link from "next/link";

const fetcher = url => fetch(url).then(r => r.json());

export default function Dashboard() {
  const { data, error } = useSWR("/api/reviews/hostaway", fetcher);
  const [filters, setFilters] = useState({});
  const [approvedIds, setApprovedIds] = useState(() => {
    // For demo, persist approvals in localStorage
    if (typeof window !== "undefined") {
      try { return JSON.parse(localStorage.getItem("approvedReviews") || "[]"); } catch { return []; }
    }
    return [];
  });

  const toggleApprove = (id) => {
    setApprovedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      if (typeof window !== "undefined") localStorage.setItem("approvedReviews", JSON.stringify(next));
      return next;
    });
  };

  const list = data?.data || [];

  const filtered = useMemo(() => {
    return list.filter(r => {
      if (filters.listing && !r.listing.toLowerCase().includes(filters.listing.toLowerCase())) return false;
      if (filters.minRating && (r.rating === null || r.rating < Number(filters.minRating))) return false;
      if (filters.q && !(r.text || "").toLowerCase().includes(filters.q.toLowerCase())) return false;
      return true;
    }).sort((a,b) => (b.rating || 0) - (a.rating || 0));
  }, [list, filters]);

  if (error) return <div>Error loading reviews</div>
  if (!data) return <div>Loading…</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        <Link href="/"><a className="text-sm text-blue-600">Back to home</a></Link>
      </div>

      <Filters filters={filters} onChange={setFilters} />

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(r =>
          <ReviewCard
            key={r.id}
            r={r}
            onToggleApprove={toggleApprove}
            approved={approvedIds.includes(r.id)}
          />
        )}
      </div>

      <div className="bg-white p-4 rounded-md shadow-sm">
        <h2 className="font-semibold">Quick actions</h2>
        <p className="text-sm text-gray-600">Approved reviews are stored in your browser localStorage for demo. When deploying to production you would persist approvals server-side and expose them via an API or CMS to the public property page.</p>
      </div>

      <div>
        <h3 className="font-semibold">Open property pages</h3>
        <ul className="list-disc pl-6 text-blue-600">
          {/* discover unique listing ids */}
          {[...new Set(list.map(r => r.listing))].map((listing, i) => (
            <li key={i}>
              <Link href={`/property/${encodeURIComponent(listing)}`}><a>{listing}</a></Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
