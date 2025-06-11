const https = require("https");
require("dotenv").config();
const express = require("express");
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/nearby-hospitals", (req, res) => {
  const { lat, lng } = req.query;
  const GOOGLE_API_KEY = process.env.VITE_GOOGLE_API_KEY;
  if (!lat || !lng)
    return res.status(400).json({ error: "Missing coordinates" });

  // 50 mile radius (80467 meters)
  const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=80467&type=hospital&key=${GOOGLE_API_KEY}`;

  https
    .get(apiUrl, (apiRes) => {
      let data = "";
      apiRes.on("data", (chunk) => (data += chunk));
      apiRes.on("end", () => {
        const result = JSON.parse(data);
        res.json(result.results);
      });
    })
    .on("error", (e) => {
      res.status(500).json({ error: e.message });
    });
});

const PORT = process.env.VITE_NEAREST_HOSPITAL_API_PORT || 3002;
app.listen(PORT, () => {
  console.log(`Nearest Hospital API running on http://localhost:${PORT}`);
});
