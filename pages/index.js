import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DashboardFilters from "../components/DashboardFilters";
import ReviewCard from "../components/ReviewCard";

export default function Dashboard() {
  const [reviews, setReviews] = useState([]);
  const [display, setDisplay] = useState([]);
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetch("/api/reviews/hostaway")
      .then(r => r.json())
      .then(data => {
        const reviews = (data.reviews || []).map(r => ({ ...r, approved: false }));
        setReviews(reviews);
        setDisplay(reviews);
        setProperties(Array.from(new Set(reviews.map(r => r.listingName))));
      });
  }, []);

  function handleFilters(next) {
    setFilters(next);
    applyFilters(reviews, next);
  }

  function applyFilters(base, f) {
    let out = base.slice();
    if (f.property) out = out.filter(r => r.listingName === f.property);
    if (f.channel) out = out.filter(r => r.channel === f.channel);
    if (f.minRating) out = out.filter(r => (r.rating || 0) >= f.minRating);
    if (f.sortBy === "date_desc") out = out.sort((a,b) => new Date(b.date) - new Date(a.date));
    if (f.sortBy === "date_asc") out = out.sort((a,b) => new Date(a.date) - new Date(b.date));
    if (f.sortBy === "rating_desc") out = out.sort((a,b) => (b.rating||0) - (a.rating||0));
    setDisplay(out);
  }

  function toggleApprove(id) {
    const next = reviews.map(r => r.id === id ? { ...r, approved: !r.approved } : r);
    setReviews(next);
    // reapply filters
    applyFilters(next, filters);
  }

  return (
    <Layout>
      <div className="space-y-6">
        <DashboardFilters properties={properties} onChange={handleFilters} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {display.map(r => (
            <ReviewCard key={r.id} review={r} onToggleApprove={toggleApprove} />
          ))}
        </div>

        <section className="mt-6 bg-white p-4 rounded">
          <h2 className="font-semibold">Approved Reviews (will show on property page)</h2>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {reviews.filter(r => r.approved).length === 0 && <div className="text-sm text-slate-500">No approved reviews yet</div>}
            {reviews.filter(r => r.approved).map(r => (
              <div key={`approved-${r.id}`} className="p-3 border rounded bg-slate-50">
                <div className="font-medium">{r.guestName} — {r.listingName}</div>
                <div className="text-sm text-slate-600">{r.publicReview}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

