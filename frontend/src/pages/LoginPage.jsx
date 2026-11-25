import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Briefcase, Lock, Mail, ArrowRight, UserCheck, Building2, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const authUser = await login(email, password)
      if (authUser.role === 'ROLE_JOB_SEEKER') navigate('/seeker/dashboard')
      else if (authUser.role === 'ROLE_RECRUITER') navigate('/recruiter/dashboard')
      else if (authUser.role === 'ROLE_ADMIN') navigate('/admin/dashboard')
      else navigate(from)
    } catch (err) {
      // toast shown in context
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = async (presetEmail, presetRole) => {
    setEmail(presetEmail)
    setPassword('password123')
    setLoading(true)
    try {
      const authUser = await login(presetEmail, 'password123')
      if (authUser.role === 'ROLE_JOB_SEEKER') navigate('/seeker/dashboard')
      else if (authUser.role === 'ROLE_RECRUITER') navigate('/recruiter/dashboard')
      else if (authUser.role === 'ROLE_ADMIN') navigate('/admin/dashboard')
      else navigate('/')
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Hire<span className="text-blue-600">Hub</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your credentials or choose a quick test persona below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-200/80">
          {/* Quick Demo Login Cards */}
          <div className="mb-6 pb-6 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              Instant 1-Click Demo Login
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('seeker@hirehub.com', 'ROLE_JOB_SEEKER')}
                className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 text-left transition-all group"
              >
                <UserCheck className="w-4 h-4 text-blue-600 mb-1" />
                <div className="text-xs font-bold text-slate-900 leading-tight">Job Seeker</div>
                <div className="text-[10px] text-slate-500">Alex R.</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('recruiter@stripe.com', 'ROLE_RECRUITER')}
                className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/60 text-left transition-all group"
              >
                <Building2 className="w-4 h-4 text-indigo-600 mb-1" />
                <div className="text-xs font-bold text-slate-900 leading-tight">Recruiter</div>
                <div className="text-[10px] text-slate-500">Stripe</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@hirehub.com', 'ROLE_ADMIN')}
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/60 text-left transition-all group"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                <div className="text-xs font-bold text-slate-900 leading-tight">Admin</div>
                <div className="text-[10px] text-slate-500">Console</div>
              </button>
            </div>
          </div>

          {/* Regular Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Email Address</label>
              <div className="mt-1 relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="block w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <div className="mt-1 relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex justify-center py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all items-center gap-1.5"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
