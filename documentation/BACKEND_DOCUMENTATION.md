# HireHub — Backend Documentation

## 1. Overview & Architecture

The **HireHub** backend is developed using **Java 21 LTS** and **Spring Boot 3.3.5**. It follows a standard domain-driven layered architecture with clear separation between controllers, service implementations, data access repositories, JPA entities, and data transfer objects (DTOs).

### Base Package: `com.hirehub.jobportal`

```
com.hirehub.jobportal/
├── HireHubApplication.java        # Spring Boot main entry point
├── ai/                            # AI service integrations & heuristic fallback
├── config/                        # Spring configuration (OpenAPI, Security)
├── controller/                    # REST API Controllers (9 controllers)
├── dto/                           # Request & Response Data Transfer Objects
│   ├── ai/
│   ├── application/
│   ├── auth/
│   ├── job/
│   └── user/
├── entity/                        # JPA Entities (18 entities) & Enums
│   └── enums/
├── exception/                     # Global exception handlers & custom errors
├── repository/                    # Spring Data JPA Repositories (14 repositories)
├── response/                      # Standardized response wrappers
├── security/                      # JWT filters, UserPrincipal, token provider
├── service/                       # Service interfaces
│   └── impl/                      # Business logic service implementations
└── util/                          # Pre-seeding data initializer
```

---

## 2. Controller Layer (`com.hirehub.jobportal.controller`)

Every controller is annotated with `@RestController`, `@RequestMapping`, and `@Tag` for Swagger OpenAPI documentation, and injects services via Lombok's `@RequiredArgsConstructor`.

| Controller Class | Base Route | Key Responsibilities & Injected Services |
| :--- | :--- | :--- |
| **`AuthController`** | `/api/auth` | User registration, authentication, JWT issuance, token refresh. Injects `AuthService`. |
| **`JobController`** | `/api/jobs` | Public job search, category listing, recruiter job creation/updates/deletion. Injects `JobService`. |
| **`CompanyController`** | `/api/companies` | Public company directory, employer branding updates. Injects `CompanyService`. |
| **`ApplicationController`** | `/api/applications` | Applying for jobs, application status lifecycle transitions, candidate screening. Injects `ApplicationService`. |
| **`UserController`** | `/api/users` | Profile retrieval/updates, resume upload, saved jobs, and job alerts. Injects `UserService`. |
| **`InterviewController`** | `/api/interviews` | Scheduling interview sessions, recruiter/seeker calendar queries, status updates. Injects `InterviewService`. |
| **`AIController`** | `/api/ai` | Resume analysis, job match scoring, cover letter generation, interview prep, career chat. Injects `AIAnalysisService`. |
| **`NotificationController`**| `/api/notifications` | User notifications, unread count polling, mark as read operations. Injects `NotificationService`. |
| **`AdminController`** | `/api/admin` | Platform telemetry, user access moderation (suspend/reactivate), job moderation. Injects `AdminService`. |

---

## 3. Service Layer (`com.hirehub.jobportal.service`)

The service layer encapsulates business transactions, validation logic, entity transformations, and cross-module events.

| Service Interface & Implementation | Responsibilities | Key Methods |
| :--- | :--- | :--- |
| **`AuthService`**<br>`AuthServiceImpl` | Validates credentials via `AuthenticationManager`, generates JWT tokens, manages user signups, hashes passwords with BCrypt. | `authenticate(LoginRequest)`, `register(RegisterRequest)`, `refreshToken(RefreshTokenRequest)` |
| **`JobService`**<br>`JobServiceImpl` | Manages job lifecycle, executes multi-filter paginated queries, tracks views count, handles status changes (`PUBLISHED`, `PAUSED`, `CLOSED`). | `searchJobs(...)`, `createJob(recruiterId, dto)`, `updateJob(id, dto)`, `updateJobStatus(id, status)`, `deleteJob(id)` |
| **`ApplicationService`**<br>`ApplicationServiceImpl` | Enforces application rules (prevents duplicate applications), calculates initial AI match scores, dispatches notification events. | `applyForJob(userId, dto)`, `getMyApplications(userId, pageable)`, `updateApplicationStatus(recruiterId, appId, status)`, `withdrawApplication(userId, appId)` |
| **`CompanyService`**<br>`CompanyServiceImpl` | Retrieves verified company listings, updates employer branding assets (logos, banners, descriptions). | `getAllCompanies(pageable)`, `getCompanyById(id)`, `updateCompany(id, dto)` |
| **`UserService`**<br>`UserServiceImpl` | Manages seeker and recruiter profiles, saves/unsaves bookmarks, creates automated job alerts, uploads resume files. | `getJobSeekerProfile(userId)`, `updateJobSeekerProfile(userId, dto)`, `uploadResume(userId, file)`, `saveJob(userId, jobId)`, `createJobAlert(userId, alert)` |
| **`InterviewService`**<br>`InterviewServiceImpl` | Schedules technical/HR interview rounds, updates application state to `INTERVIEW`, notifies candidates with video links. | `scheduleInterview(recruiterId, dto)`, `getSeekerInterviews(userId, pageable)`, `getRecruiterInterviews(userId, pageable)`, `updateInterviewStatus(id, status)` |
| **`AIAnalysisService`**<br>`AIAnalysisServiceImpl` | Orchestrates LLM and rule-based fallback evaluations, parses resume text, computes skill gap roadmaps, saves analysis records. | `analyzeResume(userId, dto)`, `matchJob(userId, jobId, dto)`, `generateCoverLetter(userId, dto)`, `generateInterviewPrep(dto)`, `careerChat(userId, dto)`, `analyzeSkillGap(userId, dto)` |
| **`NotificationService`**<br>`NotificationServiceImpl` | Creates in-app notifications, retrieves paginated inbox, tracks unread counts, marks notifications read. | `createNotification(userId, title, message, link)`, `getUserNotifications(userId, pageable)`, `getUnreadCount(userId)`, `markAsRead(id)` |
| **`AdminService`**<br>`AdminServiceImpl` | Aggregates database-wide analytics, activates/suspends accounts, moderates jobs across all companies. | `getAdminAnalytics()`, `getUsers(role, pageable)`, `toggleUserStatus(userId, active)`, `getAllJobs(pageable)`, `deleteJob(jobId)`, `verifyCompany(companyId, verified)` |

---

## 4. AI Service Layer (`com.hirehub.jobportal.ai`)

HireHub features a decoupled, fault-tolerant AI architecture designed to function with zero external failure risk:

### 1. `GeminiAiService.java`:
- Connects to Google Generative Language API (`v1beta/models/gemini-1.5-flash:generateContent`).
- Formats structured system instructions and returns machine-parsable JSON payloads.
- Configured via `hirehub.ai.gemini.api-key=${GEMINI_API_KEY:}` in `application.properties`.

### 2. `FallbackAiEngine.java`:
- If `GEMINI_API_KEY` is not set or network errors occur, `AIAnalysisServiceImpl` delegates automatically to `FallbackAiEngine`.
- Performs semantic keyword extraction, technical skill detection across a dictionary of 50+ programming languages, frameworks, and tools.
- Evaluates resume formatting and length to calculate accurate, realistic ATS compatibility scores (0–100).
- Generates dynamic interview questions, cover letter drafts, and learning roadmaps deterministically.

---

## 5. Repository Layer (`com.hirehub.jobportal.repository`)

All repositories extend Spring Data's `JpaRepository<T, ID>`:

| Repository Interface | Key Custom Queries & Derived Finders |
| :--- | :--- |
| **`UserRepository`** | `findByEmail(String email)`, `existsByEmail(String email)`, `countByRole(Role role)` |
| **`JobRepository`** | `findByStatus(JobStatus status, Pageable pageable)`, `findByRecruiterId(Long recruiterId, Pageable pageable)`, `searchJobs(...)` with multi-filter JPQL |
| **`CompanyRepository`** | `findByNameContainingIgnoreCase(String name, Pageable pageable)` |
| **`ApplicationRepository`** | `findByApplicantId(Long applicantId, Pageable pageable)`, `findByJobId(Long jobId, Pageable pageable)`, `existsByApplicantIdAndJobId(Long applicantId, Long jobId)` |
| **`InterviewRepository`** | `findByApplicantId(Long applicantId, Pageable pageable)`, `findByRecruiterId(Long recruiterId, Pageable pageable)` |
| **`SavedJobRepository`** | `findByUserId(Long userId, Pageable pageable)`, `existsByUserIdAndJobId(Long userId, Long jobId)`, `deleteByUserIdAndJobId(Long userId, Long jobId)` |
| **`JobAlertRepository`** | `findByUserId(Long userId, Pageable pageable)`, `findByActiveTrue()` |
| **`NotificationRepository`**| `findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable)`, `countByUserIdAndIsReadFalse(Long userId)` |
| **`AIAnalysisRepository`** | `findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable)` |
| **`JobSeekerProfileRepository`** | `findByUserId(Long userId)` |
| **`RecruiterProfileRepository`** | `findByUserId(Long userId)` |

---

## 6. Entity Layer (`com.hirehub.jobportal.entity`)

### Core Entities:
1. **`User`**: System account entity with `email`, `password` (BCrypt), `fullName`, `phone`, `role` (`ROLE_JOB_SEEKER`, `ROLE_RECRUITER`, `ROLE_ADMIN`), `active` (boolean).
2. **`Company`**: Employer entity with `name`, `logo`, `coverImage`, `description`, `website`, `industry`, `companySize`, `location`, `verified` (boolean).
3. **`Job`**: Requisition entity with `title`, `description`, `responsibilities`, `requirements`, `benefits`, `salaryMin`, `salaryMax`, `location`, `workMode`, `employmentType`, `experienceLevel`, `category`, `status` (`PUBLISHED`, `PAUSED`, `CLOSED`), and eager `@ElementCollection` `requiredSkills`.
4. **`Application`**: Candidate submission entity linking `Job` and `User` (applicant), with `resumeUrl`, `coverLetter`, `status` (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`, `WITHDRAWN`), `aiMatchScore`, and `aiMatchExplanation`.
5. **`Interview`**: Scheduled session entity linking `Application`, `recruiter`, and `applicant` with `interviewDate`, `interviewType` (`TECHNICAL`, `HR`, `BEHAVIORAL`, `SYSTEM_DESIGN`, `FINAL_ROUND`), `meetingLink`, `notes`, and `status`.
6. **`JobSeekerProfile`**: Professional details including `headline`, `about`, `location`, `resumeUrl`, `resumeText`, `skills` collection, and `@OneToMany` relationships to `Education`, `Experience`, `Project`, and `Certification`.
7. **`RecruiterProfile`**: Recruiter metadata linking `User` to `Company`, designation, and department.
8. **`JobAlert`**: Automated alert configuration with `title`, `skills`, `location`, `remotePreference`, `minSalary`, `employmentType`.
9. **`Notification`**: Real-time in-app alerts with `title`, `message`, `link`, `type`, `isRead`.

---

## 7. Security & Configuration (`com.hirehub.jobportal.security`)

### 1. `SecurityConfig.java`:
- Configures Spring Security 6 filter chain with **stateless session management** (`SessionCreationPolicy.STATELESS`).
- Disables CSRF (safe for token-based APIs).
- Enables CORS with configurable allowed origins (`http://localhost:5173`).
- Maps URL role authorization:
  - `/api/auth/**`, `/api/jobs/**` (GET), `/api/companies/**` (GET) -> `permitAll()`
  - `/api/admin/**` -> `hasRole('ADMIN')`
  - `/api/interviews/schedule`, `/api/jobs/recruiter/**` -> `hasAnyRole('RECRUITER', 'ADMIN')`
  - `/api/applications/**` -> Authenticated
  - `/api/ai/**` -> Authenticated

### 2. `JwtTokenProvider.java`:
- Generates cryptographically signed JWT tokens with claims (`sub`, `role`, `iat`, `exp`).
- Validates token integrity and expiration using HMAC-SHA256 secret.

### 3. `JwtAuthenticationFilter.java`:
- Extends `OncePerRequestFilter`.
- Extracts `Authorization: Bearer <token>` from HTTP request headers.
- Populates `SecurityContextHolder` with `UserPrincipal` on valid tokens.
