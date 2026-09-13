import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const isActive = (path) => {
        return location.pathname === path
            ? "text-blue-400"
            : "text-gray-300 hover:text-white";
    };

    // Don't show application navbar on authentication pages
    if (location.pathname === "/login" ||
        location.pathname === "/register") {
        return null;
    }

    return (
        <nav className="bg-gray-900 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4">

                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <Link
                        to={token ? "/dashboard" : "/marketplace"}
                        className="text-2xl font-bold tracking-tight"
                    >
                        API<span className="text-blue-400">Hub</span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-6">

                        <Link
                            to="/marketplace"
                            className={isActive("/marketplace")}
                        >
                            Marketplace
                        </Link>

                        {token && (
                            <>
                                <Link
                                    to="/dashboard"
                                    className={isActive("/dashboard")}
                                >
                                    Dashboard
                                </Link>

                                <Link
                                    to="/collections"
                                    className={isActive("/collections")}
                                >
                                    Collections
                                </Link>

                                <Link
                                    to="/publish"
                                    className={isActive("/publish")}
                                >
                                    Publish API
                                </Link>

                                <div className="h-6 w-px bg-gray-700"></div>

                                <span className="text-gray-300">
                                    {user?.name}
                                </span>

                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                        {!token && (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                    </div>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;