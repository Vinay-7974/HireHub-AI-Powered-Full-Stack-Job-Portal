# HireHub — System Requirements Specification (SRS)

## 1. Introduction

This document details the functional and non-functional requirements for the **HireHub** AI-Powered Full-Stack Job Portal. It serves as the baseline specification for architecture, implementation, verification, and compliance auditing.

---

## 2. Functional Requirements (FR)

### 2.1 Public User / Visitor Requirements (FR-PUB)
- **FR-PUB-01: Landing Page Discovery:** Unauthenticated visitors must be able to view the home page with a modern SaaS hero section, platform statistics, featured job cards, verified company showcases, and category chips.
- **FR-PUB-02: Public Job Search & Filter:** Visitors must be able to search jobs by keyword, title, company, and location with multi-attribute filtering (Work Mode, Job Type, Category, Experience Level, Salary Range).
- **FR-PUB-03: Job Details View:** Visitors must be able to inspect detailed job descriptions, responsibilities, requirements, benefits, and hiring company profiles.
- **FR-PUB-04: User Registration:** New users must be able to register under either `ROLE_JOB_SEEKER` or `ROLE_RECRUITER` with full name, email, password, and phone number.
- **FR-PUB-05: User Authentication:** Registered users must be able to log in securely with email and password, receiving a cryptographically signed JWT token.
- **FR-PUB-06: 1-Click Demo Evaluation:** The platform must provide pre-seeded credentials and a one-click persona switcher to evaluate the platform as a Job Seeker, Recruiter, or Admin without manual registration.

---

### 2.2 Job Seeker Requirements (FR-SEEK)
- **FR-SEEK-01: Personalized Dashboard:** Display profile completion percentage, statistics on submitted applications, upcoming interviews, saved jobs, and dynamically recommended opportunities.
- **FR-SEEK-02: Profile Management:** Allow job seekers to maintain personal contact info, professional headline, summary, skills tags, education history, work experience, projects, certifications, and portfolio/social links (GitHub, LinkedIn).
- **FR-SEEK-03: Resume Upload & Parsing:** Support resume uploads (PDF/DOC up to 10MB) with automatic extraction and text parsing for ATS analysis.
- **FR-SEEK-04: Job Application Submission:** Allow job seekers to apply for open requisitions with a single click, attaching their uploaded resume and an optional tailored cover letter.
- **FR-SEEK-05: Application Status Tracking:** Provide a real-time 5-stage status timeline visualization (`APPLIED` → `UNDER_REVIEW` → `SHORTLISTED` → `INTERVIEW` → `SELECTED`) with timestamps and recruiter notes.
- **FR-SEEK-06: Saved Jobs Management:** Allow users to bookmark open positions and apply directly from their saved jobs dashboard.
- **FR-SEEK-07: Automated Job Alerts:** Allow users to set up alerts based on target title, required skills, location, remote preference, and minimum salary, with matching opportunity views.
- **FR-SEEK-08: Interview Participation:** Allow job seekers to review scheduled interview rounds (Technical, HR, Behavioral) with integrated meeting links (Google Meet, Zoom) and preparation notes.

---

### 2.3 AI Career Suite Requirements (FR-AI)
- **FR-AI-01: AI Resume Analyzer:** Evaluate resume text against target role keywords, returning an ATS score (0–100), detected skills, missing skills, formatting tips, and actionable improvement recommendations.
- **FR-AI-02: AI Job Match Analysis:** Compute a real-time semantic compatibility score between the user profile/resume and a specific job posting, detailing matching skills and missing competencies.
- **FR-AI-03: AI Cover Letter Generator:** Generate role-specific cover letters customized to user experience and configurable tone (`Professional`, `Conversational`, `Technical`), with one-click copy and edit capabilities.
- **FR-AI-04: AI Interview Preparation Mode:** Produce customized technical questions, coding problems, HR inquiries, and behavioral scenarios tailored to a specific job title, complete with model answers.
- **FR-AI-05: AI Skill Gap Analyzer:** Identify missing critical skills for target roles and generate a prioritized step-by-step learning roadmap.
- **FR-AI-06: Floating AI Career Assistant:** Provide an interactive slide-out chat drawer accessible across all pages for conversational career guidance.
- **FR-AI-07: Resilient Fallback Engine:** If the external LLM provider API key is missing or unreachable, the system must seamlessly fall back to an internal deterministic rule engine without throwing application errors.

---

### 2.4 Recruiter & Employer Requirements (FR-REC)
- **FR-REC-01: Recruiter Command Center:** Display hiring funnel metrics, active requisition counts, applicant volume, and recent candidate submissions.
- **FR-REC-02: Requisition Management (CRUD):** Enable recruiters to create, view, edit, and delete job postings with fields for title, category, job type, work mode, location, salary range, and required skill chips.
- **FR-REC-03: Post Lifecycle State Machine:** Allow recruiters to toggle job status between `PUBLISHED`, `PAUSED`, and `CLOSED`.
- **FR-REC-04: Candidate Pipeline Management:** Present applicant pools in both tabular view and Kanban/cards view, filterable by job and application status.
- **FR-REC-05: AI Candidate Scoring:** Display pre-computed AI match score badges (High Match, Good Match, Moderate) for applicants, with click-to-view rationale dialogs.
- **FR-REC-06: Candidate Status Advancement:** Enable recruiters to transition candidate statuses (`UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`) and attach recruiter notes.
- **FR-REC-07: Interview Scheduling:** Allow recruiters to schedule interviews with date/time, interview type (Technical, HR, Behavioral, Final), video meeting link, and notes.
- **FR-REC-08: Company Profile Management:** Manage company branding including name, description, industry, company size, location, website, logo URL, and cover banner.

---

### 2.5 Administrator Requirements (FR-ADM)
- **FR-ADM-01: Telemetry Dashboard:** Provide platform-wide metrics including total registered users, job seekers, recruiters, companies, active jobs, applications, and scheduled interviews.
- **FR-ADM-02: User Moderation:** List all platform accounts with role filters and search; provide a one-click toggle to suspend or reactivate user access.
- **FR-ADM-03: Job Moderation:** Review all listings across organizations and delete fraudulent, expired, or inappropriate postings.
- **FR-ADM-04: Company Verification:** Enable root administrators to verify or revoke verification badges for employer companies.

---

## 3. Non-Functional Requirements (NFR)

### 3.1 Security & Compliance (NFR-SEC)
- **NFR-SEC-01: Cryptographic Authentication:** Passwords must be hashed using the **BCrypt** strong hashing algorithm with salt rounds.
- **NFR-SEC-02: Stateless Authorization:** REST API communication must be secured using JSON Web Tokens (JWT) signed with HMAC-SHA256 (`HS256`) algorithms.
- **NFR-SEC-03: Role-Based Authorization:** Endpoints must enforce method-level role checking (`@PreAuthorize("hasRole('ADMIN')")`, etc.).
- **NFR-SEC-04: Credential Hygiene:** Passwords, API keys, and JWT secrets must never be committed in plaintext; application configurations must resolve secrets via environment variables (`${DB_PASSWORD:root}`).
- **NFR-SEC-05: Input Validation:** All API inputs must be validated using Jakarta Bean Validation (`@Valid`, `@NotNull`, `@NotBlank`, `@Size`).

### 3.2 Performance & Responsiveness (NFR-PERF)
- **NFR-PERF-01: REST API Latency:** Core database-backed API queries (job search, profile retrieval) must return in under 200ms.
- **NFR-PERF-02: Fast Frontend Bundling:** Vite build times must remain under 10 seconds with optimized chunk splitting.
- **NFR-PERF-03: Paginated Result Sets:** All large collections (jobs, applications, users) must implement database-level pagination and sorting to prevent memory exhaustion.

### 3.3 Usability & Design (NFR-UI)
- **NFR-UI-01: Responsive Layout:** The interface must adapt seamlessly across desktop (1440px+), laptop (1024px), tablet (768px), and mobile (375px) viewports.
- **NFR-UI-02: Design Language:** Maintain a clean, professional aesthetic combining Linear, Stripe, and Notion design principles (deep navy slate typography, electric blue accents, subtle neutral borders, soft shadows).
- **NFR-UI-03: Visual Feedback:** Every asynchronous operation must display loading skeletons, spinner feedback, and toast notifications (success / error).

---

## 4. Dependencies & Technology Matrix

### Backend Dependencies (`backend/pom.xml`):
| Dependency Group & Artifact | Version | Purpose |
| :--- | :--- | :--- |
| `org.springframework.boot:spring-boot-starter-web` | 3.3.5 | Spring MVC REST API layer and embedded Tomcat server |
| `org.springframework.boot:spring-boot-starter-data-jpa` | 3.3.5 | Spring Data JPA and Hibernate ORM persistence |
| `org.springframework.boot:spring-boot-starter-security` | 3.3.5 | Authentication, authorization, and filter chain security |
| `org.springframework.boot:spring-boot-starter-validation` | 3.3.5 | Jakarta Bean Validation API |
| `com.mysql:mysql-connector-j` | 8.3.0 | MySQL 8.0 JDBC driver |
| `io.jsonwebtoken:jjwt-api`, `jjwt-impl`, `jjwt-jackson` | 0.12.5 | JWT token generation, parsing, and signing |
| `org.springdoc:springdoc-openapi-starter-webmvc-ui` | 2.5.0 | Interactive OpenAPI 3.0 / Swagger UI documentation |
| `org.projectlombok:lombok` | 1.18.32 | Boilerplate reduction (getters, setters, builders) |

### Frontend Dependencies (`frontend/package.json`):
| Package Name | Version | Purpose |
| :--- | :--- | :--- |
| `react`, `react-dom` | ^19.0.0 | Core UI rendering engine |
| `vite` | ^8.3.8 | Modern lightning-fast dev server and bundler |
| `@tailwindcss/vite`, `tailwindcss` | ^4.0.0 | Utility-first responsive CSS design system |
| `react-router-dom` | ^7.1.3 | Single-page application client routing |
| `axios` | ^1.7.9 | HTTP client with automatic JWT bearer interceptor |
| `lucide-react` | ^0.474.0 | Modern SVG iconography library |
| `recharts` | ^2.15.0 | Declarative charting library for analytics dashboards |
| `react-hot-toast` | ^2.5.1 | Lightweight, accessible notification toasts |
