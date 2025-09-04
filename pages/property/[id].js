import { useRouter } from "next/router";
import useSWR from "swr";
import { useEffect, useState } from "react";
const fetcher = url => fetch(url).then(r => r.json());

export default function Property() {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useSWR("/api/reviews/hostaway", fetcher);
  const [approvedIds, setApprovedIds] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try { setApprovedIds(JSON.parse(localStorage.getItem("approvedReviews") || "[]")); } catch { setApprovedIds([]); }
    }
  }, []);

  const reviews = (data?.data || []).filter(r => r.listing === id && approvedIds.includes(r.id));

  return (
    <div>
      <h1 className="text-2xl font-bold">{id}</h1>
      <p className="text-gray-600">This page replicates the property layout and only shows manager-approved reviews.</p>

      <div className="mt-6 space-y-4">
        {reviews.length ? reviews.map(r => (
          <div key={r.id} className="bg-white p-4 rounded shadow-sm">
            <div className="font-semibold">{r.guestName} — <span className="text-sm text-gray-500">{new Date(r.date).toLocaleDateString()}</span></div>
            <div className="mt-2">{r.text}</div>
            <div className="text-sm text-gray-500 mt-2">Rating: {r.rating}/10</div>
          </div>
        )) : <div className="text-gray-500">No approved reviews for this property. Go to <a className="text-blue-600" href="/dashboard">Dashboard</a> to approve.</div>}
      </div>

    </div>
  );
}

