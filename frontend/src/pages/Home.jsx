import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCapsules } from "../lib/api.js";

export default function Home() {
  const [data, setData] = useState({ capsules: [], loading: true });
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    listCapsules()
      .then((capsules) => setData({ capsules, loading: false }))
      .catch(() => setData({ capsules: [], loading: false }));
  }, []);

  const stats = {
    total: data.capsules.length,
    pending: data.capsules.filter((i) => i.status === "pending").length,
    sent: data.capsules.filter((i) => i.status === "sent").length,
  };
  const recentCapsules = data.capsules.slice(0, 3);

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Welcome Section */}
      <div className="text-center glass p-8">
        <h1 className="text-5xl font-bold mb-3 gradient-text">
          Welcome back, {user?.name}! 👋
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
          <span>Today is</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/create" className="glass p-8 hover:shadow-xl transition">
          <div className="text-6xl mb-4">✍️</div>
          <h2 className="text-2xl font-bold mb-2">Create Capsule</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Write a new message and schedule it for future delivery.
          </p>
        </Link>

        <Link to="/dashboard" className="glass p-8 hover:shadow-xl transition">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold mb-2">View Capsules</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            See all your pending and delivered messages.
          </p>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="glass p-8">
        <h2 className="text-2xl font-bold mb-6">Your Statistics</h2>
        {data.loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-24 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <div className="text-5xl font-bold mb-2">{stats.total}</div>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                Total Capsules
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <div className="text-5xl font-bold mb-2">{stats.pending}</div>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                Pending
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <div className="text-5xl font-bold mb-2">{stats.sent}</div>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                Delivered
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {!data.loading && recentCapsules.length > 0 && (
        <div className="glass p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <Link to="/dashboard" className="text-sm link font-semibold">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentCapsules.map((capsule) => (
              <div
                key={capsule._id}
                className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">To: {capsule.receiverEmail}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1 mt-1">
                      {capsule.message}
                    </p>
                    <p className="text-xs text-zinc-500 mt-2">
                      {new Date(capsule.unlockDate).toDateString()}
                    </p>
                  </div>
                  <div
                    className={`badge ${
                      capsule.status === "sent"
                        ? "badge-success"
                        : "badge-pending"
                    } ml-4`}
                  >
                    {capsule.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
