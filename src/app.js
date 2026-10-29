
const express = require("express");
const restaurantRoutes = require("./routes/restaurantRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to FoodieGo API" });
});

// Register restaurant routes BEFORE the 404 handler
app.use("/api/restaurants", restaurantRoutes);

// Keep the 404 handler AFTER all valid routes
app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
    path: req.originalUrl,
    method: req.method
  });
});

module.exports = app;