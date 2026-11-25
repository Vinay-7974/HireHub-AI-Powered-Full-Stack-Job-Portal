import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { userApi, applicationsApi, interviewsApi, jobsApi } from '../../api/api'
import {
  Sparkles,
  FileText,
  Bookmark,
  Calendar,
  Send,
  ArrowRight,
  Briefcase,
  Bell,
  CheckCircle2,
  Clock,
  TrendingUp,
  Cpu,
  User,
  ShieldCheck,
  ChevronRight
} from 'lucide-react'

export default function SeekerDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [applications, setApplications] = useState([])
  const [interviews, setInterviews] = useState([])
  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [savedCount, setSavedCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      userApi.getJobSeekerProfile(),
      applicationsApi.getMyApplications({ page: 0, size: 5 }),
      interviewsApi.getSeekerInterviews({ page: 0, size: 3 }),
      jobsApi.getJobs({ page: 0, size: 4 }),
      userApi.getSavedJobs({ page: 0, size: 1 })
    ])
      .then(([profRes, appsRes, intRes, jobsRes, savedRes]) => {
        if (profRes.data?.success) setProfile(profRes.data.data)
        if (appsRes.data?.success) setApplications(appsRes.data.data.content || [])
        if (intRes.data?.success) setInterviews(intRes.data.data.content || [])
        if (jobsRes.data?.success) setRecommendedJobs(jobsRes.data.data.content || [])
        if (savedRes.data?.success) setSavedCount(savedRes.data.data.totalElements || 0)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Top Welcome Banner */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold uppercase shadow-sm">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Welcome back, {user?.fullName}!
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                  Job Seeker
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {profile?.headline || 'Ready to discover your next engineering opportunity.'}
              </p>
            </div>
          </div>

          {/* Profile Strength Progress Card */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center gap-4 shrink-0">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle cx="24" cy="24" r="18" stroke="#e2e8f0" strokeWidth="3" fill="transparent" />
                <circle
                  cx="24"
                  cy="24"
                  r="18"
                  stroke="#2563eb"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray="113"
                  strokeDashoffset={113 - (113 * (profile?.profileCompletionPercentage || 85)) / 100}
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="absolute text-[11px] font-extrabold text-blue-600">
                {profile?.profileCompletionPercentage || 85}%
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Profile Strength</div>
              <div className="text-[11px] text-slate-500">Add certifications to reach 100%</div>
              <Link to="/seeker/profile" className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 mt-0.5 inline-block">
                Update Profile &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Applications Sent</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{applications.length}</h3>
              <p className="text-[11px] text-blue-600 mt-0.5">Active Tracking</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Upcoming Interviews</p>
              <h3 className="text-2xl font-extrabold text-indigo-600 mt-1">{interviews.length}</h3>
              <p className="text-[11px] text-indigo-600 mt-0.5">Technical & HR</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Saved Jobs</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{savedCount}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Bookmarked Roles</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">ATS Match Average</p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">92%</h3>
              <p className="text-[11px] text-emerald-600 mt-0.5">Optimized Profile</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* AI Career Suite Launchpad */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Career Suite</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">AI Tools for Your Job Search</h2>
              <p className="text-xs text-slate-300 mt-1">Optimize your materials and prepare for live technical rounds.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/seeker/ai/resume-analyzer"
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <Sparkles className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">AI Resume Analyzer</h4>
                <p className="text-xs text-slate-300 mt-1">ATS scoring, keyword gaps & recommendations.</p>
              </div>
              <span className="text-[11px] font-semibold text-blue-400 mt-4 inline-flex items-center gap-1">
                Scan Resume &rarr;
              </span>
            </Link>

            <Link
              to="/seeker/ai/cover-letter"
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <FileText className="w-6 h-6 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">Cover Letter Writer</h4>
                <p className="text-xs text-slate-300 mt-1">Tailored tone, company-specific letters.</p>
              </div>
              <span className="text-[11px] font-semibold text-indigo-400 mt-4 inline-flex items-center gap-1">
                Draft Letter &rarr;
              </span>
            </Link>

            <Link
              to="/seeker/ai/interview-prep"
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <Cpu className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">Interview Practice</h4>
                <p className="text-xs text-slate-300 mt-1">Role-specific tech & behavioral questions.</p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 mt-4 inline-flex items-center gap-1">
                Prepare Now &rarr;
              </span>
            </Link>

            <Link
              to="/seeker/ai/skill-gap"
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <TrendingUp className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">Skill Gap Roadmap</h4>
                <p className="text-xs text-slate-300 mt-1">Compare skills vs target role requirements.</p>
              </div>
              <span className="text-[11px] font-semibold text-purple-400 mt-4 inline-flex items-center gap-1">
                View Roadmap &rarr;
              </span>
            </Link>
          </div>
        </div>

        {/* 2 Columns: Applications & Upcoming Interviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Applications list */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> Recent Applications
              </h3>
              <Link to="/seeker/applications" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                View All &rarr;
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                You haven't submitted any applications yet. Explore open roles!
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={app.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128'}
                        alt={app.companyName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-2xs"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{app.jobTitle}</h4>
                        <p className="text-[11px] text-slate-500">{app.companyName} &bull; {app.jobLocation}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                        {app.status}
                      </span>
                      {app.aiMatchScore && (
                        <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                          {app.aiMatchScore}% Match
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scheduled Interviews */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" /> Scheduled Interviews
              </h3>
              <Link to="/seeker/interviews" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                Calendar &rarr;
              </Link>
            </div>

            {interviews.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No interviews scheduled currently. Keep applying!
              </div>
            ) : (
              <div className="space-y-3">
                {interviews.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/30 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{item.companyName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                          {item.interviewType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-1">{item.jobTitle}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(item.interviewDate).toLocaleString()}
                      </p>
                    </div>
                    {item.meetingLink && (
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                      >
                        Join Call
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="p-4 mb-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Automated Job Alerts</h4>
                <p className="text-xs text-slate-600">Get notified the instant matching engineering roles are posted.</p>
              </div>
            </div>
            <Link
              to="/seeker/alerts"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shrink-0 self-start sm:self-auto shadow-xs"
            >
              Manage Alerts &rarr;
            </Link>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" /> Recommended For Your Skills
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Matching your skills in React, Spring Boot, and MySQL.</p>
            </div>
            <Link to="/jobs" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              Browse More &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128'}
                    alt={job.companyName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                  />
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500">{job.companyName}</span>
                    <Link to={`/jobs/${job.id}`} className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 block">
                      {job.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{job.location}</span>
                      <span>&bull;</span>
                      <span className="font-semibold text-slate-900">${(job.salaryMin / 1000).toFixed(0)}k+</span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/jobs/${job.id}`}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs whitespace-nowrap"
                >
                  Apply
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
