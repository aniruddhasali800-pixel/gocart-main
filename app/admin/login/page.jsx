'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading]   = useState(false)
    const [error, setError]       = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res  = await fetch(`${BASE_URL}/api/admin/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json()

            if (data.success) {
                localStorage.setItem('adminToken', data.token)
                localStorage.setItem('adminData',  JSON.stringify(data.admin))
                router.push('/admin')
            } else {
                setError(data.message || 'Invalid credentials')
            }
        } catch {
            setError('Server error. Make sure backend is running on port 5000.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4'>

            {/* Background blobs */}
            <div className='fixed top-0 left-0 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-15 pointer-events-none' />
            <div className='fixed bottom-0 right-0 w-80 h-80 bg-green-500 rounded-full blur-[120px] opacity-10 pointer-events-none' />

            <div className='relative z-10 w-full max-w-md'>

                {/* Card */}
                <div className='bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-10 shadow-2xl'>

                    {/* Logo */}
                    <div className='flex flex-col items-center mb-8'>
                        <div className='w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg shadow-indigo-500/30'>
                            🛒
                        </div>
                        <h1 className='text-2xl font-bold text-white tracking-tight'>GoCart Admin</h1>
                        <p className='text-slate-400 text-sm mt-1'>Sign in to access the admin panel</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className='flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-6'>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className='flex flex-col gap-4'>
                        <div>
                            <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>
                                Email Address
                            </label>
                            <input
                                type='email'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder='admin@example.com'
                                required
                                className='w-full bg-slate-900/70 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition'
                            />
                        </div>

                        <div>
                            <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>
                                Password
                            </label>
                            <input
                                type='password'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder='••••••••'
                                required
                                className='w-full bg-slate-900/70 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition'
                            />
                        </div>

                        <button
                            type='submit'
                            disabled={loading}
                            className='mt-2 w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25'
                        >
                            {loading ? (
                                <>
                                    <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                                    Signing in...
                                </>
                            ) : (
                                '🔐  Sign In to Admin'
                            )}
                        </button>
                    </form>

                    <p className='text-center text-xs text-slate-600 mt-8'>
                        🔒 Secure Admin Access · GoCart Platform
                    </p>
                </div>
            </div>
        </div>
    )
}
