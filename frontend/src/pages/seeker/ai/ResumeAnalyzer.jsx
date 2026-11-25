import React, { useState, useEffect } from 'react'
import { aiApi, userApi } from '../../../api/api'
import toast from 'react-hot-toast'
import {
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  ShieldCheck
} from 'lucide-react'

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('')
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    userApi.getJobSeekerProfile().then((res) => {
      if (res.data?.success && res.data.data.resumeText) {
        setResumeText(res.data.data.resumeText)
      } else if (res.data?.success) {
        const skills = res.data.data.skills?.join(', ') || 'React, Java, Spring Boot, MySQL'
        setResumeText(`${res.data.data.fullName}. ${res.data.data.headline}. Skills: ${skills}. ${res.data.data.about || ''}`)
      }
    })
  }, [])

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault()
    if (!resumeText.trim()) {
      toast.error('Please enter or paste your resume text')
      return
    }

    setLoading(true)
    try {
      const res = await aiApi.analyzeResume({
        resumeText: resumeText.trim(),
        targetRole
      })
      if (res.data?.success) {
        setResult(res.data.data)
        toast.success('Resume analyzed successfully!')
      }
    } catch (err) {
      toast.error('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    'Senior Full Stack Engineer',
    'Frontend Engineer (React)',
    'Backend Engineer (Java / Spring Boot)',
    'Cloud / DevOps Engineer',
    'Lead Software Architect'
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Career Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Resume & ATS Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Simulate recruiter and ATS screening algorithms. Discover missing keywords, score metrics, and formatting suggestions.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Input Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> Resume Content & Target Role
            </h2>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-500">Target Role:</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="text-xs font-semibold p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
              >
                {roleOptions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content, summary, skills, and work experience bullet points here..."
              className="w-full text-xs sm:text-sm p-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600/30 text-slate-800 font-mono"
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              * Supports plaintext markdown, bullet points, and extracted PDF text.
            </span>
            <button
              onClick={handleAnalyze}
              disabled={loading || !resumeText.trim()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Dashboard */}
        {result && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Quality Score</span>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">Demonstrated depth, accomplishments & impact.</p>
                </div>
                <div className="text-4xl font-extrabold text-blue-600">
                  {result.overallScore}<span className="text-base font-normal text-slate-400">/100</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ATS Compatibility Score</span>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">Parsability, section hierarchy & keyword coverage.</p>
                </div>
                <div className="text-4xl font-extrabold text-indigo-600">
                  {result.atsScore}<span className="text-base font-normal text-slate-400">/100</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Executive Summary</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {result.summary}
              </p>
            </div>

            {/* Skills: Detected vs Missing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Detected Keywords ({result.skillsDetected?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.skillsDetected?.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Missing Role Keywords ({result.missingSkills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingSkills?.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      + {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Profile Strengths
                </h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {result.strengths?.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Sections Needing Attention
                </h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {result.weakSections?.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-blue-600" /> Improvement Recommendations
              </h3>
              <div className="space-y-2.5">
                {result.improvementSuggestions?.map((sug, i) => (
                  <div key={i} className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-700">
                    <span className="font-bold text-blue-800 mr-1.5">{i + 1}.</span>
                    {sug}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
