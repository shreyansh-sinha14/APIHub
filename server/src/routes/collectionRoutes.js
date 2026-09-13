const express = require("express");

const {
    createCollection,
    getMyCollections,
    addAPIToCollection,
    removeAPIFromCollection,
    deleteCollection
} = require("../controllers/collectionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createCollection);

router.get("/", protect, getMyCollections);

router.post("/:collectionId/apis", protect, addAPIToCollection);

router.delete(
    "/:collectionId/apis/:apiId",
    protect,
    removeAPIFromCollection
);

router.delete("/:id", protect, deleteCollection);

module.exports = router;