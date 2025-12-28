import React from "react";
import { CATEGORIES } from "../lib/utils.js";

export default function PreviewCard({ to, message, date, category }) {
  const selectedCategory = CATEGORIES.find((c) => c.value === category);

  return (
    <div className="glass p-6">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <span>📋</span>
        <span>Preview</span>
      </h3>
      <div className="space-y-3 text-sm">
        {category && selectedCategory && (
          <div>
            <p className="text-zinc-600 dark:text-zinc-400">Category:</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl">{selectedCategory.icon}</span>
              <span className="font-semibold">{selectedCategory.label}</span>
            </div>
          </div>
        )}
        <div>
          <p className="text-zinc-600 dark:text-zinc-400">To:</p>
          <p className="font-mono text-indigo-600 dark:text-indigo-400">
            {to || "-"}
          </p>
        </div>
        <div>
          <p className="text-zinc-600 dark:text-zinc-400">Message:</p>
          <p className="line-clamp-3 whitespace-pre-line">{message || "-"}</p>
        </div>
        <div>
          <p className="text-zinc-600 dark:text-zinc-400">Delivery Date:</p>
          <p className="font-semibold">
            {date ? new Date(date).toDateString() : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
