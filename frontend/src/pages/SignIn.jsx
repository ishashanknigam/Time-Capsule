import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SignIn({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Email and password are required')
    
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Store user in localStorage to simulate login
      localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }))
      onLogin()
      navigate('/home')
    }, 500)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="glass p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="text-5xl mb-4">🔐</div>
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Sign in to manage your capsules</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
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

            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button className="btn w-full" disabled={loading} type="submit">
              {loading ? '⏳ Signing in...' : '🚀 Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-300 dark:border-zinc-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              Don't have an account? <Link to="/signup" className="link font-semibold">Sign Up</Link>
            </p>
          </div>

          {/* Demo Info */}
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg text-sm text-indigo-700 dark:text-indigo-300">
            💡 Demo: Use any email and password to continue
          </div>
        </div>
      </div>
    </div>
  )
}
