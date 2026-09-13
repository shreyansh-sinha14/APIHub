import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import APIDetails from "./pages/APIDetails";
import PublishAPI from "./pages/PublishAPI";
import Collections from "./pages/Collections";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* Public Routes */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/marketplace"
                    element={<Marketplace />}
                />

                <Route
                    path="/apis/:id"
                    element={<APIDetails />}
                />


                {/* Protected Routes */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/publish"
                    element={
                        <ProtectedRoute>
                            <PublishAPI />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/collections"
                    element={
                        <ProtectedRoute>
                            <Collections />
                        </ProtectedRoute>
                    }
                />


                {/* Default */}

                <Route
                    path="*"
                    element={<Login />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;