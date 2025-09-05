// pages/api/reviews/hostaway.js
import fs from "fs";
import path from "path";

// Normalizer function
function normalize(raw) {
  const categories = (raw.reviewCategory || []).map(c => ({
    category: c.category,
    rating: c.rating
  }));

  let rating = raw.rating;
  if (rating == null) {
    if (categories.length) {
      const avg = categories.reduce((s, c) => s + (c.rating || 0), 0) / categories.length;
      rating = Math.round((avg / 2) * 10) / 10; // scale 0–10 into ~0–5
    } else {
      rating = null;
    }
  }

  return {
    id: raw.id,
    listingName: raw.listingName,
    guestName: raw.guestName,
    publicReview: raw.publicReview,
    rating,
    categories,
    date: raw.submittedAt,
    channel: raw.channel || "hostaway",
    type: raw.type,
    status: raw.status
  };
}

export default async function handler(req, res) {
  try {
    const useHostaway = process.env.USE_HOSTAWAY_API === "true";

    let reviewsData;

    if (useHostaway) {
      // Call Hostaway Sandbox API
      const accountId = process.env.HOSTAWAY_ACCOUNT_ID;
      const apiKey = process.env.HOSTAWAY_API_KEY;

      const response = await fetch(
        `https://sandbox.hostaway.com/v1/reviews?accountId=${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Hostaway API failed: ${response.statusText}`);
      }

      const data = await response.json();
      reviewsData = data.result || [];
    } else {
      // Use local mock JSON
      const filePath = path.join(process.cwd(), "public", "mock-reviews.json");
      const fileContents = fs.readFileSync(filePath, "utf8");
      const parsed = JSON.parse(fileContents);
      reviewsData = parsed.result || [];
    }

    const normalized = reviewsData.map(normalize);

    res.status(200).json({ status: "ok", reviews: normalized });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reviews", details: err.message });
  }
}

