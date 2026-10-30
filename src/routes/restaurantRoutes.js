

const express = require("express");
const router = express.Router();

const {
    createRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
} = require("../controllers/restaurantController");

// POST - Create restaurant
router.post("/", createRestaurant);

// GET - All restaurants
router.get("/", getRestaurants);

// GET - Restaurant by ID
router.get("/:id", getRestaurantById);

// PATCH - Update restaurant
router.patch("/:id", updateRestaurant);

// DELETE - Delete restaurant
router.delete("/:id", deleteRestaurant);

module.exports = router;
