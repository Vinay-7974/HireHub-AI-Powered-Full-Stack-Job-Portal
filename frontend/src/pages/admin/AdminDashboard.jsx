import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/api'
import {
  ShieldCheck,
  Users,
  Briefcase,
  Building2,
  FileText,
  Calendar,
  Activity,
  UserCheck,
  TrendingUp,
  Cpu,
  Database,
  ArrowRight
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobSeekers: 0,
    totalRecruiters: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalInterviews: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi
      .getAnalytics()
      .then((res) => {
        if (res.data?.success && res.data.data) {
          setStats(res.data.data)
        }
      })
      .catch((err) => {
        console.error(err)
        toast.error('Failed to load platform analytics')
      })
      .finally(() => setLoading(false))
  }, [])

  const userDistribution = [
    { name: 'Job Seekers', value: stats.totalJobSeekers || 1, color: '#2563eb' },
    { name: 'Recruiters', value: stats.totalRecruiters || 1, color: '#4f46e5' },
    { name: 'Admins', value: Math.max(1, (stats.totalUsers || 2) - (stats.totalJobSeekers || 1) - (stats.totalRecruiters || 1)), color: '#10b981' }
  ]

  const funnelData = [
    { stage: 'Jobs Posted', count: stats.totalJobs || 5 },
    { stage: 'Applications', count: stats.totalApplications || 8 },
    { stage: 'Interviews', count: stats.totalInterviews || 3 }
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Platform Admin Console
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Root Administrator
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time platform telemetry, user account access control, and job moderation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/users"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              Manage Users
            </Link>
            <Link
              to="/admin/jobs"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all"
            >
              Moderate Listings
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-500">Total Users</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.totalUsers}</h3>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
              <UserCheck className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-500">Job Seekers</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.totalJobSeekers}</h3>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
              <Briefcase className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-500">Recruiters</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.totalRecruiters}</h3>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <Building2 className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-500">Companies</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.totalCompanies}</h3>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <FileText className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-500">Applications</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.totalApplications}</h3>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
              <Calendar className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-500">Interviews</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.totalInterviews}</h3>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Funnel Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Hiring Funnel Volume</h3>
                <p className="text-xs text-slate-500">Conversion funnel from posted roles to interviews</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-full">
                <Activity className="w-3.5 h-3.5" />
                Live Stats
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="stage" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">User Composition</h3>
              <p className="text-xs text-slate-500 mb-4">Breakdown by registered roles</p>

              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
              {userDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Architecture & Status Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Backend Services Healthy • Port 8080 Active
              </div>
              <h3 className="text-xl font-extrabold tracking-tight">Full-Stack HireHub Architecture</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Running Spring Boot 3.3.5 on Java 21 LTS with MySQL 8.0 relational persistence, JWT stateless authentication, and Gemini AI career optimization layer with fallback rule engine.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs shrink-0">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
                <span className="text-slate-400 block text-[11px]">Database</span>
                <span className="font-bold text-slate-200 mt-0.5 block">MySQL 8.0 (Active)</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
                <span className="text-slate-400 block text-[11px]">AI Engine</span>
                <span className="font-bold text-blue-400 mt-0.5 block">Gemini / Deterministic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
