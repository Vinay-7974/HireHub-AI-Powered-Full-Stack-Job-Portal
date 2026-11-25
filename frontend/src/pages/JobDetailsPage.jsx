import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { jobsApi, applicationsApi, userApi, aiApi } from '../api/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  Bookmark,
  Share2,
  CheckCircle2,
  ArrowLeft,
  Send,
  X,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react'

export default function JobDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isJobSeeker, user } = useAuth()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [matchModalOpen, setMatchModalOpen] = useState(false)
  const [applying, setApplying] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [aiMatchLoading, setAiMatchLoading] = useState(false)
  const [aiMatchResult, setAiMatchResult] = useState(null)

  useEffect(() => {
    jobsApi.getJobById(id)
      .then((res) => {
        if (res.data?.success) setJob(res.data.data)
      })
      .catch((err) => {
        toast.error('Failed to load job details')
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save this job')
      return
    }
    try {
      if (job.saved) {
        await userApi.unsaveJob(job.id)
        toast.success('Removed from saved jobs')
        setJob({ ...job, saved: false })
      } else {
        await userApi.saveJob(job.id)
        toast.success('Job saved successfully')
        setJob({ ...job, saved: true })
      }
    } catch (err) {
      toast.error('Failed to update bookmark')
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Job link copied to clipboard!')
  }

  const handleOpenApplyModal = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to apply')
      navigate('/login')
      return
    }
    if (!isJobSeeker) {
      toast.error('Only Job Seeker accounts can submit applications. Use the demo persona switcher in the navbar!')
      return
    }
    setApplyModalOpen(true)
  }

  const handleApplySubmit = async (e) => {
    e.preventDefault()
    setApplying(true)
    try {
      const res = await applicationsApi.apply({
        jobId: job.id,
        coverLetter: coverLetter.trim()
      })
      if (res.data?.success) {
        toast.success('Application submitted successfully!')
        setJob({ ...job, hasApplied: true })
        setApplyModalOpen(false)
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application'
      toast.error(msg)
    } finally {
      setApplying(false)
    }
  }

  const handleRunAiMatch = async () => {
    setMatchModalOpen(true)
    if (aiMatchResult) return

    setAiMatchLoading(true)
    try {
      const res = await aiApi.matchJob({
        jobId: job.id,
        jobDescription: job.description
      })
      if (res.data?.success) {
        setAiMatchResult(res.data.data)
      }
    } catch (err) {
      toast.error('Could not compute AI match score')
    } finally {
      setAiMatchLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500">Loading job specifications...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-bold text-slate-900">Job Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The position you are looking for may have expired or been closed.</p>
        <Link to="/jobs" className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl">
          Back to Jobs
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Top Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <Link to="/jobs" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all jobs</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        {/* Header Hero Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128'}
                alt={job.companyName}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-xs shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-600">{job.companyName}</span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Employer
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  {job.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-slate-900">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k / year</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={handleRunAiMatch}
                className="px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI Match Score</span>
              </button>

              <button
                onClick={handleToggleSave}
                className={`p-2.5 rounded-xl border transition-colors ${
                  job.saved
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
                title="Save Job"
              >
                <Bookmark className={`w-4 h-4 ${job.saved ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
                title="Share Job"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {job.hasApplied ? (
                <div className="px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Applied</span>
                </div>
              ) : (
                <button
                  onClick={handleOpenApplyModal}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm shadow-sm transition-all"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Quick tags row */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
              {job.workMode?.replace('_', ' ')}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
              {job.employmentType?.replace('_', ' ')}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
              {job.experienceLevel?.replace('_', ' ')}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
              Category: {job.category || 'Tech'}
            </span>
          </div>
        </div>

        {/* Content Details Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details Body */}
          <div className="lg:col-span-2 space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs">
            {/* Description */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">About the Role</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">Key Responsibilities</h3>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {job.responsibilities}
                </div>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">Candidate Requirements</h3>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </div>
              </div>
            )}

            {/* Required Skills Matrix */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Required Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            {job.benefits && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">Benefits & Perks</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {job.benefits}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Company card & Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                Company Overview
              </h3>
              <div className="flex items-center gap-3">
                <img
                  src={job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128'}
                  alt={job.companyName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{job.companyName}</h4>
                  <p className="text-xs text-slate-500">{job.companyLocation}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Applications:</span>
                  <span className="font-semibold text-slate-800">{job.applicantsCount} candidates</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Recruiter:</span>
                  <span className="font-semibold text-slate-800">{job.recruiterName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Application Deadline:</span>
                  <span className="font-semibold text-slate-800">{job.deadline || 'Open until filled'}</span>
                </div>
              </div>

              <Link
                to={`/companies`}
                className="w-full mt-2 py-2 block text-center rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors border border-slate-200"
              >
                View Company Profile
              </Link>
            </div>

            {/* AI Callout banner */}
            <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-md shadow-blue-500/10">
              <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Want to stand out?</span>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed mb-4">
                Use our AI Cover Letter tool to craft a personalized introduction matching {job.companyName}'s requirements.
              </p>
              <Link
                to={`/seeker/ai/cover-letter?jobTitle=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.companyName)}`}
                className="px-3 py-2 bg-white text-blue-700 rounded-lg text-xs font-bold inline-block hover:bg-blue-50 transition-colors"
              >
                Generate Cover Letter
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Apply to {job.companyName}</h3>
                <p className="text-xs text-slate-500">{job.title}</p>
              </div>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Applicant</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">{user?.fullName}</div>
                    <div className="text-slate-500">{user?.email}</div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Profile Attached
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Cover Letter (Optional)</label>
                  <Link
                    to={`/seeker/ai/cover-letter?jobTitle=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.companyName)}`}
                    target="_blank"
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-Generate with AI
                  </Link>
                </div>
                <textarea
                  rows={6}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself, explain why you are interested in this position, and highlight key accomplishments..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-800"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {applying ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Match Modal */}
      {matchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">AI Compatibility Analysis</h3>
              </div>
              <button
                onClick={() => setMatchModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {aiMatchLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-500 font-medium">Evaluating candidate profile against requirements...</p>
                </div>
              ) : aiMatchResult ? (
                <div className="space-y-4">
                  {/* Gauge */}
                  <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-blue-800">Match Percentage</span>
                      <p className="text-xs text-slate-600 mt-0.5">Based on required tech stack & background</p>
                    </div>
                    <div className="text-3xl font-extrabold text-blue-600">
                      {aiMatchResult.matchPercentage}%
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {aiMatchResult.matchExplanation}
                  </p>

                  {/* Matching skills */}
                  {aiMatchResult.matchingSkills?.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-slate-700 block mb-1.5">Matching Competencies</span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiMatchResult.matchingSkills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium">
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing skills */}
                  {aiMatchResult.missingSkills?.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-slate-700 block mb-1.5">Skills to Highlight or Learn</span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiMatchResult.missingSkills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[11px] font-medium">
                            • {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setMatchModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
