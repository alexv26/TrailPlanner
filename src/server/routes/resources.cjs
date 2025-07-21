const express = require("express");
const router = express.Router();
const { getDb } = require("../services/mongoClient.cjs");

router.get("/", async (req, res) => {
  const db = await getDb();
  try {
    const resources = await db.collection("resources").find({}).toArray();
    res.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

module.exports = router;
