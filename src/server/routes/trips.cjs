const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { getDb } = require("../services/mongoClient.cjs");

// Save trip
router.post("/save", async (req, res) => {
  const db = await getDb();
  const tripData = req.body;

  if (tripData._id && ObjectId.isValid(tripData._id)) {
    tripData._id = new ObjectId(tripData._id);
  }

  const result = await db.collection("trips").insertOne(tripData);
  res.status(201).json({ message: "Trip plan saved", id: result.insertedId });
});

// Get trips
router.get("/", async (req, res) => {
  const db = await getDb();
  const trips = await db.collection("trips").find({}).toArray();
  res.json(trips);
});

// Get trip by ID
router.get("/:id", async (req, res) => {
  const db = await getDb();
  const tripId = req.params.id;

  if (!ObjectId.isValid(tripId)) {
    return res.status(400).json({ message: "Invalid trip ID format." });
  }

  const trip = await db
    .collection("trips")
    .findOne({ _id: new ObjectId(tripId) });
  if (!trip) {
    return res.status(404).json({ message: "Trip not found." });
  }

  res.json(trip);
});

// Delete trip
router.delete("/:id/delete", async (req, res) => {
  const db = await getDb();
  const tripId = req.params.id;

  if (!ObjectId.isValid(tripId))
    return res.status(400).json({ message: "Invalid trip ID format." });

  const result = await db
    .collection("trips")
    .deleteOne({ _id: new ObjectId(tripId) });
  if (result.deletedCount === 0)
    return res
      .status(200)
      .json({ message: "Trip not found, nothing deleted." });

  res.status(200).json({ message: "Trip deleted from main collection." });
});

module.exports = router;
