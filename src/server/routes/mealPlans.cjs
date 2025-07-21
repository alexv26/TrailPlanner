const express = require("express");
const router = express.Router();
const { getDb } = require("../services/mongoClient.cjs");
const fetch = require("node-fetch");

router.post("/generate", async (req, res) => {
  const { num_nights, num_participants } = req.body;
  const apiKey = process.env.AI_API_KEY;

  if (typeof num_nights !== "number" || typeof num_participants !== "number") {
    return res.status(400).json({ error: "Invalid input" });
  }

  const prompt = `You are a student planning a trip for ${num_nights} nights...`; // truncated for brevity

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-3n-e4b-it:free",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    const result = await response.json();
    if (result.choices && result.choices[0]?.message?.content) {
      return res.json({ result: result.choices[0].message.content });
    }

    return res
      .status(500)
      .json({ error: "Unexpected response format", result });
  } catch (error) {
    console.error("Error querying OpenRouter:", error);
    res.status(500).json({ error: "Failed to fetch from OpenRouter API" });
  }
});

router.get("/saved", async (req, res) => {
  const db = await getDb();
  try {
    const mealPlans = await db.collection("mealplans").find({}).toArray();
    const mealTextArray = mealPlans.map((doc) => doc.text || "");
    res.json(mealTextArray);
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    res.status(500).json({ error: "Failed to fetch meal plans" });
  }
});

module.exports = router;
