import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function APIDetails() {
    const { id } = useParams();

    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [method, setMethod] = useState("GET");
    const [url, setUrl] = useState("");
    const [body, setBody] = useState("");

    const [response, setResponse] = useState(null);
    const [trying, setTrying] = useState(false);
    const [tryError, setTryError] = useState("");

    useEffect(() => {
        const fetchAPI = async () => {
            try {
                const result = await api.get(`/apis/${id}`);

                setApiData(result.data);
                setUrl(result.data.baseUrl);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load API"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAPI();
    }, [id]);

    const handleTryAPI = async () => {
        setTrying(true);
        setTryError("");
        setResponse(null);

        try {
            let parsedBody;

            if (body.trim()) {
                parsedBody = JSON.parse(body);
            }

            const token = localStorage.getItem("token");

            const result = await api.post(
                `/apis/${id}/try`,
                {
                    method,
                    url,
                    body: parsedBody,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setResponse(result.data);

        } catch (error) {
            if (error instanceof SyntaxError) {
                setTryError("Request body must contain valid JSON");
            } else {
                setTryError(
                    error.response?.data?.message ||
                    "Failed to execute API request"
                );
            }
        } finally {
            setTrying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">
                    Loading API...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">
                    {error}
                </p>
            </div>
        );
    }

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

                    <div className="flex gap-6">
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

            <main className="max-w-6xl mx-auto px-6 py-10">

                {/* API Information */}
                <div className="bg-white rounded-xl border p-8">

                    <div className="flex justify-between items-start">

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {apiData.name}
                            </h1>

                            <p className="mt-3 text-gray-600">
                                {apiData.description}
                            </p>
                        </div>

                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            {apiData.visibility}
                        </span>

                    </div>

                    <div className="mt-6">

                        <p className="text-sm text-gray-500">
                            Base URL
                        </p>

                        <code className="block mt-2 bg-gray-100 p-3 rounded-lg text-sm break-all">
                            {apiData.baseUrl}
                        </code>

                    </div>

                    <div className="mt-6">

                        <p className="text-sm text-gray-500">
                            Authentication
                        </p>

                        <p className="mt-1 font-medium">
                            {apiData.authenticationType}
                        </p>

                    </div>

                    {apiData.tags?.length > 0 && (
                        <div className="mt-6">

                            <p className="text-sm text-gray-500 mb-2">
                                Tags
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {apiData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                        </div>
                    )}

                </div>

                {/* Try API */}
                <div className="bg-white rounded-xl border p-8 mt-8">

                    <h2 className="text-2xl font-bold">
                        Try this API
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Send a test request directly from APIHub.
                    </p>

                    {/* Method + URL */}
                    <div className="flex gap-3 mt-6">

                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-3"
                        >
                            <option>GET</option>
                            <option>POST</option>
                            <option>PUT</option>
                            <option>PATCH</option>
                            <option>DELETE</option>
                        </select>

                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
                            placeholder="Request URL"
                        />

                    </div>

                    {/* Request Body */}
                    {method !== "GET" && method !== "DELETE" && (
                        <div className="mt-5">

                            <label className="block text-sm font-medium mb-2">
                                Request Body (JSON)
                            </label>

                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                rows="8"
                                placeholder={`{
  "title": "APIHub Test",
  "userId": 1
}`}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>
                    )}

                    <button
                        onClick={handleTryAPI}
                        disabled={trying}
                        className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {trying ? "Sending..." : "Send Request"}
                    </button>

                    {/* Error */}
                    {tryError && (
                        <div className="mt-5 bg-red-50 text-red-600 p-4 rounded-lg">
                            {tryError}
                        </div>
                    )}

                    {/* Response */}
                    {response && (
                        <div className="mt-8">

                            <h3 className="text-xl font-bold">
                                Response
                            </h3>

                            <div className="flex gap-6 mt-4 text-sm">

                                <div>
                                    <span className="text-gray-500">
                                        Status
                                    </span>

                                    <p className="font-bold text-green-600">
                                        {response.status}{" "}
                                        {response.statusText}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-gray-500">
                                        Response Time
                                    </span>

                                    <p className="font-bold">
                                        {response.responseTime}
                                    </p>
                                </div>

                            </div>

                            <pre className="mt-5 bg-gray-900 text-gray-100 p-5 rounded-lg overflow-auto text-sm">
                                {typeof response.data === "object"
                                    ? JSON.stringify(
                                        response.data,
                                        null,
                                        2
                                    )
                                    : response.data}
                            </pre>

                        </div>
                    )}

                </div>

            </main>

        </div>
    );
}

export default APIDetails;