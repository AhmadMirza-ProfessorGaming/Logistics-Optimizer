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

module.exports = {
    getInventory
};