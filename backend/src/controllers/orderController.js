const pool = require("../config/db");

const getOrders = async (req, res) => {
    try {
      const [rows] = await pool.query(
    "SELECT orders.id, users.name AS user_name, warehouses.name AS warehouse_name, orders.product_name, orders.quantity, orders.destination, orders.status, orders.created_at FROM orders JOIN users ON orders.user_id = users.id LEFT JOIN warehouses ON orders.warehouse_id = warehouses.id"
);

        res.json(rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get orders"
        });
    }
};

const createOrder = async (req, res) => {
    const connection = await pool.getConnection();

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

        await connection.beginTransaction();

        const [inventoryRows] = await connection.query(
            `SELECT
                inventory.warehouse_id,
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
             LIMIT 1`,
            [product_name, quantity, destination]
        );

        if (inventoryRows.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "No warehouse has enough inventory"
            });
        }

        const warehouse_id = inventoryRows[0].warehouse_id;

        const [result] = await connection.query(
            "INSERT INTO orders (user_id, warehouse_id, product_name, quantity, destination) VALUES (?, ?, ?, ?, ?)",
            [user_id, warehouse_id, product_name, quantity, destination]
        );

        await connection.query(
            "UPDATE inventory SET quantity = quantity - ? WHERE product_name = ? AND warehouse_id = ?",
            [quantity, product_name, warehouse_id]
        );

        await connection.commit();

        res.status(201).json({
            message: "Order created successfully",
            order_id: result.insertId,
            warehouse_id: warehouse_id
        });
    } catch (error) {
        await connection.rollback();

        console.error(error);

        res.status(500).json({
            message: "Failed to create order"
        });
    } finally {
        connection.release();
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