import React, { useState, useEffect } from 'react'
import { aiApi, userApi } from '../../../api/api'
import toast from 'react-hot-toast'
import {
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Clock
} from 'lucide-react'

export default function SkillGapAnalyzer() {
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer')
  const [currentSkills, setCurrentSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    userApi.getJobSeekerProfile().then((res) => {
      if (res.data?.success && res.data.data.skills) {
        setCurrentSkills(res.data.data.skills)
        handleRunAnalysis(res.data.data.skills)
      }
    })
  }, [])

  const handleRunAnalysis = async (skillsToUse) => {
    setLoading(true)
    try {
      const res = await aiApi.analyzeSkillGap({
        targetRole,
        currentSkills: skillsToUse || currentSkills
      })
      if (res.data?.success) {
        setResult(res.data.data)
      }
    } catch (err) {
      toast.error('Failed to analyze skill gap')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Career Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Skill Gap & Career Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare your active profile skills against enterprise engineering expectations and receive a focused study plan.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Role Selector Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Target Engineering Role</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full text-xs sm:text-sm p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
            >
              <option value="Senior Full Stack Engineer">Senior Full Stack Engineer</option>
              <option value="Frontend Engineer (React & TypeScript)">Frontend Engineer (React & TypeScript)</option>
              <option value="Backend Engineer (Java & Spring Boot)">Backend Engineer (Java & Spring Boot)</option>
              <option value="Cloud / DevOps Engineer">Cloud / DevOps Engineer</option>
              <option value="AI / ML Infrastructure Engineer">AI / ML Infrastructure Engineer</option>
            </select>
          </div>

          <button
            onClick={() => handleRunAnalysis()}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 self-end"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Skill Gap</span>
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Readiness card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Target Readiness Score
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{result.targetRole}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Based on your listed technologies and industry benchmarks.</p>
              </div>
              <div className="text-4xl font-extrabold text-purple-600">
                {result.readinessScore}%
              </div>
            </div>

            {/* Skills breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Existing Matching Skills ({result.matchingSkills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchingSkills?.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-purple-600" /> Missing High-Priority Skills ({result.missingSkills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingSkills?.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                      + {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Structured Learning Roadmap */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" /> Recommended Learning Roadmap
              </h3>
              <p className="text-xs text-slate-500">
                Prioritized timeline to bridge technical gaps and accelerate qualification for {result.targetRole}.
              </p>

              <div className="space-y-3 pt-2">
                {result.learningRoadmap?.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-slate-900">{step.skill}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          step.priority === 'High'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {step.priority} Priority
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>{step.recommendedResources}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium shrink-0">
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      <span>{step.estimatedTimeToLearn}</span>
                    </div>
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
