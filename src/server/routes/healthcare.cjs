const express = require("express");
const https = require("https");
const router = express.Router();

router.get("/nearby-hospitals", (req, res) => {
  const { lat, lng } = req.query;
  const GOOGLE_API_KEY = process.env.VITE_GOOGLE_API_KEY;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=48280&type=hospital&key=${GOOGLE_API_KEY}`;

  https
    .get(apiUrl, (apiRes) => {
      let data = "";
      apiRes.on("data", (chunk) => (data += chunk));
      apiRes.on("end", () => {
        try {
          const result = JSON.parse(data);
          res.json(result.results);
        } catch (err) {
          res.status(500).json({ error: "Failed to parse hospital data" });
        }
      });
    })
    .on("error", (e) => {
      res.status(500).json({ error: e.message });
    });
});

module.exports = router;
