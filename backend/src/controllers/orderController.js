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

const createOrder = async (req, res) => {
    try {
        const {
            user_id,
            product_name,
            quantity,
            destination
        } = req.body;
                if (!user_id || !product_name || !quantity || !destination) {
            return res.status(400).json({
                message: "All order fields are required"
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO orders
            (user_id, product_name, quantity, destination)
            VALUES (?, ?, ?, ?)`,
            [user_id, product_name, quantity, destination]
        );

        res.status(201).json({
            message: "Order created successfully",
            order_id: result.insertId
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create order"
        });
    }
};

module.exports = {
    getOrders,
       createOrder
};