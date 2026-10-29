
const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true
    },
    cuisine: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Restaurant",
  restaurantSchema
);