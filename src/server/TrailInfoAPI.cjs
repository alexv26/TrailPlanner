const https = require("https");
require("dotenv").config();
const url = require("url");
const express = require("express");
const app = express();

const GOOGLE_API_KEY = process.env.VITE_GOOGLE_API_KEY;

app.use(express.json());

// ✅ Allow cross-origin requests from your frontend
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/trailhead", (req, res) => {
  const trailName = req.query.name;
  if (!trailName) {
    return res.status(400).json({ error: "Missing trail name" });
  }

  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
    trailName
  )}&inputtype=textquery&fields=name,formatted_address,geometry,place_id&key=${GOOGLE_API_KEY}`;

  https
    .get(url, (apiRes) => {
      let data = "";
      apiRes.on("data", (chunk) => (data += chunk));
      apiRes.on("end", () => {
        const result = JSON.parse(data);
        if (result.candidates && result.candidates.length > 0) {
          const place = result.candidates[0];
          res.json({
            name: place.name,
            address: place.formatted_address,
            location: place.geometry.location,
            place_id: place.place_id,
          });
        } else {
          res.status(404).json({ error: "Trailhead not found" });
        }
      });
    })
    .on("error", (e) => {
      res.status(500).json({ error: e.message });
    });
});

const PORT = process.env.VITE_TRAIL_INFO_API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Trailhead API running on http://localhost:${PORT}`);
});
