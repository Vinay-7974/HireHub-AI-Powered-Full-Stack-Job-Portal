# HireHub — REST API Documentation

## 1. API Standards & Conventions

- **Base URL:** `http://localhost:8080/api` (or proxied via `/api` on `http://localhost:5173`)
- **Content Type:** `application/json` (except multipart file uploads)
- **Authentication:** Bearer token via `Authorization: Bearer <JWT_TOKEN>`
- **Response Format:** All API responses adhere to the standard `ApiResponse<T>` wrapper:
  ```json
  {
    "success": true,
    "message": "Operation completed successfully",
    "data": { ... },
    "timestamp": "2026-11-25T16:00:00"
  }
  ```
- **Paginated Response Format (`PagedResponse<T>`):**
  ```json
  {
    "content": [ ... ],
    "page": 0,
    "size": 10,
    "totalElements": 25,
    "totalPages": 3,
    "last": false
  }
  ```

---

## 2. Authentication Module (`/api/auth`)

### 2.1 User Login
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "seeker@hirehub.com",
    "password": "password123"
  }
  ```
- **Response Body (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
      "tokenType": "Bearer",
      "userId": 1,
      "email": "seeker@hirehub.com",
      "fullName": "Alex Rivera",
      "role": "ROLE_JOB_SEEKER"
    }
  }
  ```

### 2.2 User Registration
- **Endpoint:** `POST /api/auth/register`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "candidate@hirehub.com",
    "password": "securePassword123!",
    "fullName": "Jane Doe",
    "phone": "+1-555-0199",
    "role": "ROLE_JOB_SEEKER"
  }
  ```
- **Response Body (200 OK):** Returns `AuthResponse` with newly issued JWT.

---

## 3. Job Requisitions Module (`/api/jobs`)

### 3.1 Public Job Search & Filter
- **Endpoint:** `GET /api/jobs`
- **Access:** Public
- **Query Parameters:**
  - `keyword` (string, optional)
  - `location` (string, optional)
  - `workMode` (`REMOTE`, `HYBRID`, `ON_SITE`, optional)
  - `employmentType` (`FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, optional)
  - `category` (string, optional)
  - `experienceLevel` (`ENTRY_LEVEL`, `MID_LEVEL`, `SENIOR_LEVEL`, `LEAD`, optional)
  - `minSalary` (double, optional)
  - `page` (int, default `0`), `size` (int, default `10`)
- **Response Body (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "content": [
        {
          "id": 1,
          "companyId": 1,
          "companyName": "Stripe",
          "companyLogo": "https://images.unsplash.com/...",
          "recruiterId": 2,
          "recruiterName": "Sarah Jenkins",
          "title": "Senior Full Stack Engineer",
          "description": "We are seeking a senior engineer...",
          "salaryMin": 140000.0,
          "salaryMax": 190000.0,
          "location": "San Francisco, CA / Remote",
          "employmentType": "FULL_TIME",
          "workMode": "REMOTE",
          "experienceLevel": "SENIOR_LEVEL",
          "category": "Software Engineering",
          "status": "PUBLISHED",
          "viewsCount": 142,
          "requiredSkills": ["React", "Java", "Spring Boot", "MySQL", "AWS"]
        }
      ],
      "page": 0,
      "size": 10,
      "totalElements": 1,
      "totalPages": 1
    }
  }
  ```

### 3.2 Create Job Posting
- **Endpoint:** `POST /api/jobs`
- **Access:** `ROLE_RECRUITER`, `ROLE_ADMIN`
- **Request Body (`JobCreateRequest`):**
  ```json
  {
    "title": "Lead Backend Platform Engineer",
    "description": "Design high-throughput payment rails...",
    "responsibilities": "- Architect microservices\n- Mentor juniors",
    "requirements": "- 5+ years Java / Spring Boot\n- Distributed systems",
    "benefits": "Unlimited PTO, Comprehensive Health",
    "salaryMin": 160000.0,
    "salaryMax": 210000.0,
    "currency": "USD",
    "location": "Remote, US",
    "workMode": "REMOTE",
    "employmentType": "FULL_TIME",
    "experienceLevel": "LEAD",
    "category": "Backend & Cloud",
    "requiredSkills": ["Java", "Spring Boot", "Kafka", "Docker", "Kubernetes"]
  }
  ```

### 3.3 Update Job Status
- **Endpoint:** `PATCH /api/jobs/{id}/status?status=PAUSED`
- **Access:** `ROLE_RECRUITER`, `ROLE_ADMIN`
- **Status Choices:** `PUBLISHED`, `PAUSED`, `CLOSED`

---

## 4. Job Applications Module (`/api/applications`)

### 4.1 Apply for a Job
- **Endpoint:** `POST /api/applications`
- **Access:** `ROLE_JOB_SEEKER`
- **Request Body:**
  ```json
  {
    "jobId": 1,
    "coverLetter": "Dear Hiring Team,\nI am thrilled to apply for the Senior Full Stack Engineer role...",
    "resumeUrl": "https://hirehub-storage/resumes/alex-rivera.pdf"
  }
  ```
- **Response Body (200 OK):** Returns `ApplicationDto` with pre-computed `aiMatchScore`.

### 4.2 Update Application Funnel Status
- **Endpoint:** `PATCH /api/applications/{id}/status`
- **Access:** `ROLE_RECRUITER`, `ROLE_ADMIN`
- **Request Body:**
  ```json
  {
    "status": "SHORTLISTED",
    "recruiterNotes": "Candidate exhibits strong mastery of Spring Boot and React."
  }
  ```
- **Statuses:** `APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`, `WITHDRAWN`

---

## 5. Interview Coordination Module (`/api/interviews`)

### 5.1 Schedule Candidate Interview
- **Endpoint:** `POST /api/interviews/schedule`
- **Access:** `ROLE_RECRUITER`, `ROLE_ADMIN`
- **Request Body:**
  ```json
  {
    "applicationId": 1,
    "interviewDate": "2026-11-28T14:00:00",
    "interviewType": "TECHNICAL",
    "meetingLink": "https://meet.google.com/abc-hirehub-room",
    "notes": "System architecture and live React coding round."
  }
  ```
- **Types:** `TECHNICAL`, `HR`, `BEHAVIORAL`, `SYSTEM_DESIGN`, `FINAL_ROUND`

---

## 6. AI Career Suite Module (`/api/ai`)

### 6.1 AI Resume Analyzer
- **Endpoint:** `POST /api/ai/resume-analyzer`
- **Access:** `ROLE_JOB_SEEKER`
- **Request Body:**
  ```json
  {
    "resumeText": "Experienced Full Stack Developer with expertise in React, JavaScript, Java, Spring Boot, MySQL, REST APIs, Docker, and AWS microservices architectures."
  }
  ```
- **Response Body (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "score": 88,
      "atsScore": 88,
      "detectedSkills": ["React", "JavaScript", "Java", "Spring Boot", "MySQL", "REST APIs", "Docker", "AWS"],
      "missingSkills": ["Kubernetes", "GraphQL", "CI/CD Pipeline"],
      "strengths": [
        "Strong demonstration of full-stack Java/React competencies",
        "Clear technical keywords matching modern software stacks"
      ],
      "recommendations": [
        "Include quantifiable impact metrics (e.g., 'improved query throughput by 35%')",
        "Expand on cloud orchestration tools like Kubernetes"
      ],
      "matchCategory": "High Match"
    }
  }
  ```

### 6.2 AI Job Match
- **Endpoint:** `POST /api/ai/job-match`
- **Access:** `ROLE_JOB_SEEKER`
- **Request Body:**
  ```json
  {
    "jobId": 1,
    "userSkills": ["React", "Spring Boot", "MySQL", "Tailwind CSS"]
  }
  ```
- **Response Body (200 OK):** Returns compatibility percentage, matching skills, missing skills, and detailed match rationale.

### 6.3 AI Cover Letter Generator
- **Endpoint:** `POST /api/ai/cover-letter`
- **Access:** `ROLE_JOB_SEEKER`
- **Request Body:**
  ```json
  {
    "jobTitle": "Senior Full Stack Engineer",
    "companyName": "Stripe",
    "tone": "Professional",
    "jobDescription": "We are seeking a senior full stack engineer..."
  }
  ```
- **Response Body (200 OK):** Returns tailored markdown cover letter.

---

## 7. Admin Console Module (`/api/admin`)

### 7.1 Platform Analytics
- **Endpoint:** `GET /api/admin/analytics`
- **Access:** `ROLE_ADMIN`
- **Response Body (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "totalUsers": 4,
      "totalJobSeekers": 1,
      "totalRecruiters": 2,
      "totalCompanies": 3,
      "totalJobs": 3,
      "totalApplications": 1,
      "totalInterviews": 1
    }
  }
  ```

### 7.2 Toggle User Account Status
- **Endpoint:** `PATCH /api/admin/users/{id}/status?active=false`
- **Access:** `ROLE_ADMIN`
- **Response:** Suspends user access (or reactivates when `active=true`).
