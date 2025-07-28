const express = require("express");
const router = express.Router();
const { getDb } = require("../services/mongoClient.cjs");
const { ObjectId } = require("mongodb");

// Get all resources
router.get("/", async (req, res) => {
  const db = await getDb();
  try {
    const resources = await db.collection("resources").find({}).toArray();
    res.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

// Get a single resource by ID
// Get a single resource by ID
router.get("/:id", async (req, res) => {
  const db = await getDb();
  const resourceId = req.params.id;

  let objectId;
  try {
    objectId = new ObjectId(resourceId); // Convert string to ObjectId
  } catch (e) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const resource = await db
      .collection("resources")
      .findOne({ _id: objectId });

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.json(resource);
  } catch (error) {
    console.error("Error fetching resource:", error);
    res.status(500).json({ error: "Failed to fetch resource" });
  }
});

router.post("/", async (req, res) => {
  const db = await getDb();
  const newResource = req.body;

  try {
    const result = await db.collection("resources").insertOne(newResource);

    const blogWithId = {
      ...newResource,
      _id: result.insertedId,
      directTo: `/#/blog/${result.insertedId}`, // Set the directTo
    };

    await db
      .collection("resources")
      .updateOne(
        { _id: result.insertedId },
        { $set: { directTo: blogWithId.directTo } }
      );

    // Return full updated document
    res.status(201).json(blogWithId);
  } catch (error) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: "Failed to create resource" });
  }
});

module.exports = router;
