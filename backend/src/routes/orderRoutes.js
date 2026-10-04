const authenticateToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");
const express = require("express");

const router = express.Router();

const {
    getOrders,
    createOrder,
    updateOrderStatus
} = require("../controllers/orderController");

router.get("/", authenticateToken, getOrders);

router.post("/", authenticateToken, createOrder);

router.patch(
    "/:id/status",
    authenticateToken,
    authorizeRole("admin"),
    updateOrderStatus
);

module.exports = router;
