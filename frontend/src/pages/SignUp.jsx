import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../lib/api.js";

export default function SignUp({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (!name || !email) return setError("Name and email are required");
      setStep(2);
      return;
    }

    if (!password) return setError("Password is required");
    if (password !== confirm) return setError("Passwords do not match");
    if (password.length < 8)
      return setError("Password must be at least 8 characters");

    try {
      setLoading(true);
      const result = await registerUser({ name, email, password });
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      onLogin();
      navigate("/home");
    } catch (err) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="glass p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Start sending messages to the future
            </p>
          </div>

          {/* Progress */}
          <div className="flex gap-2">
            <div
              className={`flex-1 h-1 rounded-full transition ${step >= 1 ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-600"}`}
            ></div>
            <div
              className={`flex-1 h-1 rounded-full transition ${step >= 2 ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-600"}`}
            ></div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="label">Full Name</label>
                  <input
                    className="input"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="label">Email Address</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="label">Password</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="label">Confirm Password</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-secondary flex-1"
                >
                  ← Back
                </button>
              )}
              <button
                className={`btn ${step === 2 ? "flex-1" : "w-full"}`}
                disabled={loading}
                type="submit"
              >
                {loading
                  ? "⏳ Creating..."
                  : step === 1
                    ? "Next →"
                    : "🚀 Sign Up"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-300 dark:border-zinc-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                or
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              Already have an account?{" "}
              <Link to="/signin" className="link font-semibold">
                Sign In
              </Link>
            </p>
          </div>

          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg text-sm text-indigo-700 dark:text-indigo-300">
            Your password must be at least 8 characters.
          </div>
        </div>
      </div>
    </div>
  );
}
