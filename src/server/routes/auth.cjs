const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { getUsersCollection } = require("../services/mongoClient.cjs");

// Signup
router.post("/signup", async (req, res) => {
  const usersCollection = await getUsersCollection();
  const fullUser = req.body;

  const existing = await usersCollection.findOne({
    username: fullUser.username,
  });
  if (existing)
    return res.status(400).json({ message: "Username already exists" });

  fullUser.password = await bcrypt.hash(fullUser.password, 10);
  fullUser.dateCreated = new Date().toISOString();

  await usersCollection.insertOne(fullUser);

  const token = jwt.sign(
    { username: fullUser.username, email: fullUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(201).json({
    token,
    userData: { ...fullUser, password: undefined },
  });
});

// Login
router.post("/login", async (req, res) => {
  const usersCollection = await getUsersCollection();
  const { username, password } = req.body;

  const user = await usersCollection.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

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

// Get current user info
router.get("/me", async (req, res) => {
  const usersCollection = await getUsersCollection();
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await usersCollection.findOne({ username: decoded.username });
    if (!user) return res.sendStatus(404);
    res.json({ name: user.name, username: user.username, email: user.email });
  } catch {
    res.sendStatus(403);
  }
});

module.exports = router;
