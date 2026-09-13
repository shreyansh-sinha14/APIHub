import { useEffect, useState } from "react";
import api from "../services/api";

function Collections() {
    const [collections, setCollections] = useState([]);
    const [apis, setApis] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState("private");

    const [selectedCollection, setSelectedCollection] = useState("");
    const [selectedAPI, setSelectedAPI] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    // Fetch collections and APIs
    const fetchData = async () => {
        try {
            setLoading(true);

            const [collectionsResponse, apisResponse] = await Promise.all([
                api.get("/collections", authConfig),
                api.get("/apis")
            ]);

            setCollections(
                collectionsResponse.data.collections ||
                collectionsResponse.data
            );

            setApis(
                apisResponse.data.apis ||
                apisResponse.data
            );

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load collections"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Create collection
    const handleCreateCollection = async (e) => {
        e.preventDefault();

        try {
            setError("");

            await api.post(
                "/collections",
                {
                    name,
                    description,
                    visibility
                },
                authConfig
            );

            setName("");
            setDescription("");
            setVisibility("private");

            fetchData();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create collection"
            );
        }
    };

    // Add API
    const handleAddAPI = async () => {
        if (!selectedCollection || !selectedAPI) {
            setError("Please select a collection and an API");
            return;
        }

        try {
            setError("");

            await api.post(
                `/collections/${selectedCollection}/apis`,
                {
                    apiId: selectedAPI
                },
                authConfig
            );

            setSelectedAPI("");

            fetchData();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to add API"
            );
        }
    };

    // Remove API
    const handleRemoveAPI = async (collectionId, apiId) => {
        try {
            await api.delete(
                `/collections/${collectionId}/apis/${apiId}`,
                authConfig
            );

            fetchData();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to remove API"
            );
        }
    };

    // Delete collection
    const handleDeleteCollection = async (collectionId) => {
        if (!window.confirm("Delete this collection?")) {
            return;
        }

        try {
            await api.delete(
                `/collections/${collectionId}`,
                authConfig
            );

            fetchData();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete collection"
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Loading collections...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    My Collections
                </h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Create Collection */}
                <div className="bg-white rounded-xl shadow p-6 mb-8">

                    <h2 className="text-xl font-semibold mb-4">
                        Create Collection
                    </h2>

                    <form
                        onSubmit={handleCreateCollection}
                        className="space-y-4"
                    >

                        <input
                            type="text"
                            placeholder="Collection name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full border rounded-lg px-4 py-2"
                        />

                        <textarea
                            placeholder="Collection description"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            rows="3"
                            className="w-full border rounded-lg px-4 py-2"
                        />

                        <select
                            value={visibility}
                            onChange={(e) =>
                                setVisibility(e.target.value)
                            }
                            className="w-full border rounded-lg px-4 py-2"
                        >
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                        </select>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Create Collection
                        </button>

                    </form>
                </div>

                {/* Add API */}
                <div className="bg-white rounded-xl shadow p-6 mb-8">

                    <h2 className="text-xl font-semibold mb-4">
                        Add API to Collection
                    </h2>

                    <div className="flex flex-col md:flex-row gap-4">

                        <select
                            value={selectedCollection}
                            onChange={(e) =>
                                setSelectedCollection(e.target.value)
                            }
                            className="flex-1 border rounded-lg px-4 py-2"
                        >
                            <option value="">
                                Select Collection
                            </option>

                            {collections.map((collection) => (
                                <option
                                    key={collection._id}
                                    value={collection._id}
                                >
                                    {collection.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedAPI}
                            onChange={(e) =>
                                setSelectedAPI(e.target.value)
                            }
                            className="flex-1 border rounded-lg px-4 py-2"
                        >
                            <option value="">
                                Select API
                            </option>

                            {apis.map((apiItem) => (
                                <option
                                    key={apiItem._id}
                                    value={apiItem._id}
                                >
                                    {apiItem.name}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleAddAPI}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                        >
                            Add API
                        </button>

                    </div>
                </div>

                {/* Collections */}
                <div className="grid gap-6">

                    {collections.length === 0 ? (
                        <div className="bg-white rounded-xl shadow p-8 text-center">
                            <p className="text-gray-500">
                                You don't have any collections yet.
                            </p>
                        </div>
                    ) : (
                        collections.map((collection) => (

                            <div
                                key={collection._id}
                                className="bg-white rounded-xl shadow p-6"
                            >

                                <div className="flex justify-between items-start mb-4">

                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {collection.name}
                                        </h2>

                                        <p className="text-gray-500 mt-1">
                                            {collection.description ||
                                                "No description"}
                                        </p>

                                        <span className="inline-block mt-2 text-sm bg-gray-100 px-3 py-1 rounded-full">
                                            {collection.visibility}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() =>
                                            handleDeleteCollection(
                                                collection._id
                                            )
                                        }
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>

                                </div>

                                {/* APIs */}
                                <div className="border-t pt-4">

                                    <h3 className="font-semibold mb-3">
                                        APIs
                                    </h3>

                                    {collection.apiIds?.length === 0 ? (
                                        <p className="text-gray-500">
                                            No APIs in this collection.
                                        </p>
                                    ) : (
                                        <div className="space-y-3">

                                            {collection.apiIds.map(
                                                (apiItem) => (

                                                    <div
                                                        key={apiItem._id}
                                                        className="flex justify-between items-center border rounded-lg p-4"
                                                    >

                                                        <div>
                                                            <h4 className="font-semibold">
                                                                {apiItem.name}
                                                            </h4>

                                                            <p className="text-sm text-gray-500">
                                                                {apiItem.description}
                                                            </p>
                                                        </div>

                                                        <button
                                                            onClick={() =>
                                                                handleRemoveAPI(
                                                                    collection._id,
                                                                    apiItem._id
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            Remove
                                                        </button>

                                                    </div>

                                                )
                                            )}

                                        </div>
                                    )}

                                </div>

                            </div>

                        ))
                    )}

                </div>

            </div>
        </div>
    );
}

export default Collections;