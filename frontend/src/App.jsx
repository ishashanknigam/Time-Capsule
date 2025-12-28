import React, { useState } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Home from "./pages/Home.jsx";
import CreateCapsule from "./pages/CreateCapsule.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";

// Protected Route Component
function ProtectedRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
}

function Header({ onLogout }) {
  const isAuthenticated = !!localStorage.getItem("user");
  const navigate = useNavigate();
  const loc = useLocation();

  const isLanding = loc.pathname === "/";
  const isAuthPage = loc.pathname === "/signin" || loc.pathname === "/signup";
  const navLinks = isAuthenticated
    ? [
        { path: "/home", label: "Home" },
        { path: "/create", label: "Create" },
        { path: "/dashboard", label: "Dashboard" },
      ]
    : [];

  const handleLogout = () => {
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    navigate("/", { replace: true });
  };

  if (isLanding || isAuthPage) {
    return (
      <header className="sticky top-0 z-50 glass">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="font-bold text-2xl gradient-text">
            ⏰ Time Capsule
          </Link>

          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <>
                <Link
                  to="/signin"
                  className={`px-4 py-2 rounded-lg transition ${
                    loc.pathname === "/signin"
                      ? "bg-indigo-600 text-white"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className={`px-4 py-2 rounded-lg transition ${
                    loc.pathname === "/signup"
                      ? "bg-indigo-600 text-white"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container py-4 flex items-center justify-between">
        <Link to="/home" className="font-bold text-2xl gradient-text">
          ⏰ Time Capsule
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg transition ${
                loc.pathname === link.path
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="px-4 py-2 ml-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("user")
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <Header onLogout={handleLogout} />
      <main className="container py-12">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CreateCapsule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="container py-8 text-center text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 mt-12">
        <p>Make today memorable for tomorrow. © 2024 Time Capsule</p>
      </footer>
    </div>
  );
}
