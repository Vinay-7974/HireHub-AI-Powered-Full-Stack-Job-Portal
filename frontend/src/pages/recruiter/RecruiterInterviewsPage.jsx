import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { interviewsApi } from '../../api/api'
import {
  Calendar,
  Clock,
  Video,
  User,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Filter,
  Plus
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function RecruiterInterviewsPage() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')

  const fetchInterviews = async () => {
    setLoading(true)
    try {
      const res = await interviewsApi.getRecruiterInterviews({ size: 50 })
      if (res.data?.success) {
        setInterviews(res.data.data.content || [])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load interviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInterviews()
  }, [])

  const handleStatusChange = async (id, status) => {
    try {
      await interviewsApi.updateStatus(id, status)
      toast.success(`Interview marked as ${status}`)
      setInterviews((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      )
    } catch (err) {
      console.error(err)
      toast.error('Failed to update interview status')
    }
  }

  const filteredInterviews = interviews.filter((item) =>
    statusFilter === 'ALL' ? true : item.status === statusFilter
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Scheduled
          </span>
        )
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Completed
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Cancelled
          </span>
        )
      case 'RESCHEDULED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Rescheduled
          </span>
        )
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Interview Coordination
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                {interviews.length} Scheduled Sessions
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track upcoming candidate evaluations, technical assessments, and panel syncs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/recruiter/applicants"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule from Pipeline</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Status Filter */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['ALL', 'SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'ALL' ? 'All Interviews' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Interviews List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Interviews Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
              There are no candidate interview sessions matching your selected filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredInterviews.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1">
                        {item.interviewType?.replace('_', ' ')}
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{item.jobTitle}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{item.companyName}</p>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">{item.applicantName}</span>
                        <span className="text-slate-400 ml-1.5">({item.applicantEmail})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="font-semibold text-slate-800">
                        {item.interviewDate
                          ? new Date(item.interviewDate).toLocaleString([], {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })
                          : 'TBD'}
                      </span>
                    </div>

                    {item.notes && (
                      <div className="text-[11px] text-slate-500 italic mt-1 pt-1.5 border-t border-slate-200/60">
                        "{item.notes}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  {item.meetingLink ? (
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Call</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">No link provided</span>
                  )}

                  <div className="flex items-center gap-1.5">
                    {item.status === 'SCHEDULED' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(item.id, 'COMPLETED')}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.id, 'CANCELLED')}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
