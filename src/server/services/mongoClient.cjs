const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@trailplanner.5yofcdg.mongodb.net/?retryWrites=true&w=majority&appName=TrailPlanner`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectToMongo() {
  if (!db) {
    try {
      await client.connect();
      db = client.db("trailplanner");
      console.log("✅ Connected to MongoDB");
    } catch (err) {
      console.error("❌ MongoDB connection failed:", err);
      throw err;
    }
  }
  return db;
}

async function getDb() {
  if (!db) {
    await connectToMongo();
  }
  return db;
}

async function getUsersCollection() {
  const database = await getDb();
  return database.collection("users");
}

module.exports = {
  connectToMongo,
  getDb,
  getUsersCollection,
};
