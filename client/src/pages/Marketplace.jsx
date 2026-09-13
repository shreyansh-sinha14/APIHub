import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Marketplace() {
    const [apis, setApis] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAPIs = async () => {
        try {
            setLoading(true);

            const response = await api.get("/apis", {
                params: {
                    search: search || undefined,
                },
            });

            setApis(response.data.apis || response.data);
        } catch (error) {
            setError("Failed to load APIs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAPIs();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAPIs();
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                    <Link
                        to="/marketplace"
                        className="text-2xl font-bold text-blue-600"
                    >
                        APIHub
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link
                            to="/marketplace"
                            className="text-gray-700 hover:text-blue-600"
                        >
                            Marketplace
                        </Link>

                        <Link
                            to="/dashboard"
                            className="text-gray-700 hover:text-blue-600"
                        >
                            Dashboard
                        </Link>
                    </div>

                </div>
            </nav>

            {/* Hero */}
            <section className="bg-white">
                <div className="max-w-7xl mx-auto px-6 py-16 text-center">

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Discover Powerful APIs
                    </h1>

                    <p className="mt-4 text-lg text-gray-500">
                        Find, explore and test APIs for your next project.
                    </p>

                    {/* Search */}
                    <form
                        onSubmit={handleSearch}
                        className="max-w-2xl mx-auto mt-8 flex gap-3"
                    >
                        <input
                            type="text"
                            placeholder="Search APIs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Search
                        </button>
                    </form>

                </div>
            </section>

            {/* API Cards */}
            <main className="max-w-7xl mx-auto px-6 py-10">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Explore APIs
                    </h2>

                    <span className="text-gray-500">
                        {apis.length} APIs
                    </span>
                </div>

                {loading && (
                    <p className="text-center text-gray-500 py-10">
                        Loading APIs...
                    </p>
                )}

                {error && (
                    <p className="text-center text-red-500 py-10">
                        {error}
                    </p>
                )}

                {!loading && !error && apis.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">
                            No APIs found.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {apis.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
                        >

                            <h3 className="text-xl font-bold text-gray-900">
                                {item.name}
                            </h3>

                            <p className="text-gray-500 mt-2 line-clamp-3">
                                {item.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {item.tags?.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-5 flex justify-between items-center">

                                <span className="text-sm text-gray-500">
                                    {item.authenticationType}
                                </span>

                                <Link
                                    to={`/apis/${item._id}`}
                                    className="text-blue-600 font-semibold hover:underline"
                                >
                                    View API →
                                </Link>

                            </div>

                        </div>
                    ))}

                </div>

            </main>

        </div>
    );
}

export default Marketplace;