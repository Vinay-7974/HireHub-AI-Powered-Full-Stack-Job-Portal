import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { aiApi } from '../../../api/api'
import toast from 'react-hot-toast'
import {
  Sparkles,
  Cpu,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Play
} from 'lucide-react'

export default function InterviewPrep() {
  const [searchParams] = useSearchParams()

  const [jobTitle, setJobTitle] = useState(searchParams.get('role') || 'Senior Full Stack Engineer')
  const [experienceLevel, setExperienceLevel] = useState('SENIOR_LEVEL')
  const [loading, setLoading] = useState(false)
  const [prepData, setPrepData] = useState(null)
  const [expandedIndex, setExpandedIndex] = useState(0)
  const [practiceAnswers, setPracticeAnswers] = useState({})

  const handleGenerate = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    try {
      const res = await aiApi.generateInterviewPrep({
        jobTitle: jobTitle.trim(),
        experienceLevel
      })
      if (res.data?.success) {
        setPrepData(res.data.data)
        toast.success('Interview questions generated!')
      }
    } catch (err) {
      toast.error('Failed to generate interview preparation questions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGenerate()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Career Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Technical & Behavioral Interview Prep
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Practice realistic Technical, System Design, STAR Behavioral, and HR questions tailored to your position.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Role Configuration Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Target Position</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Lead Backend Engineer"
                className="w-full text-xs sm:text-sm p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
              />
            </div>

            <div className="sm:w-48">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full text-xs sm:text-sm p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none cursor-pointer"
              >
                <option value="ENTRY_LEVEL">Entry Level</option>
                <option value="MID_LEVEL">Mid Level</option>
                <option value="SENIOR_LEVEL">Senior Level</option>
                <option value="LEAD">Lead / Staff</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 self-end"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Regenerate Questions</span>
              </>
            )}
          </button>
        </div>

        {/* Questions list */}
        {prepData && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              Practice Questions for {prepData.jobTitle}
            </h2>

            <div className="space-y-4">
              {prepData.questions?.map((item, idx) => {
                const isExpanded = expandedIndex === idx

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
                  >
                    {/* Accordion header */}
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? -1 : idx)}
                      className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 mb-1">
                            {item.category}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                            {item.question}
                          </h3>
                        </div>
                      </div>
                      <div className="p-1 rounded-lg text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {/* Collapsible Content */}
                    {isExpanded && (
                      <div className="p-5 pt-0 border-t border-slate-100 space-y-4 bg-slate-50/30">
                        {/* Practice Mode text area */}
                        <div>
                          <label className="text-xs font-semibold text-slate-700 mb-1 block">
                            Practice Your Answer:
                          </label>
                          <textarea
                            rows={3}
                            value={practiceAnswers[idx] || ''}
                            onChange={(e) =>
                              setPracticeAnswers({ ...practiceAnswers, [idx]: e.target.value })
                            }
                            placeholder="Type your talking points or answer here before checking the sample solution..."
                            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 text-slate-800"
                          ></textarea>
                        </div>

                        {/* Model answer */}
                        <div className="p-4 rounded-xl bg-white border border-slate-200">
                          <span className="text-xs font-bold text-slate-900 block mb-1">
                            Sample Recommended Answer:
                          </span>
                          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                            {item.sampleAnswer}
                          </p>
                        </div>

                        {/* Key tip */}
                        {item.keyTip && (
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">Interviewer Tip: </span>
                              {item.keyTip}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* General Tips */}
            {prepData.generalTips?.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Proven Technical Interview Guidelines
                </h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {prepData.generalTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">&bull;</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
