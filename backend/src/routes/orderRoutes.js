const authenticateToken = require("../middleware/authMiddleware");
const express = require("express");

const router = express.Router();

const {
    getOrders,
    createOrder,
    updateOrderStatus
} = require("../controllers/orderController");

router.get("/", authenticateToken, getOrders);

router.post("/", authenticateToken, createOrder);

router.patch("/:id/status", authenticateToken, updateOrderStatus);

module.exports = router;
