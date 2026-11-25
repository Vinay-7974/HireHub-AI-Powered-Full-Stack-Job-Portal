import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applicationsApi } from '../../api/api'
import toast from 'react-hot-toast'
import {
  FileText,
  Clock,
  Building2,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Sparkles,
  ArrowRight,
  Trash2
} from 'lucide-react'

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')

  const fetchApps = () => {
    setLoading(true)
    applicationsApi.getMyApplications({ size: 50 })
      .then((res) => {
        if (res.data?.success) setApplications(res.data.data.content || [])
      })
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchApps()
  }, [])

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return
    try {
      await applicationsApi.withdraw(appId)
      toast.success('Application withdrawn')
      fetchApps()
    } catch (err) {
      toast.error('Failed to withdraw application')
    }
  }

  const filtered = statusFilter === 'ALL'
    ? applications
    : applications.filter((a) => a.status === statusFilter)

  const steps = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED']

  const getStepIndex = (status) => {
    return steps.indexOf(status)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Job Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track real-time candidate stage progression, interview statuses, and recruiter feedback notes.
          </p>

          {/* Filter Tabs */}
          <div className="mt-6 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['ALL', 'APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 bg-slate-200/60 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No applications found</h3>
            <p className="text-xs text-slate-500 mt-1">You haven't submitted any applications under this filter.</p>
            <Link to="/jobs" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl">
              Browse Open Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => {
              const currentStepIdx = getStepIndex(app.status)
              const isRejected = app.status === 'REJECTED'
              const isWithdrawn = app.status === 'WITHDRAWN'

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128'}
                        alt={app.companyName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                      />
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{app.jobTitle}</h3>
                        <p className="text-xs text-slate-500">{app.companyName} &bull; {app.jobLocation}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {app.aiMatchScore && (
                        <div className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{app.aiMatchScore}% Match</span>
                        </div>
                      )}

                      <span className="text-xs text-slate-400">
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </span>

                      {app.status !== 'WITHDRAWN' && app.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Withdraw Application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status Timeline */}
                  {!isRejected && !isWithdrawn && (
                    <div className="py-6 px-2 sm:px-6">
                      <div className="flex items-center justify-between relative">
                        {/* Connecting bar */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-0"></div>
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-500 -z-0"
                          style={{
                            width: `${(Math.max(0, currentStepIdx) / (steps.length - 1)) * 100}%`
                          }}
                        ></div>

                        {steps.map((st, i) => {
                          const isDone = i <= currentStepIdx
                          const isCurrent = i === currentStepIdx
                          return (
                            <div key={st} className="flex flex-col items-center relative z-10">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                  isDone
                                    ? 'bg-blue-600 text-white ring-4 ring-blue-50'
                                    : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                {isDone ? '✓' : i + 1}
                              </div>
                              <span
                                className={`text-[10px] sm:text-xs mt-2 font-semibold whitespace-nowrap ${
                                  isCurrent ? 'text-blue-600' : isDone ? 'text-slate-800' : 'text-slate-400'
                                }`}
                              >
                                {st.replace('_', ' ')}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {isRejected && (
                    <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>This application was not selected to move forward. Continue exploring new roles.</span>
                    </div>
                  )}

                  {isWithdrawn && (
                    <div className="mt-4 p-3 rounded-xl bg-slate-100 text-xs text-slate-500 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>You withdrew this application.</span>
                    </div>
                  )}

                  {/* Recruiter Notes / AI explanation */}
                  {app.recruiterNotes && (
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <span className="font-bold text-slate-800">Recruiter Feedback: </span>
                      <span>{app.recruiterNotes}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
