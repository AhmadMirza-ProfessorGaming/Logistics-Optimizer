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

const [inventoryRows] = await pool.query(
    `SELECT quantity
     FROM inventory
     WHERE product_name = ?
     LIMIT 1`,
    [product_name]
);

if (inventoryRows.length === 0) {
    return res.status(404).json({
        message: "Product not found in inventory"
    });
}

if (inventoryRows[0].quantity < quantity) {
    return res.status(400).json({
        message: "Not enough inventory"
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
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                message: "Status is required"
            });
        }

        const [result] = await pool.query(
            "UPDATE orders SET status = ? WHERE id = ?",
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order status updated successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update order status"
        });
    }
};

module.exports = {
    getOrders,
    createOrder,
    updateOrderStatus
};