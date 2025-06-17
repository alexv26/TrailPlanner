const { MongoClient } = require("mongodb");
require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const MONGO_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@trailplanner.5yofcdg.mongodb.net/?retryWrites=true&w=majority&appName=TrailPlanner`; // your MongoDB connection string
const DB_NAME = "trailplanner";
const COLLECTION_NAME = "trips";
const PIXABAY_API_KEY = process.env.VITE_PIXABAY_API_KEY;

const getPixabayImage = async (query) => {
  try {
    const res = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(
        query
      )}&image_type=photo&orientation=horizontal&safesearch=true&per_page=3`
    );
    const data = await res.json();
    return data.hits?.[0]?.webformatURL || null;
  } catch (err) {
    console.error("Image fetch error:", err);
    return null;
  }
};

async function updateAllTrips() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const trips = db.collection(COLLECTION_NAME);

    const cursor = trips.find();

    for await (const trip of cursor) {
      if (!trip.tripName) continue;

      const imgUrl = await getPixabayImage(`${trip.tripName} nature`);
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
