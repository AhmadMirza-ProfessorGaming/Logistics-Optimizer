const pool = require("../config/db");

const getOrders = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                orders.id,
                users.name AS user_name,
                orders.product_name,
                orders.quantity,
                orders.destination,
                orders.status,
                orders.created_at
            FROM orders
            JOIN users
                ON orders.user_id = users.id
        `);

        res.json(rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get orders"
        });
    }
};

module.exports = {
    getOrders
};