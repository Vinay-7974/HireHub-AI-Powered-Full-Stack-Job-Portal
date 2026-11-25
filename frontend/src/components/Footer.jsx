import React from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Sparkles, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Hire<span className="text-blue-600">Hub</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Find your future. Hire your potential. The next-generation full-stack AI career platform connecting ambitious talent with top technology companies.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-700">Spring Boot 3</span>
              <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-700">React 19</span>
              <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-700">MySQL 8</span>
              <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200">AI Powered</span>
            </div>
          </div>

          {/* Job Seekers */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-900">For Job Seekers</p>
            <ul className="space-y-2 text-xs">
              <li><Link to="/jobs" className="hover:text-blue-600 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/seeker/ai/resume-analyzer" className="hover:text-blue-600 transition-colors">AI Resume Analyzer</Link></li>
              <li><Link to="/seeker/ai/cover-letter" className="hover:text-blue-600 transition-colors">AI Cover Letter</Link></li>
              <li><Link to="/seeker/ai/interview-prep" className="hover:text-blue-600 transition-colors">Interview Prep</Link></li>
              <li><Link to="/seeker/dashboard" className="hover:text-blue-600 transition-colors">Candidate Hub</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-900">For Employers</p>
            <ul className="space-y-2 text-xs">
              <li><Link to="/recruiter/dashboard" className="hover:text-blue-600 transition-colors">Recruiter Dashboard</Link></li>
              <li><Link to="/recruiter/jobs" className="hover:text-blue-600 transition-colors">Post a Job</Link></li>
              <li><Link to="/recruiter/applicants" className="hover:text-blue-600 transition-colors">Applicant Ranking</Link></li>
              <li><Link to="/companies" className="hover:text-blue-600 transition-colors">Company Directory</Link></li>
              <li><Link to="/recruiter/interviews" className="hover:text-blue-600 transition-colors">Interview Scheduler</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-900">Platform</p>
            <ul className="space-y-2 text-xs">
              <li><a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">Swagger API Docs</a></li>
              <li><Link to="/admin/dashboard" className="hover:text-blue-600 transition-colors">Admin Console</Link></li>
              <li><span className="text-slate-400">Security & Privacy</span></li>
              <li><span className="text-slate-400">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>&copy; {new Date().getFullYear()} HireHub Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision for top-tier software engineering teams.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
