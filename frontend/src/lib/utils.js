// Capsule Categories
export const CATEGORIES = [
  { value: "birthday", label: "Birthday", icon: "🎂", color: "pink" },
  { value: "anniversary", label: "Anniversary", icon: "💕", color: "red" },
  { value: "goals", label: "Goals & Dreams", icon: "🎯", color: "indigo" },
  { value: "gratitude", label: "Gratitude", icon: "🙏", color: "emerald" },
  { value: "motivation", label: "Motivation", icon: "⚡", color: "amber" },
  { value: "memory", label: "Memories", icon: "📸", color: "purple" },
  { value: "other", label: "Other", icon: "📝", color: "zinc" },
];

// Calculate message statistics
export function getMessageStats(message) {
  const charCount = message.length;
  const wordCount = message
    .trim()
    .split(/\s+/)
    .filter((w) => w).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  return { charCount, wordCount, readingTime };
}
