
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const warehouseRoutes = require("./routes/warehouseRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/warehouses", warehouseRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Logistics Optimizer API is running" });
});

app.get("/db-test", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1 AS result");

        res.json({
            message: "Database connected successfully",
            result: rows[0].result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});``