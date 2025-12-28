import React, { useEffect, useState } from 'react'

function format(ms) {
  if (ms <= 0) return 'Delivered soon'
  const s = Math.floor(ms / 1000)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${d}d ${h}h ${m}m ${sec}s`
}

export default function Countdown({ to }) {
  const [left, setLeft] = useState(() => new Date(to) - new Date())
  useEffect(() => {
    const id = setInterval(() => setLeft(new Date(to) - new Date()), 1000)
    return () => clearInterval(id)
  }, [to])
  return <span className="font-mono">{format(left)}</span>
}
