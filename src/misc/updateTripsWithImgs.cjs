const { MongoClient } = require("mongodb");
require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const MONGO_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@trailplanner.5yofcdg.mongodb.net/?retryWrites=true&w=majority&appName=TrailPlanner`; // your MongoDB connection string
const DB_NAME = "trailplanner";
const COLLECTION_NAME = "trips";
const PIXABAY_API_KEY = process.env.VITE_PIXABAY_API_KEY;

const getRandomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function assignImage() {
  const randomNum = getRandomInteger(1, 26);
  return `${randomNum}.jpg`;
}

async function updateAllTrips() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const trips = db.collection(COLLECTION_NAME);

    const cursor = trips.find();

    for await (const trip of cursor) {
      if (!trip.tripName) continue;

      const imgUrl = `src/assets/outdoor_photos/${assignImage()}`;
      if (!imgUrl) {
        console.log(`No image found for: ${trip.tripName}`);
        continue;
      }

      await trips.updateOne(
        { _id: trip._id },
        { $set: { placeholderImg: imgUrl } }
      );

      console.log(`Updated ${trip.tripName} with image.`);
    }

    console.log("✅ Done updating trips.");
  } catch (err) {
    console.error("❌ Error updating trips:", err);
  } finally {
    await client.close();
  }
}

updateAllTrips();
