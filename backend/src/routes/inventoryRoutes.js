const express = require("express");

const router = express.Router();

const {
    getInventory,
    getInventoryByWarehouse,
    getInventoryByProduct
} = require("../controllers/inventoryController");

router.get("/", getInventory);

router.get("/warehouse/:warehouse_id", getInventoryByWarehouse);

router.get("/product/:product_name", getInventoryByProduct);

module.exports = router;