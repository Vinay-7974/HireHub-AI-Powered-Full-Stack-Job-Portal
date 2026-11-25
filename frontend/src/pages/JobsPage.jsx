import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { jobsApi, userApi } from '../api/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Filter,
  Bookmark,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Clock,
  X
} from 'lucide-react'

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAuthenticated, isJobSeeker } = useAuth()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  // Filters state
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [workMode, setWorkMode] = useState(searchParams.get('workMode') || '')
  const [employmentType, setEmploymentType] = useState(searchParams.get('employmentType') || '')
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = {
        page,
        size: 9,
        sortBy,
        sortDir,
      }
      if (keyword) params.keyword = keyword
      if (location) params.location = location
      if (workMode) params.workMode = workMode
      if (employmentType) params.employmentType = employmentType
      if (experienceLevel) params.experienceLevel = experienceLevel
      if (category) params.category = category
      if (minSalary) params.minSalary = minSalary

      const res = await jobsApi.getJobs(params)
      if (res.data?.success) {
        setJobs(res.data.data.content || [])
        setTotalPages(res.data.data.totalPages || 0)
        setTotalElements(res.data.data.totalElements || 0)
      }
    } catch (err) {
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    jobsApi.getCategories().then((res) => {
      if (res.data?.success) setCategories(res.data.data || [])
    })
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [page, sortBy, sortDir, workMode, employmentType, experienceLevel, category])

  const handleFilterSubmit = (e) => {
    if (e) e.preventDefault()
    setPage(0)
    fetchJobs()
  }

  const handleClearFilters = () => {
    setKeyword('')
    setLocation('')
    setWorkMode('')
    setEmploymentType('')
    setExperienceLevel('')
    setCategory('')
    setMinSalary('')
    setPage(0)
  }

  const handleToggleSave = async (jobId, isSaved) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save jobs')
      return
    }
    try {
      if (isSaved) {
        await userApi.unsaveJob(jobId)
        toast.success('Job removed from saved list')
      } else {
        await userApi.saveJob(jobId)
        toast.success('Job saved successfully')
      }
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, saved: !isSaved } : j))
      )
    } catch (err) {
      toast.error('Failed to update saved job status')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Search Header Banner */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover {totalElements} verified technology jobs tailored for modern engineering roles.
          </p>

          {/* Quick Search Row */}
          <form onSubmit={handleFilterSubmit} className="mt-6 flex flex-col md:flex-row gap-2.5">
            <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, tech skills (e.g. React, Spring Boot)..."
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-slate-900"
              />
            </div>

            <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (e.g. Remote, San Francisco)..."
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm transition-all shrink-0"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </form>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`w-full md:w-64 shrink-0 space-y-6 ${
              mobileFilterOpen ? 'block' : 'hidden md:block'
            }`}
          >
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" /> Filter Jobs
                </span>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Reset
                </button>
              </div>

              {/* Work Mode */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">Work Mode</label>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {['', 'REMOTE', 'HYBRID', 'ON_SITE'].map((mode) => (
                    <label key={mode} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="workMode"
                        checked={workMode === mode}
                        onChange={() => setWorkMode(mode)}
                        className="text-blue-600 focus:ring-blue-500 rounded-sm"
                      />
                      <span>{mode === '' ? 'All Modes' : mode.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Employment Type */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">Employment Type</label>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {['', 'FULL_TIME', 'CONTRACT', 'INTERNSHIP', 'PART_TIME'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="employmentType"
                        checked={employmentType === type}
                        onChange={() => setEmploymentType(type)}
                        className="text-blue-600 focus:ring-blue-500 rounded-sm"
                      />
                      <span>{type === '' ? 'All Types' : type.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">Experience Level</label>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {['', 'ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR_LEVEL', 'LEAD', 'EXECUTIVE'].map((lvl) => (
                    <label key={lvl} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="experienceLevel"
                        checked={experienceLevel === lvl}
                        onChange={() => setExperienceLevel(lvl)}
                        className="text-blue-600 focus:ring-blue-500 rounded-sm"
                      />
                      <span>{lvl === '' ? 'All Levels' : lvl.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Minimum Salary */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">Minimum Salary ($)</label>
                <input
                  type="number"
                  step="10000"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  placeholder="e.g. 120000"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleFilterSubmit}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Job Results Grid */}
          <main className="flex-1 min-w-0">
            {/* Sorting bar */}
            <div className="mb-6 flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-medium text-slate-500">
                Showing <strong className="text-slate-900">{jobs.length}</strong> of{' '}
                <strong className="text-slate-900">{totalElements}</strong> jobs
              </span>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="createdAt">Date Posted</option>
                  <option value="viewsCount">Most Popular</option>
                  <option value="salaryMax">Highest Salary</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-64 bg-slate-200/60 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No jobs match your criteria</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try broadening your keyword or clearing filters to see more results.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-medium hover:bg-blue-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Company Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128'}
                            alt={job.companyName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-2xs"
                          />
                          <div>
                            <span className="text-[11px] font-semibold text-slate-500">{job.companyName}</span>
                            <Link
                              to={`/jobs/${job.id}`}
                              className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 block"
                            >
                              {job.title}
                            </Link>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleSave(job.id, job.saved)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            job.saved
                              ? 'bg-blue-50 border-blue-200 text-blue-600'
                              : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                          }`}
                          title="Bookmark Job"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${job.saved ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
                          {job.workMode?.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600">
                          {job.employmentType?.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600">
                          {job.experienceLevel?.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Description excerpt */}
                      <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Required skills */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {job.requiredSkills?.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.requiredSkills?.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                            +{job.requiredSkills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-0.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <span>${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k</span>
                      </div>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 group-hover:bg-blue-600 text-white font-medium text-[11px] shadow-2xs transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-slate-600 px-3">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
