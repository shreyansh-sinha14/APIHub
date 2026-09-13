import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function PublishAPI() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        baseUrl: "",
        authenticationType: "None",
        tags: "",
        visibility: "public"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const response = await api.post(
                "/apis",
                {
                    name: formData.name,
                    description: formData.description,
                    baseUrl: formData.baseUrl,
                    authenticationType: formData.authenticationType,
                    tags: formData.tags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag !== ""),
                    visibility: formData.visibility
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("API published successfully!");

            navigate("/marketplace");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to publish API"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">

                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Publish API
                </h1>

                <p className="text-gray-500 mb-8">
                    Share your API with other developers.
                </p>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-5">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* API Name */}
                    <div>
                        <label className="block font-medium mb-2">
                            API Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Weather API"
                            required
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-medium mb-2">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what your API does..."
                            required
                            rows="4"
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Base URL */}
                    <div>
                        <label className="block font-medium mb-2">
                            Base URL
                        </label>

                        <input
                            type="url"
                            name="baseUrl"
                            value={formData.baseUrl}
                            onChange={handleChange}
                            placeholder="https://api.example.com"
                            required
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Authentication */}
                    <div>
                        <label className="block font-medium mb-2">
                            Authentication Type
                        </label>

                        <select
                            name="authenticationType"
                            value={formData.authenticationType}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2"
                        >
                            <option value="None">None</option>
                            <option value="API Key">API Key</option>
                            <option value="Bearer Token">
                                Bearer Token
                            </option>
                        </select>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block font-medium mb-2">
                            Tags
                        </label>

                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="weather, api, forecast"
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <p className="text-sm text-gray-500 mt-1">
                            Separate tags using commas.
                        </p>
                    </div>

                    {/* Visibility */}
                    <div>
                        <label className="block font-medium mb-2">
                            Visibility
                        </label>

                        <select
                            name="visibility"
                            value={formData.visibility}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2"
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Publishing..." : "Publish API"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default PublishAPI;