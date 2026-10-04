const express = require("express");

const router = express.Router();

const {
    getInventory,
    getInventoryByWarehouse
} = require("../controllers/inventoryController");

router.get("/", getInventory);

router.get("/warehouse/:warehouse_id", getInventoryByWarehouse);

module.exports = router;