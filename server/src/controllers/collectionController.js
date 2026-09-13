const Collection = require("../models/Collection");
const API = require("../models/API");

// Create a collection
const createCollection = async (req, res) => {
    try {
        const { name, description, visibility } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Collection name is required"
            });
        }

        const collection = await Collection.create({
            name,
            description,
            visibility,
            ownerId: req.user.userId
        });

        res.status(201).json({
            message: "Collection created successfully",
            collection
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Get my collections
const getMyCollections = async (req, res) => {
    try {
        const collections = await Collection.find({
            ownerId: req.user.userId
        }).populate("apiIds");

        res.status(200).json({
            collections
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Add API to collection
const addAPIToCollection = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const { apiId } = req.body;

        const collection = await Collection.findById(collectionId);

        if (!collection) {
            return res.status(404).json({
                message: "Collection not found"
            });
        }

        if (collection.ownerId.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to modify this collection"
            });
        }

        const api = await API.findById(apiId);

        if (!api) {
            return res.status(404).json({
                message: "API not found"
            });
        }

        if (collection.apiIds.some(id => id.toString() === apiId)) {
            return res.status(400).json({
                message: "API already exists in this collection"
            });
        }

        collection.apiIds.push(api._id);

        await collection.save();

        res.status(200).json({
            message: "API added to collection",
            collection
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Remove API from collection
const removeAPIFromCollection = async (req, res) => {
    try {
        const { collectionId, apiId } = req.params;

        const collection = await Collection.findById(collectionId);

        if (!collection) {
            return res.status(404).json({
                message: "Collection not found"
            });
        }

        if (collection.ownerId.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to modify this collection"
            });
        }

        collection.apiIds = collection.apiIds.filter(
            id => id.toString() !== apiId
        );

        await collection.save();

        res.status(200).json({
            message: "API removed from collection",
            collection
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Delete collection
const deleteCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            return res.status(404).json({
                message: "Collection not found"
            });
        }

        if (collection.ownerId.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to delete this collection"
            });
        }

        await Collection.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Collection deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createCollection,
    getMyCollections,
    addAPIToCollection,
    removeAPIFromCollection,
    deleteCollection
};