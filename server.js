

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const foodRoutes = require("./src/routes/foodRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const restaurantRoutes = require("./src/routes/restaurantRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Home route

app.get("/", (req, res) => {
    res.status(200).send("FoodieGo API is working!");
});
    

// Register routes only once
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/restaurants", restaurantRoutes);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
        path: req.originalUrl,
        method: req.method
    });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`FoodieGo Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error.message);
    });
