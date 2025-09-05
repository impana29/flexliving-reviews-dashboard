import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

export default function PropertyPage() {
  const router = useRouter();
  const { id } = router.query;
  const [approved, setApproved] = useState([]);
  const [propertyName, setPropertyName] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/reviews/hostaway");
      const data = await res.json();
      const all = data.reviews || [];
      // For demo: treat `id` as a listingName slug or index
      if (!id) return;
      // find listing by name (if id matches listingName substring) else fallback to first
      const matched = all.filter(r => encodeURIComponent(r.listingName).includes(id) || (r.listingName === id));
      const list = matched.filter(r => r.approved); // Note: approved flags are in-memory in dashboard only
      // For persistent approvals you'd save approvals server-side; for demo just show high-rated ones
      const fallbackApproved = matched.filter(r => (r.rating || 0) >= 4);
      setApproved(list.length ? list : fallbackApproved);
      setPropertyName(matched[0]?.listingName || decodeURIComponent(id));
    }
    load();
  }, [id]);

  return (
    <Layout>
      <div className="bg-white p-6 rounded">
        <h2 className="text-xl font-semibold">{propertyName || "Property"}</h2>
        <div className="mt-4">
          <h3 className="font-medium">Guest Reviews</h3>
          <div className="mt-3 space-y-3">
            {approved.length === 0 && <div className="text-slate-500 text-sm">No approved reviews to show for this property.</div>}
            {approved.map(r => (
              <div key={r.id} className="border rounded p-3 bg-slate-50">
                <div className="font-semibold">{r.guestName} — {r.rating ?? "-"}/5</div>
                <div className="text-sm text-slate-700 mt-1">{r.publicReview}</div>
                <div className="text-xs text-slate-500 mt-1">{new Date(r.date).toLocaleDateString()} — {r.channel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
