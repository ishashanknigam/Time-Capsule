const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export async function createCapsule(payload) {
  const res = await fetch(`${API_BASE}/capsules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to create capsule')
  return res.json()
}

export async function listCapsules() {
  const res = await fetch(`${API_BASE}/capsules`)
  if (!res.ok) throw new Error('Failed to fetch capsules')
  return res.json()
}

export async function triggerSend() {
  const res = await fetch(`${API_BASE}/capsules/trigger-send`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to trigger send')
  return res.json()
}
