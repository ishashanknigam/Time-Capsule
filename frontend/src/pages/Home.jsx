import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LuPenLine,
  LuPackage,
  LuClock,
  LuCalendarDays,
  LuCircleCheck,
  LuListFilter,
  LuArrowRight,
} from "react-icons/lu";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Welcome Section */}
      <motion.div
        variants={itemVariants}
        className="text-center glass-panel p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl rounded-full mix-blend-multiply translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 p-32 bg-fuchsia-500/10 dark:bg-fuchsia-500/5 blur-3xl rounded-full mix-blend-multiply -translate-x-1/2 translate-y-1/2" />

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-balance">
          Welcome back,{" "}
          <span className="gradient-text-primary">{user?.name}</span>!
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 font-medium tracking-wide">
          <LuCalendarDays className="w-4 h-4" />
          <span>TODAY IS</span>
          <span className="text-indigo-500 dark:text-indigo-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
        <Link
          to="/create"
          className="group glass-panel p-8 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors relative overflow-hidden"
        >
          <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <LuPenLine className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Create Capsule</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-4 font-medium leading-relaxed">
            Write a new message and schedule it for future delivery.
          </p>
          <div className="inline-flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-3 transition-all">
            Start Writing <LuArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link
          to="/dashboard"
          className="group glass-panel p-8 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors relative overflow-hidden"
        >
          <div className="w-14 h-14 bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <LuPackage className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold mb-2">View Capsules</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-4 font-medium leading-relaxed">
            See all your pending and delivered messages in one place.
          </p>
          <div className="inline-flex items-center gap-2 font-semibold text-fuchsia-600 dark:text-fuchsia-400 group-hover:gap-3 transition-all">
            Open Dashboard <LuArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </motion.div>

      {/* Stats Section */}
      <motion.div variants={itemVariants} className="glass-panel p-8">
        <div className="flex items-center gap-3 mb-8">
          <LuListFilter className="w-6 h-6 text-zinc-400" />
          <h2 className="text-2xl font-bold tracking-tight">Your Statistics</h2>
        </div>

        {data.loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-[120px] rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-zinc-500 font-semibold tracking-wide text-sm uppercase">
                <LuPackage className="w-4 h-4" />
                Total Capsules
              </div>
              <div className="text-4xl font-extrabold">{stats.total}</div>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-500 font-semibold tracking-wide text-sm uppercase">
                <LuClock className="w-4 h-4" />
                Pending Delivery
              </div>
              <div className="text-4xl font-extrabold text-amber-700 dark:text-amber-400">
                {stats.pending}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/30 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-500 font-semibold tracking-wide text-sm uppercase">
                <LuCircleCheck className="w-4 h-4" />
                Successfully Sent
              </div>
              <div className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-400">
                {stats.sent}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Recent Activity */}
      {!data.loading && recentCapsules.length > 0 && (
        <motion.div variants={itemVariants} className="glass-panel p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Recent Activity
            </h2>
            <Link
              to="/dashboard"
              className="text-sm link font-semibold flex items-center gap-1"
            >
              View all <LuArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentCapsules.map((capsule) => (
              <div
                key={capsule._id}
                className="p-5 bg-zinc-50/80 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      To: {capsule.receiverEmail}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1 mt-1">
                      {capsule.message}
                    </p>
                    <p className="text-xs text-zinc-500 font-medium tracking-wide flex items-center gap-1 mt-3 uppercase">
                      <LuClock className="w-3 h-3" />
                      {new Date(capsule.unlockDate).toDateString()}
                    </p>
                  </div>
                  <div
                    className={`badge ${
                      capsule.status === "sent"
                        ? "badge-success"
                        : "badge-pending"
                    } ml-4 mt-1`}
                  >
                    {capsule.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
