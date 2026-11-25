# HireHub — Installation & Local Deployment Guide

## 1. System Prerequisites

Before running HireHub, ensure the following tools are installed on your machine:

| Tool | Minimum Version | Recommended Source |
| :--- | :--- | :--- |
| **Java JDK** | 21 LTS | [Eclipse Temurin OpenJDK 21](https://adoptium.net/) |
| **Node.js & npm**| 20+ LTS (verified on v26.13) | [Node.js Official LTS](https://nodejs.org/) |
| **Apache Maven** | 3.9+ | [Apache Maven Downloads](https://maven.apache.org/) |
| **MySQL Server** | 8.0+ | [MySQL Community Server](https://dev.mysql.com/downloads/) |
| **Git** | 2.40+ | [Git SCM](https://git-scm.com/) |

Verify tool availability in your terminal:
```bash
java -version
mvn -v
node -v
npm -v
mysql --version
```

---

## 2. Step 1: Database Setup (MySQL 8)

1. Start your local MySQL server (default port `3306`).
2. Log into MySQL as the `root` administrative user:
   ```bash
   mysql -u root -p
   ```
3. Create the `hirehub_db` database with UTF-8 character encoding:
   ```sql
   CREATE DATABASE hirehub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   SHOW DATABASES;
   EXIT;
   ```

*Note: Hibernate will automatically generate all 20 tables and constraints upon first Spring Boot startup via `spring.jpa.hibernate.ddl-auto=update`.*

---

## 3. Step 2: Backend Configuration & Execution

### 3.1 Navigate to the Backend Directory
```bash
cd backend
```

### 3.2 Environment Variables (Optional)
HireHub includes safe local defaults (`root`/`root` for MySQL), but you can customize credentials via environment variables:
```bash
# Windows PowerShell
$env:DB_URL="jdbc:mysql://localhost:3306/hirehub_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
$env:JWT_SECRET="yourSuperSecretKeyForJwtSigningMustBeAtLeast256BitsLong2026"
$env:GEMINI_API_KEY="" # Optional: Leave blank to use internal Fallback AI Engine

# macOS / Linux Bash
export DB_URL="jdbc:mysql://localhost:3306/hirehub_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
export DB_USERNAME="root"
export DB_PASSWORD="your_mysql_password"
```

### 3.3 Compile and Package the Application
```bash
mvn clean package -DskipTests
```
This generates the standalone executable JAR file at `target/hirehub-backend-1.0.0.jar`.

### 3.4 Run the Backend Application
```bash
java -jar target/hirehub-backend-1.0.0.jar
```
- **Listening Port:** `http://localhost:8080`
- **Interactive Swagger Documentation:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Data Initialization:** On first run, `DataInitializer` pre-seeds companies (Stripe, Linear, Notion), jobs, applications, and demo accounts.

---

## 4. Step 3: Frontend Setup & Execution

### 4.1 Navigate to the Frontend Directory
Open a new terminal window:
```bash
cd frontend
```

### 4.2 Install Dependencies
```bash
npm install
```

### 4.3 Start the Vite Development Server
```bash
npm run dev
```
- **Local Application URL:** [http://localhost:5173](http://localhost:5173)
- The Vite development server automatically proxies all `/api/*` network requests to the Spring Boot backend on port 8080.

---

## 5. Step 4: Verification & 1-Click Testing

1. Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**.
2. In the top navigation bar, use the **"Persona"** dropdown to switch between pre-seeded test accounts:

| Role | Email | Password | Persona |
| :--- | :--- | :--- | :--- |
| **Job Seeker** | `seeker@hirehub.com` | `password123` | Alex Rivera (Full-Stack Engineer) |
| **Recruiter** | `recruiter@stripe.com` | `password123` | Sarah (Stripe Talent Acquisition) |
| **Recruiter** | `recruiter@linear.app` | `password123` | Marcus (Linear Hiring Team) |
| **Admin** | `admin@hirehub.com` | `password123` | System Administrator |

---

## 6. Troubleshooting Common Issues

### Issue 1: Port 8080 or 5173 Already in Use
Find and terminate existing processes:
```powershell
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process -Force
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force
```

### Issue 2: MySQL Access Denied
Ensure your password in `$env:DB_PASSWORD` or `application.properties` matches your local MySQL `root` account credentials.

### Issue 3: PowerShell Script Execution Policy
If `npm` or `mvn` reports a `.ps1 cannot be loaded` security error, run:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
or use `npm.cmd` directly.
