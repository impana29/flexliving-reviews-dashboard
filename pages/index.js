import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("/api/reviews/hostaway")
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews?.slice(0, 3) || [])); // show latest 3
  }, []);

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Flex Living — Reviews Dashboard</h1>
        <p className="text-gray-600">
          Manager tools to view and approve reviews for property pages.
        </p>
      </div>

      {/* Dashboard Link */}
      <div>
        <Link
          href="/dashboard"
          className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
        >
          Open Dashboard
        </Link>
      </div>

      {/* Reviews Preview */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Latest Reviews</h2>
        {reviews.length > 0 ? (
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">
                    {r.guestName}
                  </span>
                  <span className="text-yellow-500">⭐ {r.rating}</span>
                </div>
                <p className="text-gray-600">{r.comment}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews available yet.</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <h2 className="text-xl font-semibold">Notes</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-1">
          <li>
            The API route <code>/api/reviews/hostaway</code> returns normalized
            review data used by the dashboard.
          </li>
          <li>
            Property pages only display reviews approved via the dashboard
            (local state example).
          </li>
        </ul>
      </div>
    </div>
  );
}
