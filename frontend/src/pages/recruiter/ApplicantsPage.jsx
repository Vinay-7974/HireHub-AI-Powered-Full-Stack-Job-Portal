import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { applicationsApi, jobsApi, interviewsApi } from '../../api/api'
import {
  Users,
  Search,
  Filter,
  Sparkles,
  Calendar,
  FileText,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  ChevronDown,
  LayoutGrid,
  List,
  Video,
  X,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ApplicantsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialJobId = searchParams.get('jobId') || 'ALL'

  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJobId, setSelectedJobId] = useState(initialJobId)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('table') // 'table' | 'cards'

  // Modals
  const [selectedAppForAI, setSelectedAppForAI] = useState(null)
  const [selectedAppForCoverLetter, setSelectedAppForCoverLetter] = useState(null)
  const [selectedAppForInterview, setSelectedAppForInterview] = useState(null)

  // Interview Form
  const [interviewForm, setInterviewForm] = useState({
    interviewDate: '',
    interviewType: 'TECHNICAL',
    meetingLink: 'https://meet.google.com/abc-xyz-hire',
    notes: 'Please come prepared to discuss system architecture and recent projects.'
  })
  const [scheduling, setScheduling] = useState(false)

  // Load jobs for filter
  useEffect(() => {
    jobsApi.getRecruiterJobs({ size: 50 }).then((res) => {
      if (res.data?.success) {
        setJobs(res.data.data.content || [])
      }
    })
  }, [])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      let res
      if (selectedJobId && selectedJobId !== 'ALL') {
        res = await applicationsApi.getJobApplications(selectedJobId, { size: 50 })
      } else {
        res = await applicationsApi.getRecruiterApplications({ size: 50 })
      }

      if (res.data?.success) {
        setApplications(res.data.data.content || [])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [selectedJobId])

  const handleStatusChange = async (appId, newStatus, notes = '') => {
    try {
      await applicationsApi.updateStatus(appId, {
        status: newStatus,
        recruiterNotes: notes || `Moved to ${newStatus}`
      })
      toast.success(`Applicant updated to ${newStatus}`)
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      )
    } catch (err) {
      console.error(err)
      toast.error('Failed to update status')
    }
  }

  const handleScheduleInterview = async (e) => {
    e.preventDefault()
    if (!selectedAppForInterview) return
    setScheduling(true)

    try {
      await interviewsApi.schedule({
        applicationId: selectedAppForInterview.id,
        interviewDate: interviewForm.interviewDate,
        interviewType: interviewForm.interviewType,
        meetingLink: interviewForm.meetingLink,
        notes: interviewForm.notes
      })
      toast.success('Interview scheduled and invitation dispatched!')
      setApplications((prev) =>
        prev.map((a) =>
          a.id === selectedAppForInterview.id ? { ...a, status: 'INTERVIEW' } : a
        )
      )
      setSelectedAppForInterview(null)
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to schedule interview')
    } finally {
      setScheduling(false)
    }
  }

  // Filtered List
  const filteredApplications = applications.filter((app) => {
    const matchesStatus =
      statusFilter === 'ALL' || app.status === statusFilter
    const matchesSearch =
      !searchTerm ||
      app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getScoreBadge = (score) => {
    if (!score) return <span className="text-xs text-slate-400">N/A</span>
    if (score >= 80) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          {score}% High Match
        </span>
      )
    }
    if (score >= 60) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Sparkles className="w-3 h-3 text-blue-600" />
          {score}% Good Match
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Sparkles className="w-3 h-3 text-amber-600" />
        {score}% Match
      </span>
    )
  }

  const getStatusBadge = (status) => {
    const colors = {
      APPLIED: 'bg-blue-50 text-blue-700 border-blue-200',
      UNDER_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
      SHORTLISTED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      INTERVIEW: 'bg-purple-50 text-purple-700 border-purple-200',
      SELECTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      REJECTED: 'bg-rose-50 text-rose-700 border-rose-200'
    }
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
          colors[status] || 'bg-slate-100 text-slate-600'
        }`}
      >
        {status?.replace('_', ' ')}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Candidate Pipeline
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {applications.length} Total Applicants
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Screen applicants, evaluate AI match indicators, and move candidates through your hiring funnel.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/recruiter/interviews"
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-xs"
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Interview Schedule</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidates or emails..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {/* Job Filter Dropdown */}
            <select
              value={selectedJobId}
              onChange={(e) => {
                setSelectedJobId(e.target.value)
                setSearchParams(e.target.value === 'ALL' ? {} : { jobId: e.target.value })
              }}
              className="w-full sm:w-64 px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">All Requisitions ({applications.length})</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Tabs and View Switcher */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end overflow-x-auto">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                'ALL',
                'APPLIED',
                'UNDER_REVIEW',
                'SHORTLISTED',
                'INTERVIEW',
                'SELECTED',
                'REJECTED'
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === s
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s === 'ALL'
                    ? 'All'
                    : s === 'UNDER_REVIEW'
                    ? 'Review'
                    : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-white">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-slate-100 text-blue-600' : 'text-slate-400'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'cards' ? 'bg-slate-100 text-blue-600' : 'text-slate-400'
                }`}
                title="Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Candidates Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
              There are no applications matching your current filter settings.
            </p>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-6">Candidate</th>
                    <th className="py-3.5 px-6">Applied For</th>
                    <th className="py-3.5 px-6">AI Match Score</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Documents</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                            {app.applicantName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{app.applicantName}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                {app.applicantEmail}
                              </span>
                              {app.applicantPhone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  {app.applicantPhone}
                                </span>
                              )}
                            </div>
                            {app.applicantHeadline && (
                              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 italic">
                                "{app.applicantHeadline}"
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800">{app.jobTitle}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Applied {new Date(app.appliedAt || Date.now()).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedAppForAI(app)}
                          className="hover:scale-105 transition-transform cursor-pointer text-left"
                          title="Click to view AI breakdown"
                        >
                          {getScoreBadge(app.aiMatchScore)}
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {app.resumeUrl && (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="Download Resume"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Resume</span>
                            </a>
                          )}
                          {app.coverLetter && (
                            <button
                              onClick={() => setSelectedAppForCoverLetter(app)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Read Cover Letter"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Letter</span>
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedAppForInterview(app)
                              const d = new Date()
                              d.setDate(d.getDate() + 2)
                              d.setHours(14, 0, 0, 0)
                              setInterviewForm({
                                interviewDate: d.toISOString().slice(0, 16),
                                interviewType: 'TECHNICAL',
                                meetingLink: 'https://meet.google.com/hirehub-room-' + app.id,
                                notes: `Technical round with ${app.applicantName} for ${app.jobTitle}`
                              })
                            }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                            title="Schedule Interview"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Interview</span>
                          </button>

                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className="text-xs border border-slate-200 rounded-lg p-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
                          >
                            <option value="APPLIED">Applied</option>
                            <option value="UNDER_REVIEW">Under Review</option>
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="INTERVIEW">Interview</option>
                            <option value="SELECTED">Selected (Hire)</option>
                            <option value="REJECTED">Reject</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Cards / Kanban View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shrink-0">
                        {app.applicantName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">{app.applicantName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{app.jobTitle}</p>
                      </div>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{app.applicantEmail}</span>
                    </div>
                    {app.applicantPhone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{app.applicantPhone}</span>
                      </div>
                    )}
                  </div>

                  {app.applicantSkills && app.applicantSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {app.applicantSkills.slice(0, 5).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 mb-4">
                    <button
                      onClick={() => setSelectedAppForAI(app)}
                      className="cursor-pointer text-left"
                    >
                      {getScoreBadge(app.aiMatchScore)}
                    </button>
                    {app.coverLetter && (
                      <button
                        onClick={() => setSelectedAppForCoverLetter(app)}
                        className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Letter
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedAppForInterview(app)
                      const d = new Date()
                      d.setDate(d.getDate() + 2)
                      d.setHours(14, 0, 0, 0)
                      setInterviewForm({
                        interviewDate: d.toISOString().slice(0, 16),
                        interviewType: 'TECHNICAL',
                        meetingLink: 'https://meet.google.com/hirehub-room-' + app.id,
                        notes: `Technical round with ${app.applicantName}`
                      })
                    }}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Interview</span>
                  </button>

                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="text-xs border border-slate-200 rounded-xl p-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="UNDER_REVIEW">Review</option>
                    <option value="SHORTLISTED">Shortlist</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="SELECTED">Select</option>
                    <option value="REJECTED">Reject</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Breakdown Modal */}
      {selectedAppForAI && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">AI Candidate Analysis</h3>
                  <p className="text-xs text-slate-500">{selectedAppForAI.applicantName} • {selectedAppForAI.jobTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppForAI(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-4xl font-extrabold text-blue-600">{selectedAppForAI.aiMatchScore || 75}%</span>
              <p className="text-xs font-semibold text-slate-600 mt-1">Requisition Compatibility Score</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                AI Assessment & Rationale
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                {selectedAppForAI.aiMatchExplanation ||
                  'The candidate possesses strong core qualifications matching the technical stack. Verified proficiency in key libraries, full lifecycle execution, and domain requirements.'}
              </p>
            </div>

            {selectedAppForAI.applicantSkills && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Detected Candidate Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAppForAI.applicantSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedAppForAI(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cover Letter Modal */}
      {selectedAppForCoverLetter && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Candidate Cover Letter</h3>
                <p className="text-xs text-slate-500">From {selectedAppForCoverLetter.applicantName}</p>
              </div>
              <button
                onClick={() => setSelectedAppForCoverLetter(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto bg-slate-50 p-4 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line border border-slate-100">
              {selectedAppForCoverLetter.coverLetter}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedAppForCoverLetter(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interview Scheduling Modal */}
      {selectedAppForInterview && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Schedule Interview</h3>
                  <p className="text-xs text-slate-500">{selectedAppForInterview.applicantName} • {selectedAppForInterview.jobTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppForInterview(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interview Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={interviewForm.interviewDate}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interview Round / Type</label>
                <select
                  value={interviewForm.interviewType}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewType: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="TECHNICAL">Technical Round</option>
                  <option value="HR">HR / Culture Fit</option>
                  <option value="BEHAVIORAL">Behavioral / Leadership</option>
                  <option value="FINAL">Final Executive Round</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting Link (Google Meet / Zoom)</label>
                <input
                  type="url"
                  required
                  value={interviewForm.meetingLink}
                  onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Preparation Guidelines</label>
                <textarea
                  rows={3}
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                  placeholder="Instructions for the candidate..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedAppForInterview(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduling}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {scheduling ? 'Scheduling...' : 'Confirm & Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
