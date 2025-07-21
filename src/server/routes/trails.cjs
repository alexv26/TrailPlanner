const express = require("express");
const https = require("https");
const router = express.Router();

const GOOGLE_API_KEY = process.env.VITE_GOOGLE_API_KEY;

router.get("/info", (req, res) => {
  const trailName = req.query.name;

  if (!trailName) {
    return res.status(400).json({ error: "Missing trail name" });
  }

  const apiUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
    trailName
  )}&inputtype=textquery&fields=name,formatted_address,geometry,place_id&key=${GOOGLE_API_KEY}`;

  https
    .get(apiUrl, (apiRes) => {
      let data = "";
      apiRes.on("data", (chunk) => (data += chunk));
      apiRes.on("end", () => {
        try {
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
        } catch (err) {
          res.status(500).json({ error: "Failed to parse trailhead data" });
        }
      });
    })
    .on("error", (e) => {
      res.status(500).json({ error: e.message });
    });
});

module.exports = router;
