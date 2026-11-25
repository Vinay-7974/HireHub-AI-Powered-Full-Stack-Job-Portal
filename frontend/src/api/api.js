import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to automatically attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hirehub_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for token expiration handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && currentPath !== '/') {
        localStorage.removeItem('hirehub_token')
        localStorage.removeItem('hirehub_user')
        window.location.href = '/login?expired=true'
      }
    }
    return Promise.reject(error)
  }
)

export default API

// Auth Services
export const authApi = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  refreshToken: (refreshToken) => API.post('/auth/refresh', { refreshToken }),
}

// Jobs Services
export const jobsApi = {
  getJobs: (params) => API.get('/jobs', { params }),
  getJobById: (id) => API.get(`/jobs/${id}`),
  getCategories: () => API.get('/jobs/categories'),
  getRecruiterJobs: (params) => API.get('/jobs/recruiter/my-jobs', { params }),
  createJob: (data) => API.post('/jobs', data),
  updateJob: (id, data) => API.put(`/jobs/${id}`, data),
  updateStatus: (id, status) => API.patch(`/jobs/${id}/status?status=${status}`),
  deleteJob: (id) => API.delete(`/jobs/${id}`),
}

// Companies Services
export const companiesApi = {
  getCompanies: (params) => API.get('/companies', { params }),
  getCompanyById: (id) => API.get(`/companies/${id}`),
  createCompany: (data) => API.post('/companies', data),
  updateCompany: (id, data) => API.put(`/companies/${id}`, data),
}

// Applications Services
export const applicationsApi = {
  apply: (data) => API.post('/applications', data),
  getMyApplications: (params) => API.get('/applications/my-applications', { params }),
  getJobApplications: (jobId, params) => API.get(`/applications/job/${jobId}`, { params }),
  getRecruiterApplications: (params) => API.get('/applications/recruiter/all', { params }),
  getApplicationById: (id) => API.get(`/applications/${id}`),
  updateStatus: (id, data) => API.patch(`/applications/${id}/status`, data),
  withdraw: (id) => API.delete(`/applications/${id}/withdraw`),
}

// User & Profile Services
export const userApi = {
  getCurrentUser: () => API.get('/users/me'),
  getJobSeekerProfile: () => API.get('/users/jobseeker/profile'),
  updateJobSeekerProfile: (data) => API.put('/users/jobseeker/profile', data),
  uploadResume: (formData) => API.post('/users/jobseeker/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getRecruiterProfile: () => API.get('/users/recruiter/profile'),
  updateRecruiterProfile: (data) => API.put('/users/recruiter/profile', data),
  
  // Saved Jobs
  saveJob: (jobId) => API.post(`/users/saved-jobs/${jobId}`),
  unsaveJob: (jobId) => API.delete(`/users/saved-jobs/${jobId}`),
  getSavedJobs: (params) => API.get('/users/saved-jobs', { params }),

  // Alerts
  getAlerts: (params) => API.get('/users/alerts', { params }),
  createAlert: (data) => API.post('/users/alerts', data),
  deleteAlert: (id) => API.delete(`/users/alerts/${id}`),
}

// Interviews Services
export const interviewsApi = {
  schedule: (data) => API.post('/interviews/schedule', data),
  getSeekerInterviews: (params) => API.get('/interviews/seeker', { params }),
  getRecruiterInterviews: (params) => API.get('/interviews/recruiter', { params }),
  updateStatus: (id, status) => API.patch(`/interviews/${id}/status?status=${status}`),
}

// AI Career Suite Services
export const aiApi = {
  analyzeResume: (data) => API.post('/ai/resume-analyzer', data),
  matchJob: (data) => API.post('/ai/job-match', data),
  generateCoverLetter: (data) => API.post('/ai/cover-letter', data),
  generateInterviewPrep: (data) => API.post('/ai/interview-prep', data),
  careerChat: (data) => API.post('/ai/career-chat', data),
  analyzeSkillGap: (data) => API.post('/ai/skill-gap', data),
}

// Notifications Services
export const notificationsApi = {
  getNotifications: (params) => API.get('/notifications', { params }),
  getUnreadCount: () => API.get('/notifications/unread-count'),
  markAsRead: (id) => API.patch(`/notifications/${id}/read`),
  markAllAsRead: () => API.patch('/notifications/read-all'),
}

// Admin Services
export const adminApi = {
  getAnalytics: () => API.get('/admin/analytics'),
  getUsers: (params) => API.get('/admin/users', { params }),
  toggleUserStatus: (id, active) => API.patch(`/admin/users/${id}/status?active=${active}`),
  getAllJobs: (params) => API.get('/admin/jobs', { params }),
  deleteJob: (id) => API.delete(`/admin/jobs/${id}`),
  verifyCompany: (id, verified) => API.patch(`/admin/companies/${id}/verify?verified=${verified}`),
}
