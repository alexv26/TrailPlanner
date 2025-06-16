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

// MongoDB connection setup
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@trailplanner.5yofcdg.mongodb.net/?retryWrites=true&w=majority&appName=TrailPlanner`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// API endpoint to get resources
app.get("/resources", async (req, res) => {
  try {
    const resources = await db.collection("resources").find({}).toArray();
    res.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  } finally {
    await client.close();
  }
});

// Start the server
const PORT = process.env.MONGODB_PORT || 3004;
app.listen(PORT, () => {
  console.log(`FetchResourcesFromDB API running on http://localhost:${PORT}`);
});
