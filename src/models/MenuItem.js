

const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        address: {
            type: String
        },
        price: {
            type: Number,
            required: true
        },
        cuisine: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
        },
        delveryTime: {
            type: Number,
            required: true
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
