const pool = require("../config/db");

const getInventory = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                inventory.id,
                inventory.product_name,
                inventory.quantity,
                warehouses.name AS warehouse_name,
                warehouses.location
            FROM inventory
            JOIN warehouses
                ON inventory.warehouse_id = warehouses.id
        `);

        res.json(rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get inventory"
        });
    }
};

const getInventoryByWarehouse = async (req, res) => {
    try {
        const { warehouse_id } = req.params;

        const [rows] = await pool.query(`
            SELECT
                inventory.id,
                inventory.product_name,
                inventory.quantity,
                warehouses.name AS warehouse_name,
                warehouses.location
            FROM inventory
            JOIN warehouses
                ON inventory.warehouse_id = warehouses.id
            WHERE inventory.warehouse_id = ?
        `, [warehouse_id]);

        res.json(rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get warehouse inventory"
        });
    }
};

const getInventoryByProduct = async (req, res) => {
    try {
        const { product_name } = req.params;

        const [rows] = await pool.query(`
            SELECT
                inventory.id,
                inventory.product_name,
                inventory.quantity,
                warehouses.id AS warehouse_id,
                warehouses.name AS warehouse_name,
                warehouses.location
            FROM inventory
            JOIN warehouses
                ON inventory.warehouse_id = warehouses.id
            WHERE inventory.product_name = ?
        `, [product_name]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Product not found in inventory"
            });
        }

        res.json(rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get product inventory"
        });
    }
};

const selectWarehouse = async (req, res) => {
    try {
        const { product_name, quantity } = req.params;
        const { destination } = req.query;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0"
            });
        }

        const [rows] = await pool.query(`
            SELECT
                inventory.warehouse_id,
                warehouses.name AS warehouse_name,
                warehouses.location,
                inventory.product_name,
                inventory.quantity
            FROM inventory
            JOIN warehouses
                ON inventory.warehouse_id = warehouses.id
            WHERE inventory.product_name = ?
            AND inventory.quantity >= ?
            ORDER BY
                CASE
                    WHEN warehouses.location = ? THEN 0
                    ELSE 1
                END,
                inventory.quantity DESC
        `, [product_name, quantity, destination || ""]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "No warehouse has enough inventory"
            });
        }

        res.json({
            message: "Warehouse selected successfully",
            warehouse: rows[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to select warehouse"
        });
    }
};

module.exports = {
    getInventory,
    getInventoryByWarehouse,
    getInventoryByProduct,
    selectWarehouse
};