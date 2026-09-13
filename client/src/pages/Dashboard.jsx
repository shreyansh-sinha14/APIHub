import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
    const [apis, setApis] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    const authConfig = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const [apiResponse, collectionResponse] =
                await Promise.all([
                    api.get("/apis/mine", authConfig),
                    api.get("/collections", authConfig)
                ]);

            const allApis =
                apiResponse.data.apis || apiResponse.data;

            const myApis =
    apiResponse.data.apis || apiResponse.data;

setApis(myApis);

            setApis(myApis);

            setCollections(
                collectionResponse.data.collections ||
                collectionResponse.data
            );

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleDeleteAPI = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this API?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/apis/${id}`, authConfig);

            fetchDashboardData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete API"
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome, {user?.name || "Developer"} 👋
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your APIs and collections from one place.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-gray-500">
                            My APIs
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {apis.length}
                        </h2>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-gray-500">
                            My Collections
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {collections.length}
                        </h2>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-gray-500">
                            Account
                        </p>

                        <h2 className="text-xl font-bold mt-2 capitalize">
                            {user?.role || "User"}
                        </h2>
                    </div>

                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow p-6 mb-8">

                    <h2 className="text-xl font-semibold mb-4">
                        Quick Actions
                    </h2>

                    <div className="flex flex-wrap gap-4">

                        <Link
                            to="/publish"
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Publish API
                        </Link>

                        <Link
                            to="/marketplace"
                            className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900"
                        >
                            Browse Marketplace
                        </Link>

                        <Link
                            to="/collections"
                            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                        >
                            My Collections
                        </Link>

                    </div>

                </div>

                {/* My APIs */}
                <div className="bg-white rounded-xl shadow p-6 mb-8">

                    <div className="flex justify-between items-center mb-5">

                        <h2 className="text-xl font-semibold">
                            My APIs
                        </h2>

                        <Link
                            to="/publish"
                            className="text-blue-600 hover:underline"
                        >
                            + Publish API
                        </Link>

                    </div>

                    {apis.length === 0 ? (
                        <div className="text-center py-8">

                            <p className="text-gray-500 mb-4">
                                You haven't published any APIs yet.
                            </p>

                            <Link
                                to="/publish"
                                className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg"
                            >
                                Publish Your First API
                            </Link>

                        </div>
                    ) : (
                        <div className="space-y-4">

                            {apis.map((apiItem) => (

                                <div
                                    key={apiItem._id}
                                    className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                >

                                    <div>

                                        <h3 className="font-semibold text-lg">
                                            {apiItem.name}
                                        </h3>

                                        <p className="text-gray-500 text-sm mt-1">
                                            {apiItem.description}
                                        </p>

                                        <div className="flex gap-2 mt-2">

                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {apiItem.visibility}
                                            </span>

                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {apiItem.authenticationType}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="flex gap-3">

                                        <Link
                                            to={`/apis/${apiItem._id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            View
                                        </Link>

                                        <button
                                            onClick={() =>
                                                handleDeleteAPI(
                                                    apiItem._id
                                                )
                                            }
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>
                    )}

                </div>

                {/* Collections */}
                <div className="bg-white rounded-xl shadow p-6">

                    <div className="flex justify-between items-center mb-5">

                        <h2 className="text-xl font-semibold">
                            My Collections
                        </h2>

                        <Link
                            to="/collections"
                            className="text-blue-600 hover:underline"
                        >
                            View All
                        </Link>

                    </div>

                    {collections.length === 0 ? (
                        <p className="text-gray-500">
                            You haven't created any collections yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {collections.map((collection) => (

                                <div
                                    key={collection._id}
                                    className="border rounded-lg p-4"
                                >

                                    <h3 className="font-semibold">
                                        {collection.name}
                                    </h3>

                                    <p className="text-gray-500 text-sm mt-1">
                                        {collection.description ||
                                            "No description"}
                                    </p>

                                    <p className="text-sm mt-3">
                                        <span className="font-medium">
                                            {collection.apiIds?.length || 0}
                                        </span>{" "}
                                        APIs
                                    </p>

                                </div>

                            ))}

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}

export default Dashboard;