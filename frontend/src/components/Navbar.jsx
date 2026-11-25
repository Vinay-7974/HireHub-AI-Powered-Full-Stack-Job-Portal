import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { notificationsApi } from '../api/api'
import {
  Briefcase,
  Sparkles,
  Building2,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  FileText,
  Bookmark,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react'

export default function Navbar() {
  const { user, isAuthenticated, logout, switchRoleDemo } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (isAuthenticated) {
      notificationsApi.getUnreadCount()
        .then((res) => {
          if (res.data?.success) setUnreadCount(res.data.data.unreadCount || 0)
        })
        .catch(() => {})
    }
  }, [isAuthenticated, location.pathname])

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex items-center">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Hire<span className="text-blue-600">Hub</span>
              </span>
              <span className="ml-2 hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 rounded-full">
                <Sparkles className="w-2.5 h-2.5 text-blue-600" /> AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <Link
              to="/jobs"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/jobs') ? 'text-blue-600 bg-blue-50/60 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Find Jobs
            </Link>
            <Link
              to="/companies"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/companies') ? 'text-blue-600 bg-blue-50/60 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Companies
            </Link>
            <Link
              to="/seeker/ai/resume-analyzer"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                location.pathname.includes('/ai/') ? 'text-blue-600 bg-blue-50/60 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI Career Suite</span>
            </Link>

            {/* Role specific quick jump links */}
            {user?.role === 'ROLE_JOB_SEEKER' && (
              <Link
                to="/seeker/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/seeker/dashboard') ? 'text-blue-600 bg-blue-50/60 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                Seeker Hub
              </Link>
            )}
            {user?.role === 'ROLE_RECRUITER' && (
              <Link
                to="/recruiter/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/recruiter/dashboard') ? 'text-blue-600 bg-blue-50/60 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                Recruiter Hub
              </Link>
            )}
            {user?.role === 'ROLE_ADMIN' && (
              <Link
                to="/admin/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/admin/dashboard') ? 'text-blue-600 bg-blue-50/60 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                Admin Console
              </Link>
            )}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5">
          {/* 1-Click Role Switcher Demo Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-xs"
              title="Quickly switch demo personas"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-500 font-normal">Persona:</span>
              <span className="font-semibold text-slate-900">
                {user ? user.role.replace('ROLE_', '') : 'Guest'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleSwitcherOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setRoleSwitcherOpen(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Demo Account
                </div>
                <button
                  onClick={() => switchRoleDemo('ROLE_JOB_SEEKER')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between text-slate-700"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">Alex Rivera</span>
                    <span className="text-[11px] text-slate-500">Job Seeker</span>
                  </div>
                  {user?.role === 'ROLE_JOB_SEEKER' && <span className="text-blue-600 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => switchRoleDemo('ROLE_RECRUITER')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between text-slate-700"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">Sarah (Stripe)</span>
                    <span className="text-[11px] text-slate-500">Recruiter</span>
                  </div>
                  {user?.role === 'ROLE_RECRUITER' && <span className="text-blue-600 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => switchRoleDemo('ROLE_ADMIN')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between text-slate-700"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">System Admin</span>
                    <span className="text-[11px] text-slate-500">Platform Admin</span>
                  </div>
                  {user?.role === 'ROLE_ADMIN' && <span className="text-blue-600 font-bold">✓</span>}
                </button>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <Link
                to={user?.role === 'ROLE_JOB_SEEKER' ? '/seeker/interviews' : '/recruiter/dashboard'}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
                )}
              </Link>

              {/* User Avatar Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900 truncate">{user?.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-slate-100 text-slate-700">
                        {user?.role?.replace('ROLE_', '')}
                      </span>
                    </div>

                    <div className="py-1">
                      {user?.role === 'ROLE_JOB_SEEKER' && (
                        <>
                          <Link to="/seeker/dashboard" className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                            <Layers className="w-4 h-4 text-slate-400" /> Seeker Dashboard
                          </Link>
                          <Link to="/seeker/profile" className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                            <User className="w-4 h-4 text-slate-400" /> Profile & Resume
                          </Link>
                          <Link to="/seeker/applications" className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                            <FileText className="w-4 h-4 text-slate-400" /> My Applications
                          </Link>
                          <Link to="/seeker/saved-jobs" className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                            <Bookmark className="w-4 h-4 text-slate-400" /> Saved Jobs
                          </Link>
                          <Link to="/seeker/interviews" className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                            <Calendar className="w-4 h-4 text-slate-400" /> Interviews
                          </Link>
                          <Link to="/seeker/alerts" className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                            <Bell className="w-4 h-4 text-slate-400" /> Job Alerts
                          </Link>
                        </>
                      )}

                      {user?.role === 'ROLE_RECRUITER' && (
                        <>
                          <Link to="/recruiter/dashboard" className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                            <Layers className="w-4 h-4 text-slate-400" /> Recruiter Dashboard
                          </Link>
                          <Link to="/recruiter/jobs" className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                            <Briefcase className="w-4 h-4 text-slate-400" /> Manage Job Postings
                          </Link>
                          <Link to="/recruiter/applicants" className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                            <User className="w-4 h-4 text-slate-400" /> Candidate Pipeline
                          </Link>
                          <Link to="/recruiter/interviews" className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                            <Calendar className="w-4 h-4 text-slate-400" /> Interview Schedule
                          </Link>
                          <Link to="/recruiter/company" className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                            <Building2 className="w-4 h-4 text-slate-400" /> Company Profile
                          </Link>
                        </>
                      )}

                      {user?.role === 'ROLE_ADMIN' && (
                        <>
                          <Link to="/admin/dashboard" className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                            <ShieldCheck className="w-4 h-4 text-slate-400" /> Admin Overview
                          </Link>
                          <Link to="/admin/users" className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                            <User className="w-4 h-4 text-slate-400" /> Manage Users
                          </Link>
                          <Link to="/admin/jobs" className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                            <Briefcase className="w-4 h-4 text-slate-400" /> Moderate Jobs
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/20 transition-all flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Find Jobs
          </Link>
          <Link
            to="/companies"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Companies
          </Link>
          <Link
            to="/seeker/ai/resume-analyzer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            AI Career Suite
          </Link>
          {isAuthenticated && (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              {user?.role === 'ROLE_JOB_SEEKER' && (
                <Link
                  to="/seeker/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  Job Seeker Dashboard
                </Link>
              )}
              {user?.role === 'ROLE_RECRUITER' && (
                <Link
                  to="/recruiter/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  Recruiter Portal
                </Link>
              )}
              {user?.role === 'ROLE_ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  Admin Console
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  )
}
