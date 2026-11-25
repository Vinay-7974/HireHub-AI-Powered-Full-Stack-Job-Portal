import React, { useState, useEffect } from 'react'
import { userApi, companiesApi } from '../../api/api'
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Briefcase,
  CheckCircle,
  Upload,
  Save,
  Link as LinkIcon,
  ShieldCheck,
  Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function CompanySettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [companyId, setCompanyId] = useState(null)
  const [recruiterData, setRecruiterData] = useState({
    fullName: '',
    phone: '',
    designation: '',
    department: ''
  })
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    industry: 'SaaS / DevTools',
    companySize: '100-500 employees',
    location: 'San Francisco, CA',
    logo: '',
    coverImage: '',
    linkedinUrl: '',
    twitterUrl: ''
  })

  useEffect(() => {
    fetchProfileAndCompany()
  }, [])

  const fetchProfileAndCompany = async () => {
    setLoading(true)
    try {
      const recRes = await userApi.getRecruiterProfile()
      if (recRes.data?.success && recRes.data.data) {
        const rec = recRes.data.data
        setRecruiterData({
          fullName: rec.fullName || '',
          phone: rec.phone || '',
          designation: rec.designation || '',
          department: rec.department || ''
        })

        if (rec.companyId) {
          setCompanyId(rec.companyId)
          const compRes = await companiesApi.getCompanyById(rec.companyId)
          if (compRes.data?.success && compRes.data.data) {
            const comp = compRes.data.data
            setFormData({
              name: comp.name || '',
              description: comp.description || '',
              website: comp.website || '',
              industry: comp.industry || 'SaaS / DevTools',
              companySize: comp.companySize || '100-500 employees',
              location: comp.location || 'San Francisco, CA',
              logo: comp.logo || '',
              coverImage: comp.coverImage || '',
              linkedinUrl: comp.linkedinUrl || '',
              twitterUrl: comp.twitterUrl || ''
            })
          }
        }
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load profile details')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // 1. Update recruiter personal info
      await userApi.updateRecruiterProfile({
        phone: recruiterData.phone,
        designation: recruiterData.designation,
        department: recruiterData.department
      })

      // 2. Update company info if companyId exists
      if (companyId) {
        await companiesApi.updateCompany(companyId, formData)
      }

      toast.success('Company and recruiter profile saved successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to update company settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Company & Recruiter Profile
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                Verified Employer
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Customize how your organization appears to job seekers on public company cards and job listings.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {loading ? (
          <div className="h-96 bg-white rounded-2xl border border-slate-200 animate-pulse" />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Live Card Preview */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
              <div
                className="h-32 w-full bg-gradient-to-r from-blue-600 to-indigo-700 relative"
                style={{
                  backgroundImage: formData.coverImage ? `url(${formData.coverImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-slate-900/20" />
              </div>

              <div className="p-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex items-end gap-4 -mt-10">
                  <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                    {formData.logo ? (
                      <img
                        src={formData.logo}
                        alt="Company Logo"
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <Building2 className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                  <div className="mb-1">
                    <h2 className="text-xl font-extrabold text-slate-900">{formData.name || 'Company Name'}</h2>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{formData.industry}</span>
                      <span>•</span>
                      <span>{formData.location}</span>
                    </p>
                  </div>
                </div>

                {formData.website && (
                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 self-start sm:self-end mb-1"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Visit Website
                  </a>
                )}
              </div>
            </div>

            {/* Company Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Organization Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://company.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g. Fintech, Cloud Infrastructure"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Size</label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="1-10 employees">1-10 employees</option>
                    <option value="11-50 employees">11-50 employees</option>
                    <option value="51-200 employees">51-200 employees</option>
                    <option value="201-500 employees">201-500 employees</option>
                    <option value="500+ employees">500+ employees</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Headquarters Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA / London, UK"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Logo URL (CDN or Hosted Image)</label>
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cover Banner URL</label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Company Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your company mission, product, culture, and value proposition..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Recruiter Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                Your Recruiter Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={recruiterData.fullName}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Direct Phone</label>
                  <input
                    type="tel"
                    value={recruiterData.phone}
                    onChange={(e) => setRecruiterData({ ...recruiterData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Job Title / Designation</label>
                  <input
                    type="text"
                    value={recruiterData.designation}
                    onChange={(e) => setRecruiterData({ ...recruiterData, designation: e.target.value })}
                    placeholder="e.g. Lead Technical Recruiter"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={recruiterData.department}
                    onChange={(e) => setRecruiterData({ ...recruiterData, department: e.target.value })}
                    placeholder="e.g. Talent Acquisition"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
