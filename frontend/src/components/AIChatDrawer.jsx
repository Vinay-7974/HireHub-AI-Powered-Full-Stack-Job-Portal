import React, { useState, useRef, useEffect } from 'react'
import { aiApi } from '../api/api'
import { Sparkles, MessageSquare, Send, X, Bot, User, Minimize2, Maximize2, RefreshCw } from 'lucide-react'

export default function AIChatDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [messages, setMessages] = useState([
    {
      id: 0,
      senderRole: 'assistant',
      content: "Hello! I am your HireHub AI Career Assistant. How can I help your career or job search journey today?",
      createdAt: new Date().toISOString()
    }
  ])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async (textToSend) => {
    const text = textToSend || message
    if (!text.trim() || loading) return

    const userMsg = {
      id: Date.now(),
      senderRole: 'user',
      content: text,
      createdAt: new Date().toISOString()
    }

    setMessages((prev) => [...prev, userMsg])
    setMessage('')
    setLoading(true)

    try {
      const res = await aiApi.careerChat({
        conversationId,
        message: text
      })

      if (res.data?.success) {
        const data = res.data.data
        if (data.conversationId) setConversationId(data.conversationId)

        const assistantMsg = {
          id: Date.now() + 1,
          senderRole: 'assistant',
          content: data.reply,
          createdAt: new Date().toISOString()
        }
        setMessages((prev) => [...prev, assistantMsg])
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          senderRole: 'assistant',
          content: "I encountered an error connecting to the AI career service. Please try again.",
          createdAt: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const promptShortcuts = [
    "How do I optimize my resume for ATS?",
    "Tips for behavioral interview questions",
    "How should I negotiate a counter-offer?",
    "Top skills for Senior Full Stack Engineer"
  ]

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-medium text-xs sm:text-sm shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-blue-200 animate-spin" />
          <span>Ask AI Assistant</span>
        </button>
      )}

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                  HireHub AI Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </h3>
                <p className="text-[10px] text-slate-300">Resume, match & interview coach</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {promptShortcuts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="shrink-0 px-2.5 py-1 text-[11px] rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-colors whitespace-nowrap shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.senderRole === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.senderRole === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] text-xs sm:text-sm leading-relaxed ${
                    m.senderRole === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs whitespace-pre-line'
                  }`}
                >
                  {m.content}
                </div>
                {m.senderRole === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    U
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5 items-center text-xs text-slate-400">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about resumes, interviews, or jobs..."
              disabled={loading}
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-slate-100/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
            />
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white shadow-xs transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
