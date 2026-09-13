const express = require("express");
const {
    createAPI,
    getAPIs,
    getMyAPIs,
    getAPIById,
    updateAPI,
    deleteAPI,
    tryAPI
} = require("../controllers/apiController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Publish an API - login required
router.post("/", protect, createAPI);
router.get("/", getAPIs);
router.get("/mine", protect, getMyAPIs);
router.get("/:id", getAPIById);
router.post("/:id/try", protect, tryAPI);
router.put("/:id", protect, updateAPI);

router.delete("/:id", protect, deleteAPI);
module.exports = router;