const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.VITE_PORT || 3000;

app.use(cors());
app.use(express.json());

// Route imports
app.use("/api/auth", require("./routes/auth.cjs"));
app.use("/api/users", require("./routes/users.cjs"));
app.use("/api/trips", require("./routes/trips.cjs"));
app.use("/api/meal-plans", require("./routes/mealPlans.cjs"));
app.use("/api/resources", require("./routes/resources.cjs"));
app.use("/api/healthcare", require("./routes/healthcare.cjs"));
app.use("/api/trails", require("./routes/trails.cjs"));

app.listen(PORT, () => {
  console.log(`🚀 Unified API server running on http://localhost:${PORT}`);
});
