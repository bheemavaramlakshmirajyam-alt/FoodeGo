

const mongoose = require("mongoose");
const Food = require("../controllers/foodController");

// BUSINESS LOGIC: Add Food
const addFood = async (req, res) => {
    try {
        const { name, price, category } = req.body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof category !== "string" ||
            !category.trim() ||
            price === undefined ||
            price === null ||
            price === "" ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0
        ) {
            return res.status(400).json({
                message: "Valid name, category and non-negative price are required"
            });
        }

        const food = await Food.create({
            ...req.body,
            name: name.trim(),
            category: category.trim(),
            price: Number(price)
        });

        return res.status(201).json({
            message: "Food added successfully",
            food
        });
    } catch (error) {
        console.error("Add food error:", error.message);
        return res.status(500).json({
            message: "Failed to add food"
        });
    }
};

// BUSINESS LOGIC: Get All Foods
const getAllFoods = async (req, res) => {
    try {
        const foods = await Food.find();

        return res.status(200).json({
            count: foods.length,
            foods
        });
    } catch (error) {
        console.error("Get foods error:", error.message);
        return res.status(500).json({
            message: "Failed to fetch foods"
        });
    }
};

// BUSINESS LOGIC: Get Single Food
const getFoodById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid food ID"
            });
        }

        const food = await Food.findById(id);

        if (!food) {
            return res.status(404).json({
                message: "Food not found"
            });
        }

        return res.status(200).json({ food });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch food"
        });
    }
};

// BUSINESS LOGIC: Update Food
const updateFood = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid food ID"
            });
        }

        const allowedFields = [
            "name",
            "price",
            "category",
            "description",
            "image"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "Provide at least one valid field to update"
            });
        }

        if (
            updates.name !== undefined &&
            (typeof updates.name !== "string" ||
                !updates.name.trim())
        ) {
            return res.status(400).json({
                message: "Food name cannot be empty"
            });
        }

        if (
            updates.category !== undefined &&
            (typeof updates.category !== "string" ||
                !updates.category.trim())
        ) {
            return res.status(400).json({
                message: "Category cannot be empty"
            });
        }

        if (updates.name !== undefined) {
            updates.name = updates.name.trim();
        }

        if (updates.category !== undefined) {
            updates.category = updates.category.trim();
        }

        if (updates.price !== undefined) {
            if (
                updates.price === null ||
                updates.price === "" ||
                !Number.isFinite(Number(updates.price)) ||
                Number(updates.price) < 0
            ) {
                return res.status(400).json({
                    message: "Price must be a non-negative number"
                });
            }

            updates.price = Number(updates.price);
        }

        const food = await Food.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!food) {
            return res.status(404).json({
                message: "Food not found"
            });
        }

        return res.status(200).json({
            message: "Food updated successfully",
            food
        });
    } catch (error) {
        console.error("Update food error:", error.message);
        return res.status(400).json({
            message: "Failed to update food"
        });
    }
};

// BUSINESS LOGIC: Delete Food
const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid food ID"
            });
        }

        const food = await Food.findByIdAndDelete(id);

        if (!food) {
            return res.status(404).json({
                message: "Food not found"
            });
        }

        return res.status(200).json({
            message: "Food deleted successfully"
        });
    } catch (error) {
        console.error("Delete food error:", error.message);
        return res.status(500).json({
            message: "Failed to delete food"
        });
    }
};

module.exports = {
    addFood,
    getAllFoods,
    getFoodById,
    updateFood,
    deleteFood
};
