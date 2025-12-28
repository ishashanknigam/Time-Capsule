import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCapsule } from "../lib/api.js";
import PreviewCard from "../components/PreviewCard.jsx";
import { CATEGORIES, getMessageStats } from "../lib/utils.js";

export default function CreateCapsule() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    senderName: "",
    receiverEmail: "",
    message: "",
    unlockDate: "",
    password: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userEmail = user?.email || "";

  const messageStats = form.message
    ? getMessageStats(form.message)
    : { charCount: 0, wordCount: 0, readingTime: 0 };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setNotice("");
    setError("");

    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      const res = await createCapsule(payload);
      setNotice(
        `✅ Your message has been saved and will be delivered on ${new Date(
          res.capsule.unlockDate
        ).toDateString()}.`
      );

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError("Failed to save message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 gradient-text">
          Create a Time Capsule
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Write a message and schedule it for future delivery
        </p>
      </div>

      {/* Success/Error Notices */}
      {notice && (
        <div className="glass p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 animate-slideInRight">
          <p className="text-green-700 dark:text-green-300 font-medium">
            {notice}
          </p>
        </div>
      )}
      {error && (
        <div className="glass p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 animate-slideInRight">
          <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={onSubmit} className="glass p-8 space-y-6">
            <div>
              <label className="label">Your Name</label>
              <input
                className="input"
                placeholder="John Doe"
                name="senderName"
                value={form.senderName}
                onChange={onChange}
                required
              />
            </div>

            <div>
              <label className="label">Your Email</label>
              <input
                className="input"
                type="email"
                placeholder="your@example.com"
                disabled
                value={userEmail}
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Your registered email (read-only)
              </p>
            </div>

            <div>
              <label className="label">Recipient Email</label>
              <input
                className="input"
                type="email"
                placeholder="recipient@example.com"
                name="receiverEmail"
                value={form.receiverEmail}
                onChange={onChange}
                required
              />
            </div>

            <div>
              <label className="label">Category (Optional)</label>
              <select
                className="input"
                name="category"
                value={form.category}
                onChange={onChange}
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Message</label>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 space-x-3">
                  <span>{messageStats.charCount} chars</span>
                  <span>{messageStats.wordCount} words</span>
                </div>
              </div>
              <textarea
                className="input h-40 resize-none"
                placeholder="Write your message here..."
                name="message"
                value={form.message}
                onChange={onChange}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Unlock Date</label>
                <input
                  className="input"
                  type="date"
                  name="unlockDate"
                  value={form.unlockDate}
                  onChange={onChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div>
                <label className="label">Password (Optional)</label>
                <input
                  className="input"
                  type="password"
                  placeholder="Leave empty for no password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                />
              </div>
            </div>

            <button disabled={loading} className="btn w-full" type="submit">
              {loading ? "Saving..." : "Create Capsule"}
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <PreviewCard
            to={form.receiverEmail}
            message={form.message}
            date={form.unlockDate}
            category={form.category}
          />
        </div>
      </div>
    </div>
  );
}
