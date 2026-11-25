# HireHub — Complete Feature Documentation

## 1. Feature Status Summary Matrix

| Feature Module | Implementation Status | Target Role | Verification State |
| :--- | :--- | :--- | :--- |
| **Public Landing Page** | Completed & Verified | All Visitors | Verified in browser & screenshots |
| **Multi-Filter Job Search** | Completed & Verified | All Visitors | Verified with MySQL full-text & filters |
| **Job Details & Real-Time AI Match** | Completed & Verified | Job Seekers | Verified with real API calculations |
| **1-Click Persona Switcher** | Completed & Verified | All Users | Verified with pre-seeded demo accounts |
| **Seeker Dashboard & Profile** | Completed & Verified | `ROLE_JOB_SEEKER` | Verified with circular completion gauge |
| **Resume Upload & ATS Parsing** | Completed & Verified | `ROLE_JOB_SEEKER` | Verified with multipart upload endpoint |
| **Application Tracker & Timeline** | Completed & Verified | `ROLE_JOB_SEEKER` | Verified across 5 status stages |
| **AI Resume Analyzer** | Completed & Verified | `ROLE_JOB_SEEKER` | Verified with ATS scoring & suggestions |
| **AI Cover Letter Generator** | Completed & Verified | `ROLE_JOB_SEEKER` | Verified with 3 customizable tones |
| **AI Interview Preparation** | Completed & Verified | `ROLE_JOB_SEEKER` | Verified with technical & HR questions |
| **AI Skill Gap Analyzer** | Completed & Verified | `ROLE_JOB_SEEKER` | Verified with learning roadmaps |
| **Floating Career Assistant Chat** | Completed & Verified | `ROLE_JOB_SEEKER` | Verified slide-out chat drawer |
| **Recruiter Command Center** | Completed & Verified | `ROLE_RECRUITER` | Verified with Recharts funnel analytics |
| **Requisition Management (CRUD)** | Completed & Verified | `ROLE_RECRUITER` | Verified with create/edit/pause/delete |
| **Candidate Pipeline (Table/Cards)**| Completed & Verified | `ROLE_RECRUITER` | Verified with AI score badges & review |
| **Interview Scheduling** | Completed & Verified | `ROLE_RECRUITER` | Verified with date, type & Meet link |
| **Company Profile Settings** | Completed & Verified | `ROLE_RECRUITER` | Verified with live card preview & updates |
| **Admin Telemetry & User Moderation**| Completed & Verified | `ROLE_ADMIN` | Verified with suspend/reactivate toggles |
| **Automated Job Alerts** | Completed & Verified | `ROLE_JOB_SEEKER` | Verified with title, skills & salary triggers |

---

## 2. Module-Wise Feature Deep Dive

### 2.1 Public Job Discovery & Details
- **Description:** Enables candidates to browse and filter open roles across tech stacks. Includes a real-time modal on the Job Details page that calculates applicant compatibility before applying.
- **Frontend:** `src/pages/HomePage.jsx`, `src/pages/JobsPage.jsx`, `src/pages/JobDetailsPage.jsx`.
- **Backend:** `JobController.java`, `JobServiceImpl.java`, `JobRepository.java`.
- **Database:** `jobs`, `companies`, `job_required_skills`.
- **APIs:** `GET /api/jobs`, `GET /api/jobs/{id}`, `GET /api/jobs/categories`, `POST /api/ai/job-match`.

---

### 2.2 Job Seeker Portal & Application Tracking
- **Description:** Central command center for applicants. Features profile strength progress bar, uploaded resume management, bookmarked roles, and a 5-stage application timeline (`APPLIED` → `UNDER_REVIEW` → `SHORTLISTED` → `INTERVIEW` → `SELECTED`).
- **Frontend:** `src/pages/seeker/SeekerDashboard.jsx`, `SeekerProfile.jsx`, `ApplicationsPage.jsx`, `SavedJobsPage.jsx`, `JobAlertsPage.jsx`.
- **Backend:** `UserController.java`, `ApplicationController.java`, `UserServiceImpl.java`, `ApplicationServiceImpl.java`.
- **Database:** `job_seeker_profiles`, `applications`, `saved_jobs`, `job_alerts`.
- **APIs:** `GET /api/users/jobseeker/profile`, `POST /api/applications`, `GET /api/applications/my-applications`.

---

### 2.3 AI Career Suite
- **Description:** A collection of 5 specialized tools designed to give candidates a competitive edge:
  1. **Resume Analyzer:** Returns an ATS compatibility score, identified skills, and formatting recommendations.
  2. **Job Match Score:** Analyzes candidate profile vs job description and displays matching/missing skills.
  3. **Cover Letter Generator:** Formulates role-specific cover letters customized for tone (`Professional`, `Conversational`, `Technical`).
  4. **Interview Prep Simulator:** Generates role-specific technical questions, HR queries, and model answers.
  5. **Skill Gap Roadmap:** Identifies missing competencies and outlines structured learning steps.
  6. **Career Assistant Drawer:** Persistent slide-out chat available in the bottom-right corner of every page.
- **Frontend:** `src/pages/seeker/ai/ResumeAnalyzer.jsx`, `CoverLetterGenerator.jsx`, `InterviewPrep.jsx`, `SkillGapAnalyzer.jsx`, `src/components/AIChatDrawer.jsx`.
- **Backend:** `AIController.java`, `AIAnalysisServiceImpl.java`, `GeminiAiService.java`, `FallbackAiEngine.java`.
- **Database:** `ai_analyses`.
- **APIs:** `POST /api/ai/resume-analyzer`, `POST /api/ai/job-match`, `POST /api/ai/cover-letter`, `POST /api/ai/interview-prep`, `POST /api/ai/career-chat`, `POST /api/ai/skill-gap`.

---

### 2.4 Recruiter Command Center & Candidate Pipeline
- **Description:** Full-lifecycle requisition and applicant management. Recruiters can post jobs, switch between Table and Kanban views of candidate pipelines, review AI match score badges, read candidate cover letters, update statuses, and schedule live video interviews.
- **Frontend:** `src/pages/recruiter/RecruiterDashboard.jsx`, `RecruiterJobsPage.jsx`, `ApplicantsPage.jsx`, `RecruiterInterviewsPage.jsx`, `CompanySettingsPage.jsx`.
- **Backend:** `JobController.java`, `ApplicationController.java`, `InterviewController.java`, `CompanyController.java`.
- **Database:** `jobs`, `applications`, `interviews`, `companies`, `recruiter_profiles`.
- **APIs:** `GET /api/jobs/recruiter/my-jobs`, `POST /api/jobs`, `GET /api/applications/recruiter/all`, `PATCH /api/applications/{id}/status`, `POST /api/interviews/schedule`.

---

### 2.5 Admin Console & Governance
- **Description:** Telemetry and governance portal for system administrators. Provides real-time metrics across all platform entities, visual role distribution charts, 1-click user account suspension/reactivation, and job moderation.
- **Frontend:** `src/pages/admin/AdminDashboard.jsx`, `AdminUsersPage.jsx`, `AdminJobsPage.jsx`.
- **Backend:** `AdminController.java`, `AdminServiceImpl.java`.
- **Database:** `users`, `jobs`, `companies`, `applications`, `interviews`.
- **APIs:** `GET /api/admin/analytics`, `GET /api/admin/users`, `PATCH /api/admin/users/{id}/status`, `GET /api/admin/jobs`, `DELETE /api/admin/jobs/{id}`.
