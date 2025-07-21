const express = require("express");
const router = express.Router();
const { getUsersCollection } = require("../services/mongoClient.cjs");

// Add trip
router.post("/:username/trips/add", async (req, res) => {
  const usersCollection = await getUsersCollection();
  const { username } = req.params;
  const { newTrip } = req.body;

  const result = await usersCollection.updateOne(
    { username },
    { $push: { trips: newTrip } }
  );
  if (result.modifiedCount === 0)
    return res
      .status(404)
      .json({ message: "User not found or trip not added." });

  res.status(200).json({ message: "Trip added successfully." });
});

// Get trips
router.get("/:username/trips", async (req, res) => {
  const usersCollection = await getUsersCollection();
  const { username } = req.params;

  const user = await usersCollection.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found." });

  res.status(200).json({ trips: user.trips || [] });
});

// Delete trip
router.delete("/:username/trips/delete", async (req, res) => {
  const usersCollection = await getUsersCollection();
  const { username, tripId } = req.body;

  const result = await usersCollection.updateOne(
    { username },
    { $pull: { trips: { _id: tripId } } }
  );
  if (result.modifiedCount === 0)
    return res
      .status(404)
      .json({ message: "Trip not found or user not updated." });

  res.status(200).json({ message: "Trip removed from user profile." });
});

module.exports = router;
