const API_BASE = import.meta.env.VITE_API_BASE || "https://time-capsule-bice.vercel.app/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleJsonResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || "Request failed";
    throw new Error(message);
  }
  return data;
}

export async function registerUser(payload) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJsonResponse(res);
}

export async function loginUser(payload) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJsonResponse(res);
}

export async function createCapsule(payload) {
  const res = await fetch(`${API_BASE}/capsules`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  return handleJsonResponse(res);
}

export async function listCapsules() {
  const res = await fetch(`${API_BASE}/capsules`, {
    headers: { ...getAuthHeaders() },
  });
  return handleJsonResponse(res);
}

export async function triggerSend() {
  const res = await fetch(`${API_BASE}/capsules/trigger-send`, {
    method: "POST",
    headers: { ...getAuthHeaders() },
  });
  return handleJsonResponse(res);
}
