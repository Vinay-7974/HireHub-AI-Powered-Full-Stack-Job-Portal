import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userApi } from '../../api/api'
import toast from 'react-hot-toast'
import { Bookmark, MapPin, DollarSign, Trash2, ArrowRight } from 'lucide-react'

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSaved = () => {
    setLoading(true)
    userApi.getSavedJobs({ size: 30 })
      .then((res) => {
        if (res.data?.success) setSavedJobs(res.data.data.content || [])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchSaved()
  }, [])

  const handleUnsave = async (jobId) => {
    try {
      await userApi.unsaveJob(jobId)
      toast.success('Job removed from saved list')
      setSavedJobs((prev) => prev.filter((j) => j.id !== jobId))
    } catch (err) {
      toast.error('Failed to remove bookmark')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved Jobs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Positions you have bookmarked for review and future application.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 bg-slate-200/60 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No saved jobs</h3>
            <p className="text-xs text-slate-500 mt-1">Bookmark positions while searching to easily access them here.</p>
            <Link to="/jobs" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl">
              Find Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128'}
                    alt={job.companyName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-500">{job.companyName}</span>
                    <Link to={`/jobs/${job.id}`} className="text-base font-bold text-slate-900 hover:text-blue-600 block">
                      {job.title}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>{job.location}</span>
                      <span>&bull;</span>
                      <span className="font-semibold text-slate-900">${(job.salaryMin / 1000).toFixed(0)}k+</span>
                      <span>&bull;</span>
                      <span className="text-blue-600 font-medium">{job.workMode}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleUnsave(job.id)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>View & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
