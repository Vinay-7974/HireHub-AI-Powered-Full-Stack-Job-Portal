# HireHub — Next-Generation AI-Powered Full-Stack Job Portal

<div align="center">

![HireHub Banner](frontend/src/assets/hero.png)

### *"Find your future. Hire your potential."*

An enterprise-ready, production-grade full-stack recruitment platform powered by **Spring Boot 3.3.5**, **React 19**, **MySQL 8.0**, and **Google Gemini AI**. Built with Linear and Stripe design principles for ambitious software teams.

[![Java 21](https://img.shields.io/badge/Java-21%20LTS-orange.svg?logo=openjdk)](https://adoptium.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.0-blue.svg?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4.0-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg?logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

</div>

---

## 🚀 Key Features by Persona

### 1. 👤 Job Seeker Experience (`ROLE_JOB_SEEKER`)
- **Seeker Command Center:** Interactive progress tracker, dynamic recommendations, recent applications, and interview calendar.
- **Profile & Resume Manager:** Resume upload with automatic ATS parsing, skill chips, GitHub/LinkedIn linking, and portfolio showcase.
- **Visual Application Tracker:** 5-stage status timeline (`Applied` → `Under Review` → `Shortlisted` → `Interview` → `Selected`).
- **Saved Jobs & Alerts:** Bookmark opportunities and configure automated triggers for target roles, locations, and salary thresholds.
- **AI Career Suite:**
  - **AI Resume Analyzer:** ATS compatibility score (0–100), detected skills, missing competencies, and actionable recommendations.
  - **AI Job Match Score:** Real-time semantic analysis comparing user profiles against job requisitions.
  - **AI Cover Letter Generator:** Personalized cover letters tailored to specific roles and tones (Professional, Conversational, Technical).
  - **AI Interview Prep Mode:** Curated technical, behavioral, and HR questions with model answers.
  - **AI Skill Gap Analyzer:** Skill comparisons with a structured step-by-step learning roadmap.
  - **Interactive Career Assistant:** Floating conversational drawer accessible from any page.

### 2. 🏢 Recruiter & Employer Console (`ROLE_RECRUITER`)
- **Recruiter Command Center:** Recharts hiring funnel visualization, active job listings, and candidate metrics.
- **Job Requisitions Management:** Create, publish, edit, pause, close, or delete job postings.
- **Candidate Pipeline:** Table and Kanban views, candidate AI match score badges, resume/cover letter previews, and status updates.
- **Interview Scheduling:** Coordinate technical and HR rounds with calendar date/time, Google Meet/Zoom links, and notes.
- **Company Branding:** Manage company profile, verified badge, logo, cover image, and description.

### 3. 🛡️ Admin Console (`ROLE_ADMIN`)
- **Platform Analytics:** Real-time telemetry on users, companies, active postings, and application volume.
- **User Moderation:** Audit registered accounts, filter by role, and instantly toggle user status (**Suspend / Reactivate**).
- **Requisition Moderation:** Review and moderate job listings across organizations.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React, Recharts, React Router DOM, Axios, React Hot Toast |
| **Backend** | Java 21 LTS, Spring Boot 3.3.5, Spring Security (JWT), Spring Data JPA, Hibernate, Bean Validation |
| **Database** | MySQL 8.0 with relational constraints, foreign keys, and indexes |
| **AI Integration** | Google Gemini API with deterministic rule-based fallback heuristics |
| **Documentation** | Swagger / OpenAPI 3.0 (`springdoc-openapi-starter-webmvc-ui`) |

---

## 📂 Project Structure

```
hirehub/
├── backend/                             # Spring Boot 3.3.5 Backend
│   ├── src/main/java/com/hirehub/jobportal/
│   │   ├── ai/                          # Gemini AI & Fallback heuristic engines
│   │   ├── controller/                  # REST API controllers
│   │   ├── dto/                         # Request and Response DTOs
│   │   ├── entity/                      # JPA Entities & Enums
│   │   ├── exception/                   # Global exception handler
│   │   ├── repository/                  # Spring Data JPA Repositories
│   │   ├── security/                    # JWT Filters & Security Config
│   │   ├── service/                     # Business logic service layer
│   │   └── util/                        # DataInitializer seed service
│   ├── src/main/resources/
│   │   └── application.properties       # Spring configuration
│   └── pom.xml                          # Maven build dependencies
│
├── frontend/                            # React 19 + Vite Frontend
│   ├── src/
│   │   ├── api/                         # Axios client with JWT interceptor
│   │   ├── components/                  # Navbar, Footer, AIChatDrawer, ProtectedRoute
│   │   ├── context/                     # AuthContext with 1-click persona switcher
│   │   └── pages/
│   │       ├── seeker/                  # Job Seeker dashboard & AI suite
│   │       ├── recruiter/               # Recruiter jobs & candidate pipeline
│   │       ├── admin/                   # Admin console & user moderation
│   │       ├── HomePage.jsx             # Landing page
│   │       ├── JobsPage.jsx             # Search & multi-filter listings
│   │       ├── JobDetailsPage.jsx       # Details & AI match score modal
│   │       └── LoginPage.jsx            # 1-click demo login portal
│   ├── package.json                     # NPM dependencies
│   └── vite.config.js                   # Vite configuration with API proxy
│
├── .gitignore                           # Comprehensive Git ignore rules
└── README.md                            # Documentation
```

---

## ⚡ Getting Started

### Prerequisites
- **Java 21 LTS**
- **Node.js 20+** and **npm**
- **MySQL 8.0+**
- **Maven 3.9+**

### 1. Database Setup
```sql
CREATE DATABASE hirehub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Setup
```bash
cd backend
# Build the application
mvn clean package -DskipTests

# Run the JAR
java -jar target/hirehub-backend-1.0.0.jar
```
The backend starts on `http://localhost:8080`.
Interactive Swagger API documentation is available at `http://localhost:8080/swagger-ui.html`.

### 3. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
The frontend starts on `http://localhost:5173`.

---

## 🔑 Demo Personas & Credentials

The database is automatically pre-seeded with sample data:

| Role | Email | Password | Persona |
| :--- | :--- | :--- | :--- |
| **Job Seeker** | `seeker@hirehub.com` | `password123` | Alex Rivera (Full-Stack Engineer) |
| **Recruiter** | `recruiter@stripe.com` | `password123` | Sarah (Stripe Talent Acquisition) |
| **Recruiter** | `recruiter@linear.app` | `password123` | Marcus (Linear Hiring Team) |
| **Admin** | `admin@hirehub.com` | `password123` | System Administrator |

*Tip: You can use the 1-click Persona Switcher in the top navigation bar to test all three roles seamlessly without typing credentials.*

---

## 📄 License
This project is licensed under the MIT License.
