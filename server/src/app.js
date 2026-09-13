const express = require("express");
const cors = require("cors");
const protect = require("./middleware/authMiddleware");
const apiRoutes = require("./routes/apiRoutes");
const authRoutes = require("./routes/authRoutes");
const collectionRoutes = require("./routes/collectionRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/apis", apiRoutes);
app.use("/api/collections", collectionRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "APIHub server is running"
    });
});

app.get("/api/protected", protect, (req, res) => {
    res.json({
        message: "You are authorized",
        user: req.user
    });
});
module.exports = app;