const pool = require("../config/db");

const getWarehouses = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM warehouses");

        res.json(rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get warehouses"
        });
    }
};

module.exports = {
    getWarehouses
};