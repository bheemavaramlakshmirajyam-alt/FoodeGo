

const express = require("express");
const router = express.Router();

const menuItemController = require("../controllers/menuItemController");

// POST - Create menu item
router.post("/", menuItemController.createMenuItem);

// GET - Get all menu items
router.get("/", menuItemController.getMenuItems);

// GET - Get menu item by ID
router.get("/:id", menuItemController.getMenuItemById);

// PATCH - Update menu item
router.patch("/:id", menuItemController.updateMenuItem);

// DELETE - Delete menu item
router.delete("/:id", menuItemController.deleteMenuItem);

module.exports = router;
