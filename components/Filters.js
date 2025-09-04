export default function Filters({ filters, onChange }) {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm flex gap-4 items-center">
      <div>
        <label className="block text-xs text-gray-500">Listing</label>
        <input value={filters.listing || ""} onChange={e => onChange({ ...filters, listing: e.target.value })} className="border px-2 py-1 rounded" />
      </div>

      <div>
        <label className="block text-xs text-gray-500">Min Rating</label>
        <input type="number" min="0" max="10" value={filters.minRating || ""} onChange={e => onChange({ ...filters, minRating: e.target.value })} className="border px-2 py-1 rounded w-20" />
      </div>

      <div>
        <label className="block text-xs text-gray-500">Keyword</label>
        <input value={filters.q || ""} onChange={e => onChange({ ...filters, q: e.target.value })} className="border px-2 py-1 rounded" />
      </div>
    </div>
  );
}

