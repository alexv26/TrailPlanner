const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(express.json());

// CORS setup
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// MongoDB setup
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@trailplanner.5yofcdg.mongodb.net/?retryWrites=true&w=majority&appName=TrailPlanner`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db; // Global variable to store the connected DB

// Connect to MongoDB once at startup
async function startServer() {
  try {
    await client.connect();
    db = client.db("trailplanner");
    console.log("✅ Connected to MongoDB");

    // Route: Get resources
    app.get("/resources", async (req, res) => {
      try {
        const resources = await db.collection("resources").find({}).toArray();
        res.json(resources);
      } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).json({ error: "Failed to fetch resources" });
      }
    });

    // Route: Get meal plans
    app.get("/mealplans", async (req, res) => {
      try {
        const mealPlans = await db.collection("mealplans").find({}).toArray();
        const mealTextArray = mealPlans.map((doc) => doc.text || "");
        res.json(mealTextArray);
      } catch (error) {
        console.error("Error fetching meal plans:", error);
        res.status(500).json({ error: "Failed to fetch meal plans" });
      }
    });

    // Route: submit past trips
    app.post("/trips", async (req, res) => {
      try {
        const tripData = req.body;
        const result = await db.collection("trips").insertOne(tripData);
        res
          .status(201)
          .json({ message: "Trip plan saved", id: result.insertedId });
      } catch (error) {
        console.error("Error saving trip plan:", error);
        res.status(500).json({ error: "Failed to save trip plan" });
      }
    });

    // Route: get past trips
    app.get("/trips", async (req, res) => {
      try {
        const trips = await db.collection("trips").find({}).toArray();
        res.json(trips); // ✅ send full trip documents
      } catch (error) {
        console.error("Error fetching trips:", error);
        res.status(500).json({ error: "Failed to fetch trips" });
      }
    });

    const PORT = process.env.PORT || 3004;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
  }
}

startServer();
