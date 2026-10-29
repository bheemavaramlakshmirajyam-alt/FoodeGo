


const Order = require("../models/Order");
const Food = require("../models/Food");

// =====================================
// 1. CREATE A NEW ORDER
// =====================================
exports.createOrder = async (req, res) => {
  try {
    const { userId, items, deliveryAddress } = req.body;

    // Validate request data
    if (
      !userId ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !deliveryAddress
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide userId, items, and deliveryAddress",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Validate food items and calculate total
    for (const item of items) {
      const quantity = Number(item.quantity);

      if (
        !item.food ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Each item must contain a valid food ID and quantity",
        });
      }

      const food = await Food.findById(item.food);

      if (!food) {
        return res.status(404).json({
          success: false,
          message: "Food item not found: " + item.food,
        });
      }

      const price = Number(food.price);

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid food price",
        });
      }

      totalAmount += price * quantity;

      orderItems.push({
        food: food._id,
        quantity: quantity,
      });
    }

    // Create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount: totalAmount,
      deliveryAddress: deliveryAddress,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.food");

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================
// 2. GET ALL ORDERS
// =====================================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.food")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================
// 3. GET ORDER BY ID
// =====================================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.food");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order: order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================
// 4. UPDATE ORDER STATUS
// =====================================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid order status",
        allowedStatuses: allowedStatuses,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: status },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("user", "name email")
      .populate("items.food");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================
// 5. DELETE ORDER
// =====================================
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete Order Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
