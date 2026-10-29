

const express = require("express");
const Food = require("../models/Food");

const router = express.Router();

// GET ALL FOOD ITEMS
router.get("/", async (req, res) => {
    try {
        const foods = await Food.find();
        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching food items",
            error: error.message
        });
    }
});

// GET FOOD ITEM BY ID
router.get("/:id", async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);

        if (!food) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        res.status(200).json(food);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching food item",
            error: error.message
        });
    }
});

// ADD NEW FOOD ITEM
router.post("/", async (req, res) => {
    try {
        const food = new Food(req.body);
        const savedFood = await food.save();

        res.status(201).json({
            message: "Food item added successfully",
            food: savedFood
        });
    } catch (error) {
        res.status(400).json({
            message: "Error adding food item",
            error: error.message
        });
    }
});

// UPDATE FOOD ITEM
router.put("/:id", async (req, res) => {
    try {
        const updatedFood = await Food.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedFood) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        res.status(200).json({
            message: "Food item updated successfully",
            food: updatedFood
        });
    } catch (error) {
        res.status(400).json({
            message: "Error updating food item",
            error: error.message
        });
    }
});

// DELETE FOOD ITEM
router.delete("/:id", async (req, res) => {
    try {
        const deletedFood = await Food.findByIdAndDelete(
            req.params.id
        );

        if (!deletedFood) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        res.status(200).json({
            message: "Food item deleted successfully",
            food: deletedFood
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting food item",
            error: error.message
        });
    }
});

module.exports = router;
