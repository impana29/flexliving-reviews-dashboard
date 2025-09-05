import path from "path";
import { promises as fs } from "fs";

export default async function handler(req, res) {
  // Read mock data file
  const jsonPath = path.join(process.cwd(), "data", "mock_reviews.json");
  const jsonStr = await fs.readFile(jsonPath, "utf8");
  const raw = JSON.parse(jsonStr);

  // Normalize
  const normalized = (raw.result || []).map(r => {
    const categories = (r.reviewCategory || []).reduce((acc, c) => {
      acc[c.category] = c.rating;
      return acc;
    }, {});
    return {
      id: r.id,
      listing: r.listingName,
      date: new Date(r.submittedAt).toISOString(),
      type: r.type,
      status: r.status,
      rating: r.rating === null ? average(Object.values(categories)) : r.rating,
      text: r.publicReview,
      guestName: r.guestName,
      categories
    };
  });

  res.status(200).json({ status: "ok", data: normalized });
}

function average(arr) {
  const nums = arr.filter(v => typeof v === "number");
  if (!nums.length) return null;
  return Math.round(nums.reduce((a,b)=>a+b,0)/nums.length);
}
