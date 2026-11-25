import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jobsApi, companiesApi } from '../api/api'
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  Briefcase,
  Building2,
  DollarSign,
  Clock,
  CheckCircle2,
  TrendingUp,
  Star,
  Users,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [featuredJobs, setFeaturedJobs] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      jobsApi.getJobs({ page: 0, size: 6 }),
      companiesApi.getCompanies({ page: 0, size: 4 })
    ])
      .then(([jobsRes, compRes]) => {
        if (jobsRes.data?.success) setFeaturedJobs(jobsRes.data.data.content || [])
        if (compRes.data?.success) setCompanies(compRes.data.data.content || [])
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const query = new URLSearchParams()
    if (keyword) query.set('keyword', keyword)
    if (location) query.set('location', location)
    navigate(`/jobs?${query.toString()}`)
  }

  const popularTags = ['React', 'Spring Boot', 'Remote', 'Full Stack', 'Fintech', 'Java', 'Docker']

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-slate-50 pt-16 pb-20 border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/90 text-blue-700 text-xs font-semibold mb-8 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>AI-Driven Career Matching & Resume Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-[1.12]">
            Your next opportunity <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              starts here.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
            Discover jobs that match your skills. Build your career with AI-powered resume scoring, automated cover letters, and interview coaching.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="mt-10 w-full max-w-3xl bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-3 px-3 w-full border-b sm:border-b-0 sm:border-r border-slate-200 pb-2 sm:pb-0">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, skills, or company..."
                className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            <div className="flex-1 flex items-center gap-3 px-3 w-full pb-2 sm:pb-0">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (e.g. Remote, San Francisco)..."
                className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>Search Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular searches */}
          <div className="mt-5 flex items-center gap-2 flex-wrap justify-center text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Popular:</span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setKeyword(tag)
                  navigate(`/jobs?keyword=${tag}`)
                }}
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200/80 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-2xs"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Metric Stats Banner */}
          <div className="mt-14 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-6 bg-white/70 backdrop-blur-xs rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">45k+</div>
              <div className="text-xs text-slate-500 mt-0.5">Verified Tech Roles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">89%</div>
              <div className="text-xs text-slate-500 mt-0.5">ATS Match Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">3.2x</div>
              <div className="text-xs text-slate-500 mt-0.5">Faster Hiring Cycles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">12k+</div>
              <div className="text-xs text-slate-500 mt-0.5">Companies Hiring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Hand-Picked Opportunities</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Featured Positions</h2>
            <p className="text-sm text-slate-500 mt-1">Directly posted by premier technology engineering teams.</p>
          </div>
          <Link
            to="/jobs"
            className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View All Jobs</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-slate-200/70 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.slice(0, 6).map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128'}
                        alt={job.companyName}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-100 shadow-2xs"
                      />
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500">{job.companyName}</h4>
                        <Link
                          to={`/jobs/${job.id}`}
                          className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {job.title}
                        </Link>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.requiredSkills?.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills?.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-500">
                        +{job.requiredSkills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1 font-semibold text-slate-900">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[110px]">{job.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* AI Career Suite Highlights Section */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack AI Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Supercharge Your Job Search With AI</h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Don't apply blind. HireHub's native AI module analyzes your background, tailors your applications, and prepares you for technical rounds in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-blue-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">AI Resume & ATS Analyzer</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Scan your resume against target roles to get instant ATS compatibility scores, missing keyword detection, and actionable formatting guidance.
              </p>
              <Link
                to="/seeker/ai/resume-analyzer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                <span>Analyze Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-indigo-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Custom Cover Letter Generator</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Generate highly tailored, role-specific cover letters aligned with the company culture and your unique technical experience.
              </p>
              <Link
                to="/seeker/ai/cover-letter"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <span>Generate Cover Letter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Targeted Interview Prep</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Practice Technical, System Design, HR, and Behavioral questions customized for your target position with sample answers and key advice.
              </p>
              <Link
                to="/seeker/ai/interview-prep"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <span>Start Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How HireHub Works */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Simple & Powerful</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">How HireHub Works</h2>
          <p className="text-sm text-slate-500 mt-1">Connecting engineers and companies with transparent workflows.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center flex flex-col items-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-extrabold text-lg flex items-center justify-center mb-4 border border-blue-100">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Create & Optimize Profile</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Upload your resume, add your skills and experience, and let our AI optimize your profile for recruitment visibility.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center flex flex-col items-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-extrabold text-lg flex items-center justify-center mb-4 border border-indigo-100">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">AI Job Matching</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Our algorithm computes real-time match scores against job requirements so you apply with high confidence.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center flex flex-col items-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-extrabold text-lg flex items-center justify-center mb-4 border border-emerald-100">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Interview & Get Hired</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Receive status updates in real-time, get scheduled for video interviews, and land your ideal career opportunity.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-12 bg-slate-100/60 border-t border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Top Companies Hiring on HireHub</h3>
              <p className="text-xs text-slate-500">Explore engineering cultures and open requisitions.</p>
            </div>
            <Link to="/companies" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <span>All Companies</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div
                key={company.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <img
                  src={company.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128'}
                  alt={company.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{company.name}</h4>
                  <p className="text-xs text-slate-500 truncate">{company.industry} &bull; {company.location}</p>
                  <span className="inline-block mt-1 text-[11px] font-semibold text-blue-600">
                    {company.openJobsCount || 1} open positions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ready to find your next great role?
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Join thousands of developers using HireHub to optimize resumes, discover high-impact jobs, and accelerate their careers.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-md shadow-blue-600/20 transition-all"
            >
              Get Started for Free
            </Link>
            <Link
              to="/jobs"
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm transition-all"
            >
              Explore All Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
