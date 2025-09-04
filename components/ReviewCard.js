export default function ReviewCard({ r, onToggleApprove, approved }) {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm space-y-2">
      <div className="flex justify-between">
        <div>
          <div className="font-semibold">{r.guestName} — <span className="text-sm text-gray-500">{r.listing}</span></div>
          <div className="text-sm text-gray-600">{new Date(r.date).toLocaleDateString()}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">{r.rating ?? "—"}/10</div>
          <div className="text-sm text-gray-500">{r.type}</div>
        </div>
      </div>

      <div className="text-gray-800">{r.text}</div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {Object.entries(r.categories || {}).slice(0,3).map(([k,v]) => (
            <span key={k} className="mr-3">{k}: {v}</span>
          ))}
        </div>

        <div>
          <button
            onClick={() => onToggleApprove(r.id)}
            className={`px-3 py-1 text-sm rounded ${approved ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            {approved ? "Approved" : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}

