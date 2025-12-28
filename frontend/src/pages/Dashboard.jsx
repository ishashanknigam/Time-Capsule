import React, { useEffect, useState } from "react";
import { listCapsules, triggerSend } from "../lib/api.js";
import Countdown from "../components/Countdown.jsx";
import { CATEGORIES } from "../lib/utils.js";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [passwordPrompt, setPasswordPrompt] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [unlockedCapsules, setUnlockedCapsules] = useState(new Set());

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await listCapsules();
      setItems(data);
    } catch (e) {
      setError("Failed to load capsules");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = items
    .filter((item) => {
      if (filter === "pending") return item.status === "pending";
      if (filter === "sent") return item.status === "sent";
      if (filter === "failed") return item.status === "failed";
      return true;
    })
    .filter(
      (item) =>
        item.receiverEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) => {
      if (categoryFilter === "all") return true;
      if (categoryFilter === "uncategorized") {
        return !item.category || item.category === "";
      }
      return item.category === categoryFilter;
    });

  const stats = {
    total: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    sent: items.filter((i) => i.status === "sent").length,
    failed: items.filter((i) => i.status === "failed").length,
  };

  const handleViewMessage = (capsule) => {
    if (capsule.passwordHash && !unlockedCapsules.has(capsule._id)) {
      setPasswordPrompt(capsule);
      setPasswordInput("");
      setPasswordError("");
    }
  };

  const handlePasswordSubmit = () => {
    if (!passwordPrompt) return;

    const expectedHash = passwordPrompt.passwordHash;
    const inputHash = btoa(passwordInput);

    if (inputHash === expectedHash) {
      setUnlockedCapsules((prev) => new Set([...prev, passwordPrompt._id]));
      setPasswordPrompt(null);
      setPasswordInput("");
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password");
    }
  };

  const handlePasswordCancel = () => {
    setPasswordPrompt(null);
    setPasswordInput("");
    setPasswordError("");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold mb-2 gradient-text">
          Capsule Dashboard
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage and track all your time capsules
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: "Total Capsules", value: stats.total, icon: "" },
          { label: "Pending", value: stats.pending, icon: "" },
          { label: "Delivered", value: stats.sent, icon: "" },
          { label: "Failed", value: stats.failed, icon: "" },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 text-center">
            <div className="text-4xl mb-2">{stat.icon}</div>
            <div className="text-4xl font-bold mb-2">{stat.value}</div>
            <p className="text-zinc-600 dark:text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="glass p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "sent", "failed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === f
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-200 dark:bg-zinc-700"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              className="btn btn-secondary px-3 py-2 text-sm"
              onClick={load}
            >
              Refresh
            </button>
            <button
              className="btn px-3 py-2 text-sm"
              onClick={async () => {
                await triggerSend();
                await load();
              }}
            >
              Send
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Search..."
            className="input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="uncategorized">📋 Uncategorized</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4"></div>
          <p>Loading...</p>
        </div>
      )}
      {error && <div className="glass p-4 bg-red-50 text-red-700">{error}</div>}
      {!loading && filtered.length === 0 && (
        <div className="glass p-12 text-center">
          <div className="text-6xl mb-4"></div>
          <p>{items.length === 0 ? "No capsules yet" : "No matches"}</p>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((item) => {
          const cat = CATEGORIES.find((c) => c.value === item.category);
          return (
            <div key={item._id} className="glass p-6">
              <div className="flex justify-between mb-4">
                <div className="flex gap-2">
                  {cat && <span className="text-2xl">{cat.icon}</span>}
                  <div>
                    <p className="text-sm text-zinc-500">
                      To: {item.receiverEmail}
                    </p>
                    <p className="font-bold">From: {item.senderName}</p>
                  </div>
                </div>
                <div
                  className={`badge ${
                    item.status === "sent"
                      ? "badge-success"
                      : item.status === "failed"
                      ? "bg-red-100 text-red-700"
                      : "badge-pending"
                  }`}
                >
                  {item.status}
                </div>
              </div>
              <div className="relative mb-4">
                <div
                  className={`p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg ${
                    item.passwordHash && !unlockedCapsules.has(item._id)
                      ? "blur-sm"
                      : ""
                  }`}
                >
                  <p className="whitespace-pre-line">{item.message}</p>
                </div>
                {item.passwordHash && !unlockedCapsules.has(item._id) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => handleViewMessage(item)}
                      className="btn"
                    >
                      {" "}
                      Unlock
                    </button>
                  </div>
                )}
              </div>
              <div className="text-sm border-t pt-4 space-y-1">
                <p>Unlock: {new Date(item.unlockDate).toDateString()}</p>
                {item.status === "pending" && (
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-lg">
                    <span>⏱️</span>
                    <Countdown to={item.unlockDate} />
                  </div>
                )}
                {item.status === "sent" && item.sentAt && (
                  <p className="text-green-600">
                    Sent: {new Date(item.sentAt).toDateString()}
                  </p>
                )}
                {item.errorMessage && (
                  <p className="text-red-600">{item.errorMessage}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {passwordPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4"></div>
              <h2 className="text-2xl font-bold mb-2">Password Protected</h2>
            </div>
            <div className="space-y-4">
              <input
                type="password"
                className="input"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handlePasswordSubmit();
                }}
              />
              {passwordError && <p className="text-red-600">{passwordError}</p>}
              <div className="flex gap-3">
                <button
                  onClick={handlePasswordCancel}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button onClick={handlePasswordSubmit} className="btn flex-1">
                  Unlock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
