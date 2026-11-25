import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobsApi, applicationsApi, interviewsApi } from '../../api/api'
import { useAuth } from '../../context/AuthContext'
import {
  Briefcase,
  Users,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Plus,
  Sparkles,
  ArrowRight,
  Clock,
  Building2
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'

export default function RecruiterDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      jobsApi.getRecruiterJobs({ size: 10 }),
      applicationsApi.getRecruiterApplications({ size: 10 }),
      interviewsApi.getRecruiterInterviews({ size: 5 })
    ])
      .then(([jobsRes, appsRes, intRes]) => {
        if (jobsRes.data?.success) setJobs(jobsRes.data.data.content || [])
        if (appsRes.data?.success) setApplications(appsRes.data.data.content || [])
        if (intRes.data?.success) setInterviews(intRes.data.data.content || [])
      })
      .finally(() => setLoading(false))
  }, [])

  const activeJobsCount = jobs.filter((j) => j.status === 'PUBLISHED').length
  const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW').length

  const chartData = [
    { name: 'Applied', count: applications.length || 4 },
    { name: 'Under Review', count: applications.filter((a) => a.status === 'UNDER_REVIEW').length || 2 },
    { name: 'Shortlisted', count: shortlistedCount || 3 },
    { name: 'Interview', count: interviews.length || 1 },
    { name: 'Selected', count: applications.filter((a) => a.status === 'SELECTED').length || 1 }
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Recruiter Command Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {user?.companyName || 'Company Recruiter'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage open requisitions, review AI candidate match scores, and coordinate interviews.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/recruiter/jobs"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Job</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Active Postings</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{activeJobsCount}</h3>
              <p className="text-[11px] text-blue-600 mt-0.5">{jobs.length} total roles</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Applicants</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{applications.length}</h3>
              <p className="text-[11px] text-indigo-600 mt-0.5">Across all postings</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Shortlisted</p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{shortlistedCount}</h3>
              <p className="text-[11px] text-emerald-600 mt-0.5">Top AI matches</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Scheduled Interviews</p>
              <h3 className="text-2xl font-extrabold text-purple-600 mt-1">{interviews.length}</h3>
              <p className="text-[11px] text-purple-600 mt-0.5">Upcoming rounds</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Chart + Recent Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Candidate Funnel Recharts */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" /> Candidate Pipeline Funnel
              </h3>
              <p className="text-xs text-slate-500 mb-6">Distribution across hiring stages</p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <Link
              to="/recruiter/applicants"
              className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between p-3 bg-slate-50 rounded-xl"
            >
              <span>Manage Candidate Pipeline</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Recent Candidates with AI Match */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" /> Recent Candidate Applications
              </h3>
              <Link to="/recruiter/applicants" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                View All &rarr;
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No candidate applications received yet.
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">{app.applicantName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 font-semibold">{app.jobTitle}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {app.applicantSkills?.slice(0, 4).map((sk, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 text-slate-600">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {app.aiMatchScore && (
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-emerald-600 block">
                            {app.aiMatchScore}% Match
                          </span>
                          <span className="text-[10px] text-slate-400">ATS Aligned</span>
                        </div>
                      )}
                      <Link
                        to="/recruiter/applicants"
                        className="px-3 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
