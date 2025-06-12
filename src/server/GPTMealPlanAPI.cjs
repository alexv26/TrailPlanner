// https://openrouter.ai/google/gemma-3n-e4b-it:free

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.VITE_AI_MEAL_PLAN_API_PORT || 3003;
const apiKey = process.env.AI_API_KEY;

app.use(cors());
app.use(express.json());

app.post("/generate-meal-plan", async (req, res) => {
  const { num_nights, num_participants } = req.body;

  if (typeof num_nights !== "number" || typeof num_participants !== "number") {
    return res.status(400).json({ error: "Invalid input" });
  }

  const prompt = `You are a student planning a trip for ${num_nights} nights. You have ${num_participants} participants going on the trip, and two leaders. 

If num_nights is 0, this is a day trip, and you should ONLY plan for:
- Lunch
- Dinner

If num_nights is greater than 0:
- First day: plan lunch and dinner
- Intermediate days: plan breakfast, lunch, and dinner
- Final day: plan breakfast and lunch

All meals should be easy to pack and carry, and should not perish quickly. Sandwiches are a good option for lunches. Be creative but practical.

Please format your output as:
Day #: 
Meal: 
Recipe: 
Ingredients: 

Only return the meals and ingredients. Do not include any explanations.`;

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
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
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

app.listen(PORT, () => {
  console.log(`AI meal plan API running on http://localhost:${PORT}`);
});
