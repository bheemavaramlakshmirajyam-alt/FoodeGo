

const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");

const router = express.Router();

// CREATE NEW ORDER
router.post("/", async (req, res) => {
    try {
        const {
            user,
            items,
            deliveryAddress,
            phone,
            paymentMethod
        } = req.body;

        if (
            !user ||
            !mongoose.isValidObjectId(user) ||
            !Array.isArray(items) ||
            items.length === 0 ||
            !deliveryAddress ||
            !phone
        ) {
            return res.status(400).json({
                message: "Valid user, items, delivery address, and phone are required"
            });
        }

        for (const item of items) {
            if (
                !item.food ||
                !mongoose.isValidObjectId(item.food) ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1
            ) {
                return res.status(400).json({
                    message: "Each item needs a valid food ID and positive quantity"
                });
            }
        }

        const normalizedPaymentMethod = paymentMethod || "COD";

        if (!["COD", "Online"].includes(normalizedPaymentMethod)) {
            return res.status(400).json({
                message: "Payment method must be COD or Online"
            });
        }

        // Load food prices from the database instead of trusting client prices.
        const Food = require("../models/Food");
        const foodIds = [...new Set(items.map(item => item.food))];

        const foods = await Food.find({
            _id: { $in: foodIds }
        });

        const foodMap = new Map(
            foods.map(food => [food._id.toString(), food])
        );

        const orderItems = [];
        let totalAmount = 0;

        for (const item of items) {
            const food = foodMap.get(item.food.toString());

            if (!food) {
                return res.status(404).json({
                    message: `Food item not found: ${item.food}`
                });
            }

            if (food.available === false) {
                return res.status(400).json({
                    message: `${food.name} is currently unavailable`
                });
            }

            const price = food.price;

            orderItems.push({
                food: food._id,
                quantity: item.quantity,
                price
            });

            totalAmount += price * item.quantity;
        }

        const order = new Order({
            user,
            items: orderItems,
            totalAmount,
            deliveryAddress,
            phone,
            paymentMethod: normalizedPaymentMethod
        });

        const savedOrder = await order.save();

        res.status(201).json({
            message: "Order created successfully",
            order: savedOrder
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating order",
            error: error.message
        });
    }
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.food", "name price");

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching orders",
            error: error.message
        });
    }
});

// GET ORDER BY ID
router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("items.food", "name price");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching order",
            error: error.message
        });
    }
});

// UPDATE ORDER STATUS
router.patch("/:id/status", async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Preparing",
            "Out for Delivery",
            "Delivered",
            "Cancelled"
        ];

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating order status",
            error: error.message
        });
    }
});

// DELETE ORDER
router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order deleted successfully",
            order
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting order",
            error: error.message
        });
    }
});

module.exports = router;
