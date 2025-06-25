const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(express.json());

// CORS setup
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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

let db;

async function startServer() {
  try {
    await client.connect();
    db = client.db("trailplanner");
    const usersCollection = db.collection("users");
    console.log("✅ Connected to MongoDB");

    // --- AUTH ROUTES ---

    // Signup route
    app.post("/api/signup", async (req, res) => {
      const fullUser = req.body;

      try {
        // Check for existing user by username
        const existing = await usersCollection.findOne({
          username: fullUser.username,
        });
        if (existing) {
          return res.status(400).json({ message: "Username already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(fullUser.password, 10);
        fullUser.password = hashedPassword;

        // Optional: add server-generated fields (e.g. creation date)
        fullUser.dateCreated = new Date().toISOString();

        // Insert the full user object
        await usersCollection.insertOne(fullUser);

        // Generate JWT
        const token = jwt.sign(
          { username: fullUser.username, email: fullUser.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Respond with token and basic user info
        res.status(201).json({
          token,
          userData: {
            ...fullUser,
            password: undefined, // don’t send password back
          },
        });
      } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Login route
    app.post("/api/login", async (req, res) => {
      const { username, password } = req.body;
      const user = await usersCollection.findOne({ username });
      if (!user)
        return res
          .status(401)
          .json({ message: "Invalid username or password" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(401)
          .json({ message: "Invalid username or password" });

      // Update lastLogin field with current timestamp
      const lastLoginDate = new Date().toISOString();
      await usersCollection.updateOne(
        { username },
        { $set: { lastLogin: lastLoginDate } }
      );

      const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({
        token,
        userData: {
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          lastLogin: lastLoginDate,
          dateCreated: user.dateCreated,
          userImg: user.userImg,
          userBio: user.userBio,
          trips: user.trips,
          savedTrips: user.savedTrips,
        },
      });
    });

    // update user trips
    app.post("/api/userTrips", async (req, res) => {
      const { username, newTrip } = req.body;

      if (!username || !newTrip) {
        return res
          .status(400)
          .json({ message: "Username and trip data are required." });
      }

      try {
        const result = await usersCollection.updateOne(
          { username },
          { $push: { trips: newTrip } }
        );

        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .json({ message: "User not found or trip not added." });
        }

        res.status(200).json({ message: "Trip added successfully." });
      } catch (err) {
        console.error("Error adding trip:", err);
        res.status(500).json({ message: "Internal server error." });
      }
    });

    // Get user trips
    app.get("/api/userTrips/:username", async (req, res) => {
      const { username } = req.params;

      try {
        const user = await usersCollection.findOne({ username });

        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ trips: user.trips || [] });
      } catch (err) {
        console.error("Error fetching user trips:", err);
        res.status(500).json({ message: "Internal server error." });
      }
    });

    // delete user trip
    app.delete("/api/userTrips", async (req, res) => {
      const { username, tripId } = req.body;

      if (!username || !tripId) {
        return res
          .status(400)
          .json({ message: "Username and tripId are required." });
      }

      try {
        const result = await usersCollection.updateOne(
          { username },
          { $pull: { trips: { _id: tripId } } }
        );

        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .json({ message: "Trip not found or user not updated." });
        }

        res.status(200).json({ message: "Trip removed from user profile." });
      } catch (err) {
        console.error("Error deleting trip from user:", err);
        res.status(500).json({ message: "Internal server error." });
      }
    });

    // Auth middleware
    const authMiddleware = (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
      } catch {
        res.sendStatus(403);
      }
    };

    // Get current user info
    app.get("/api/me", authMiddleware, async (req, res) => {
      const user = await usersCollection.findOne({
        username: req.user.username,
      });
      if (!user) return res.sendStatus(404);
      res.json({ name: user.name, username: user.username, email: user.email });
    });

    // --- APP ROUTES ---

    app.get("/resources", async (req, res) => {
      try {
        const resources = await db.collection("resources").find({}).toArray();
        res.json(resources);
      } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).json({ error: "Failed to fetch resources" });
      }
    });

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

    app.post("/trips", async (req, res) => {
      try {
        const tripData = req.body;

        // Convert _id to ObjectId if it's a valid string
        if (tripData._id && ObjectId.isValid(tripData._id)) {
          tripData._id = new ObjectId(tripData._id);
        }

        const result = await db.collection("trips").insertOne(tripData);
        res
          .status(201)
          .json({ message: "Trip plan saved", id: result.insertedId });
      } catch (error) {
        console.error("Error saving trip plan:", error);
        res.status(500).json({ error: "Failed to save trip plan" });
      }
    });

    app.get("/trips", async (req, res) => {
      try {
        const trips = await db.collection("trips").find({}).toArray();
        res.json(trips);
      } catch (error) {
        console.error("Error fetching trips:", error);
        res.status(500).json({ error: "Failed to fetch trips" });
      }
    });

    app.delete("/trips/:id", async (req, res) => {
      const tripId = req.params.id;

      if (!ObjectId.isValid(tripId)) {
        return res.status(400).json({ message: "Invalid trip ID format." });
      }

      try {
        const result = await db
          .collection("trips")
          .deleteOne({ _id: new ObjectId(tripId) });

        if (result.deletedCount === 0) {
          return res
            .status(200)
            .json({ message: "Trip not found, nothing deleted." });
        }

        res.status(200).json({ message: "Trip deleted from main collection." });
      } catch (error) {
        console.error("Error deleting trip:", error);
        res.status(500).json({ message: "Internal server error." });
      }
    });
    const PORT = process.env.MONGODB_PORT || 3004;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
  }
}

startServer();
