const API = require("../models/API");

const createAPI = async (req, res) => {
    try {
        const {
            name,
            description,
            categoryId,
            tags,
            baseUrl,
            authenticationType,
            versions,
            visibility
        } = req.body;

        // Check required fields
        if (!name || !description || !baseUrl) {
            return res.status(400).json({
                message: "Please provide name, description and baseUrl"
            });
        }

        // Create API
        const api = await API.create({
            name,
            description,
            ownerId: req.user.userId,
            categoryId,
            tags,
            baseUrl,
            authenticationType,
            versions,
            visibility
        });

        res.status(201).json({
            message: "API published successfully",
            api
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getAPIs = async (req, res) => {
    try {
        const {
            search,
            category,
            page = 1,
            limit = 10,
            sort = "newest"
        } = req.query;

        const query = {
            visibility: "public"
        };

        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // Filter by category
        if (category) {
            query.categoryId = category;
        }

        // Sorting
        let sortOption = { createdAt: -1 };

        if (sort === "rating") {
            sortOption = { averageRating: -1 };
        }

        if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        }

        const skip = (page - 1) * limit;

        const apis = await API.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        const total = await API.countDocuments(query);

        res.status(200).json({
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
            apis
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getAPIById = async (req, res) => {
    try {
        const api = await API.findOne({
            _id: req.params.id,
            visibility: "public"
        });

        if (!api) {
            return res.status(404).json({
                message: "API not found"
            });
        }

        res.status(200).json({
            api
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const updateAPI = async (req, res) => {
    try {
        const api = await API.findById(req.params.id);

        if (!api) {
            return res.status(404).json({
                message: "API not found"
            });
        }

        // Check ownership
        if (api.ownerId.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to update this API"
            });
        }

        const {
            name,
            description,
            tags,
            baseUrl,
            authenticationType,
            visibility
        } = req.body;

        // Update only allowed fields
        if (name !== undefined) api.name = name;
        if (description !== undefined) api.description = description;
        if (tags !== undefined) api.tags = tags;
        if (baseUrl !== undefined) api.baseUrl = baseUrl;
        if (authenticationType !== undefined) {
            api.authenticationType = authenticationType;
        }
        if (visibility !== undefined) {
            api.visibility = visibility;
        }

        const updatedAPI = await api.save();

        res.status(200).json({
            message: "API updated successfully",
            api: updatedAPI
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update API",
            error: error.message
        });
    }
};

const deleteAPI = async (req, res) => {
    try {
        const api = await API.findById(req.params.id);

        if (!api) {
            return res.status(404).json({
                message: "API not found"
            });
        }

        // Check ownership
        if (api.ownerId.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to delete this API"
            });
        }

        await api.deleteOne();

        res.status(200).json({
            message: "API deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete API",
            error: error.message
        });
    }
};

const tryAPI = async (req, res) => {
    try {
        const api = await API.findById(req.params.id);

        if (!api) {
            return res.status(404).json({
                message: "API not found"
            });
        }

        const {
            method = "GET",
            url = api.baseUrl,
            headers = {},
            body
        } = req.body || {};

        const requestMethod = method.toUpperCase();

        const allowedMethods = [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE"
        ];

        if (!allowedMethods.includes(requestMethod)) {
            return res.status(400).json({
                message: "Invalid HTTP method"
            });
        }

        // Only allow requests to the API's stored domain
        const baseURL = new URL(api.baseUrl);
        const targetURL = new URL(url);

        if (baseURL.origin !== targetURL.origin) {
            return res.status(400).json({
                message: "URL must belong to the selected API"
            });
        }

        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, 10000);

        const options = {
            method: requestMethod,
            headers: headers,
            signal: controller.signal
        };

        if (
            requestMethod !== "GET" &&
            requestMethod !== "DELETE" &&
            body !== undefined
        ) {
            options.headers = {
                "Content-Type": "application/json",
                ...headers
            };

            options.body = JSON.stringify(body);
        }

        const startTime = Date.now();

        const response = await fetch(targetURL.toString(), options);

        const responseTime = Date.now() - startTime;

        clearTimeout(timeout);

        const contentType =
            response.headers.get("content-type") || "";

        let data;

        if (contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        res.status(200).json({
            status: response.status,
            statusText: response.statusText,
            responseTime: `${responseTime}ms`,
            data
        });

    } catch (error) {
        if (error.name === "AbortError") {
            return res.status(408).json({
                message: "Request timed out"
            });
        }

        res.status(500).json({
            message: "Failed to execute API request",
            error: error.message
        });
    }
};

const getMyAPIs = async (req, res) => {
    try {
        const apis = await API.find({
            ownerId: req.user.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            count: apis.length,
            apis
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch your APIs",
            error: error.message
        });
    }
};

module.exports = {
    createAPI,
    getAPIs,
    getMyAPIs,
    getAPIById,
    updateAPI,
    deleteAPI,
    tryAPI
};