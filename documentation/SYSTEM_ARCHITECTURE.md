# HireHub — System Architecture Documentation

## 1. Architectural Overview

**HireHub** is designed following the **Client-Server 3-Tier Layered Architecture** with decoupled presentation, application logic, and persistence layers. This modular design ensures separation of concerns, high testability, and horizontal scalability.

```mermaid
flowchart TD
    subgraph PresentationTier["Presentation Tier (Client-Side)"]
        SPA["React 19 Single Page Application"]
        CTX["Context State Management (AuthContext)"]
        API_LAYER["Axios HTTP Interceptor Layer"]
        SPA <--> CTX
        CTX <--> API_LAYER
    end

    subgraph ApplicationTier["Application Tier (Spring Boot Backend)"]
        GW["Vite Reverse Proxy (/api -> :8080)"]
        SEC["Spring Security Chain & JWT Filter"]
        CTRL["REST Controller Layer"]
        SVC["Service Business Logic Layer"]
        AI_MOD["AI Intelligence Module"]
        REPO["Spring Data JPA Repository Layer"]

        GW --> SEC
        SEC --> CTRL
        CTRL --> SVC
        SVC <--> AI_MOD
        SVC --> REPO
    end

    subgraph DataTier["Data Tier & External Services"]
        MYSQL[("MySQL 8.0 Relational DB")]
        GEMINI["Google Gemini LLM Cloud API"]

        REPO <--> MYSQL
        AI_MOD <-->|HTTPS REST| GEMINI
    end

    API_LAYER <-->|JSON Over HTTP/1.1| GW
```

---

## 2. Layered Backend Architecture

The Spring Boot backend (`com.hirehub.jobportal`) strictly enforces a 5-layer separation:

```mermaid
graph TD
    REQ[Client HTTP Request] --> C_LAYER[1. Controller Layer]
    C_LAYER -->|DTOs / Validation| S_LAYER[2. Service Layer]
    S_LAYER -->|Business Logic| AI_LAYER[3. AI Module Layer]
    S_LAYER -->|Entities| R_LAYER[4. Repository Layer]
    R_LAYER -->|SQL Queries / Hibernate| DB[(5. MySQL 8 Database)]
    
    R_LAYER -->|Entities| S_LAYER
    S_LAYER -->|Response DTOs| C_LAYER
    C_LAYER -->|ApiResponse Wrap| RES[Client HTTP JSON Response]
```

### Layer Responsibilities:
1. **Controller Layer (`controller`):** Exposes RESTful endpoints, handles HTTP parameter binding, validates inputs using `@Valid`, and delegates business operations to services. All responses are standardized using `ApiResponse<T>` or `PagedResponse<T>`.
2. **Service Layer (`service`, `service.impl`):** Contains core business logic, transactional boundary management (`@Transactional`), permission checks, entity life-cycle coordination, and event triggers (e.g. notifications).
3. **AI Module (`ai`):** Abstracts LLM integration. Features `GeminiAiService` for cloud inference and `FallbackAiEngine` for offline deterministic scoring and parsing.
4. **Repository Layer (`repository`):** Extends `JpaRepository<T, ID>`, providing declarative CRUD, pagination (`Pageable`), and custom JPQL/native queries.
5. **Entity Layer (`entity`):** Models MySQL database tables via JPA annotations (`@Entity`, `@Table`, `@OneToMany`, `@ManyToOne`, `@Enumerated`).

---

## 3. End-to-End Execution Flows

### 3.1 Authentication & Authorization Flow
```mermaid
sequenceDiagram
    autonumber
    actor User as Client (Browser)
    participant AuthContext as AuthContext.jsx
    participant AuthCtrl as AuthController
    participant AuthSvc as AuthService
    participant UserRepo as UserRepository
    participant JwtProv as JwtTokenProvider
    participant DB as MySQL Database

    User->>AuthContext: Submit login(email, password)
    AuthContext->>AuthCtrl: POST /api/auth/login
    AuthCtrl->>AuthSvc: authenticate(LoginRequest)
    AuthSvc->>UserRepo: findByEmail(email)
    UserRepo->>DB: SELECT * FROM users WHERE email=?
    DB-->>UserRepo: User record with BCrypt hash
    AuthSvc->>AuthSvc: BCrypt.checkpw(password, hash)
    AuthSvc->>JwtProv: generateToken(UserPrincipal)
    JwtProv-->>AuthSvc: Signed JWT (HS256)
    AuthSvc-->>AuthCtrl: AuthResponse (token, role, user details)
    AuthCtrl-->>AuthContext: HTTP 200 ApiResponse<AuthResponse>
    AuthContext->>User: Persist token in localStorage & update state
```

### 3.2 Secure API Request Flow with JWT Interceptor
```mermaid
sequenceDiagram
    autonumber
    actor Client as React Client (Axios)
    participant Filter as JwtAuthenticationFilter
    participant Provider as JwtTokenProvider
    participant UserDetails as CustomUserDetailsService
    participant Controller as ApplicationController
    participant Service as ApplicationService

    Client->>Filter: GET /api/applications/my-applications (Header: Bearer <token>)
    Filter->>Provider: validateToken(token)
    Provider-->>Filter: Valid = true
    Filter->>Provider: getEmailFromToken(token)
    Provider-->>Filter: user@hirehub.com
    Filter->>UserDetails: loadUserByUsername(email)
    UserDetails-->>Filter: UserPrincipal (id, role, authorities)
    Filter->>Filter: SecurityContextHolder.setAuthentication()
    Filter->>Controller: Forward to getMyApplications()
    Controller->>Service: getMyApplications(userId, pageable)
    Service-->>Controller: PagedResponse<ApplicationDto>
    Controller-->>Client: HTTP 200 OK (JSON)
```

### 3.3 AI Resume Analysis Flow (Resilient Hybrid Pipeline)
```mermaid
sequenceDiagram
    autonumber
    actor User as Job Seeker
    participant UI as ResumeAnalyzer.jsx
    participant AI_Ctrl as AIController
    participant AI_Svc as AIAnalysisService
    participant Gemini as GeminiAiService
    participant Fallback as FallbackAiEngine
    participant Repo as AIAnalysisRepository
    participant DB as MySQL Database

    User->>UI: Paste Resume Text & Click "Run AI Analysis"
    UI->>AI_Ctrl: POST /api/ai/resume-analyzer (JWT Bearer)
    AI_Ctrl->>AI_Svc: analyzeResume(userId, request)
    
    alt Gemini API Key Available & Valid
        AI_Svc->>Gemini: generateContent(prompt, resumeText)
        Gemini-->>AI_Svc: Structured JSON (Score, Detected, Missing, Recommendations)
    else API Key Missing / Rate Limited / Offline
        AI_Svc->>Fallback: analyzeResume(resumeText, targetRole)
        Fallback-->>AI_Svc: Deterministic Heuristic ATS Breakdown
    end

    AI_Svc->>Repo: save(AIAnalysis entity with result_json)
    Repo->>DB: INSERT INTO ai_analyses ...
    AI_Svc-->>AI_Ctrl: AIResumeAnalysisDto
    AI_Ctrl-->>UI: HTTP 200 OK
    UI->>User: Display ATS Score gauge, detected skills & tips
```

---

## 4. Network & Deployment Topology

```mermaid
graph LR
    subgraph "Local Development / Production Host"
        subgraph "Frontend Network (Port 5173)"
            VITE[Vite Web Server]
            PROXY[Vite Reverse Proxy /api]
            VITE --- PROXY
        end

        subgraph "Backend Network (Port 8080)"
            TOMCAT[Embedded Tomcat Server]
            SPRING[Spring Boot Application]
            TOMCAT --- SPRING
        end

        subgraph "Database Server (Port 3306)"
            MYSQL[(MySQL Server hirehub_db)]
        end
    end

    subgraph "External Cloud Services"
        GOOGLE[Google Gemini AI API Endpoint]
    end

    BROWSER[User Browser Client] -->|HTTP / localhost:5173| VITE
    PROXY -->|Local Reverse Proxy| TOMCAT
    SPRING -->|JDBC / localhost:3306| MYSQL
    SPRING -->|HTTPS POST / REST| GOOGLE
```

---

## 5. Error Handling & Resilience Architecture

HireHub implements a centralized exception handling architecture utilizing Spring's `@RestControllerAdvice`:

1. **`GlobalExceptionHandler`:** Intercepts runtime exceptions globally across all controllers.
2. **`ResourceNotFoundException`:** Returns HTTP 404 with standard JSON payload:
   ```json
   {
     "success": false,
     "message": "Job not found with id : 99",
     "data": null,
     "timestamp": "2026-11-25T16:00:00"
   }
   ```
3. **`BadRequestException`:** Returns HTTP 400 for business logic rule violations.
4. **`UnauthorizedException`:** Returns HTTP 401 for invalid credentials or expired JWT tokens.
5. **Bean Validation Handler:** Catches `MethodArgumentNotValidException` and returns a field-level error dictionary (e.g. `{"email": "Email must be valid", "title": "Job title is required"}`).
