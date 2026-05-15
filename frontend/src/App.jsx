import React, { useState } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  LuClock,
  LuHouse,
  LuPenLine,
  LuLayoutDashboard,
  LuLogIn,
  LuUserPlus,
  LuLogOut,
} from "react-icons/lu";
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
  const isAuthenticated = !!localStorage.getItem("token");
  const navigate = useNavigate();
  const loc = useLocation();

  const isLanding = loc.pathname === "/";
  const isAuthPage = loc.pathname === "/signin" || loc.pathname === "/signup";
  const navLinks = isAuthenticated
    ? [
        { path: "/home", label: "Home", icon: <LuHouse className="w-4 h-4" /> },
        {
          path: "/create",
          label: "Create",
          icon: <LuPenLine className="w-4 h-4" />,
        },
        {
          path: "/dashboard",
          label: "Dashboard",
          icon: <LuLayoutDashboard className="w-4 h-4" />,
        },
      ]
    : [];

  const handleLogout = () => {
    onLogout();
    navigate("/", { replace: true });
  };

  if (isLanding || isAuthPage) {
    return (
      <header className="sticky top-0 z-50 glass m-4 rounded-2xl mx-auto max-w-5xl">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="font-bold flex items-center gap-2 text-xl tracking-tight"
          >
            <LuClock className="w-6 h-6 text-indigo-500" />
            <span className="gradient-text">Time Capsule</span>
          </Link>

          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <>
                <Link
                  to="/signin"
                  className={`btn-secondary !px-4 !py-2 !text-sm flex items-center gap-2`}
                >
                  <LuLogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className={`btn-primary !px-4 !py-2 !text-sm hidden sm:flex items-center gap-2`}
                >
                  <LuUserPlus className="w-4 h-4" />
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 glass m-4 rounded-2xl mx-auto max-w-5xl">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link
          to="/home"
          className="font-bold flex items-center gap-2 text-xl tracking-tight"
        >
          <LuClock className="w-6 h-6 text-indigo-500" />
          <span className="gradient-text hidden sm:inline">Time Capsule</span>
        </Link>
        <nav className="flex items-center gap-1 bg-zinc-100/50 dark:bg-zinc-800/50 p-1 rounded-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                loc.pathname === link.path
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {link.icon}
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="flex items-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
          >
            <LuLogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token"),
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-[#0a0a0a] dark:via-zinc-900/20 dark:to-zinc-950">
      <Header onLogout={handleLogout} />
      <main className="container py-12 max-w-5xl">
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
