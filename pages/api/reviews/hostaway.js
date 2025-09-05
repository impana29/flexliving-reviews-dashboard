// pages/api/reviews/hostaway.js

export default async function handler(req, res) {
  try {
    // Replace with Hostaway sandbox API endpoint
    const hostawayEndpoint = "https://sandbox.hostaway.com/v1/reviews";

    // Call Hostaway API with API key authentication
    const response = await fetch(hostawayEndpoint, {
      headers: {
        "Authorization": `Bearer ${process.env.HOSTAWAY_API_KEY}`, // secure key via env variable
        "Account-Id": process.env.HOSTAWAY_ACCOUNT_ID
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch Hostaway reviews" });
    }

    const data = await response.json();

    // Normalize the reviews (example structure)
    const normalizedReviews = data.result?.map((review) => ({
      id: review.id,
      guestName: review.guestName || "Anonymous",
      rating: review.rating || null,
      comment: review.comment || "",
      propertyId: review.propertyId || null,
      createdAt: review.createdAt || review.date || null,
    })) || [];

    return res.status(200).json({ reviews: normalizedReviews });

  } catch (error) {
    console.error("Hostaway API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


