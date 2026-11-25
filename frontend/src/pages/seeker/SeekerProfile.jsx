import React, { useState, useEffect } from 'react'
import { userApi } from '../../api/api'
import toast from 'react-hot-toast'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  Globe,
  Link2,
  Code2,
  FileText,
  Upload,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  GraduationCap
} from 'lucide-react'

export default function SeekerProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [uploadingResume, setUploadingResume] = useState(false)

  useEffect(() => {
    userApi.getJobSeekerProfile()
      .then((res) => {
        if (res.data?.success) setProfile(res.data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await userApi.updateJobSeekerProfile(profile)
      if (res.data?.success) {
        setProfile(res.data.data)
        toast.success('Profile updated successfully!')
      }
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleAddSkill = () => {
    if (!newSkill.trim()) return
    const skill = newSkill.trim()
    if (!profile.skills.includes(skill)) {
      setProfile({ ...profile, skills: [...profile.skills, skill] })
    }
    setNewSkill('')
  }

  const handleRemoveSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove)
    })
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploadingResume(true)
    try {
      const res = await userApi.uploadResume(formData)
      if (res.data?.success) {
        setProfile(res.data.data)
        toast.success('Resume uploaded & indexed successfully!')
      }
    } catch (err) {
      toast.error('Failed to upload resume file')
    } finally {
      setUploadingResume(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Candidate Profile & Resume
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Keep your experience, technical skills, and resume updated for automated AI matching.
            </p>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Resume Manager Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" /> Resume Document
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Upload your latest resume (PDF or DOCX). Used for 1-click applications and AI ATS keyword scoring.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {profile?.resumeOriginalName || 'No resume uploaded yet'}
                </h4>
                <p className="text-xs text-slate-500">
                  {profile?.resumeUrl ? 'Active on file & ready for AI ATS analysis' : 'Upload PDF (max 10MB)'}
                </p>
              </div>
            </div>

            <label className="cursor-pointer px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-2">
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>{uploadingResume ? 'Uploading...' : 'Upload New Resume'}</span>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Basic Information Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Personal & Career Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profile?.fullName || ''}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600/30 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                disabled
                value={profile?.email || ''}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={profile?.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600/30 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Location</label>
              <input
                type="text"
                value={profile?.location || ''}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="e.g. San Francisco, CA"
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600/30 text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Headline</label>
              <input
                type="text"
                value={profile?.headline || ''}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                placeholder="e.g. Senior Full Stack Engineer | React & Spring Boot Specialist"
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600/30 text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Bio / About</label>
              <textarea
                rows={4}
                value={profile?.about || ''}
                onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                placeholder="Brief summary of your architectural background, core tech stack, and proudest accomplishments..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600/30 text-slate-900"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Technical Skills Chip Manager */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Core Technical Skills</span>
            <span className="text-xs font-medium text-slate-500">{profile?.skills?.length || 0} skills</span>
          </h2>
          <p className="text-xs text-slate-500">
            These skills are automatically indexed by the AI matching engine when comparing your profile to job requisitions.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {profile?.skills?.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-600 transition-colors"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-3 max-w-sm">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddSkill()
                }
              }}
              placeholder="Add skill (e.g. Docker, Kafka)..."
              className="flex-1 text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Social / Portfolio Links */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Portfolio & Social Profiles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" /> Portfolio Website
              </label>
              <input
                type="url"
                value={profile?.portfolioUrl || ''}
                onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                placeholder="https://yourdomain.com"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-blue-600" /> LinkedIn
              </label>
              <input
                type="url"
                value={profile?.linkedInUrl || ''}
                onChange={(e) => setProfile({ ...profile, linkedInUrl: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-slate-800" /> GitHub
              </label>
              <input
                type="url"
                value={profile?.gitHubUrl || ''}
                onChange={(e) => setProfile({ ...profile, gitHubUrl: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
