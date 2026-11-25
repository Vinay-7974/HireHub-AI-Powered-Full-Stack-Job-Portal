package com.hirehub.jobportal.util;

import com.hirehub.jobportal.entity.*;
import com.hirehub.jobportal.entity.enums.*;
import com.hirehub.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final SkillRepository skillRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded with demo data.");
            return;
        }

        log.info("Starting HireHub data initialization...");

        // 1. Seed Skills
        List<String> skills = List.of(
                "React", "JavaScript", "TypeScript", "Java", "Spring Boot", "MySQL", "PostgreSQL",
                "Docker", "Kubernetes", "AWS", "Git", "REST APIs", "GraphQL", "Tailwind CSS",
                "Node.js", "Python", "Microservices", "Kafka", "Redis", "Figma", "CI/CD"
        );
        for (String s : skills) {
            skillRepository.save(Skill.builder().name(s).category("Tech").build());
        }

        // 2. Admin User
        User admin = userRepository.save(User.builder()
                .email("admin@hirehub.com")
                .password(passwordEncoder.encode("password123"))
                .fullName("System Administrator")
                .phone("+1 (555) 019-2834")
                .role(Role.ROLE_ADMIN)
                .active(true)
                .build());

        // 3. Companies
        Company stripe = companyRepository.save(Company.builder()
                .name("Stripe")
                .logo("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80")
                .description("Financial infrastructure for the internet. Millions of businesses use Stripe to accept payments, grow revenue, and manage financial operations.")
                .website("https://stripe.com")
                .industry("Fintech")
                .companySize("5000+ employees")
                .location("San Francisco, CA / Remote")
                .verified(true)
                .build());

        Company linear = companyRepository.save(Company.builder()
                .name("Linear")
                .logo("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80")
                .description("Linear is a purposeful tool for modern software development. Streamline issues, projects, and product roadmaps with unmatched speed.")
                .website("https://linear.app")
                .industry("Software & Productivity")
                .companySize("100-500 employees")
                .location("San Francisco, CA / Remote")
                .verified(true)
                .build());

        Company notion = companyRepository.save(Company.builder()
                .name("Notion")
                .logo("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80")
                .description("The all-in-one connected workspace for your wiki, docs, and projects. Millions use Notion every day to organize their ideas and workflows.")
                .website("https://notion.so")
                .industry("Software & Productivity")
                .companySize("1000-5000 employees")
                .location("New York, NY / Hybrid")
                .verified(true)
                .build());

        // 4. Recruiters
        User recruiterStripe = userRepository.save(User.builder()
                .email("recruiter@stripe.com")
                .password(passwordEncoder.encode("password123"))
                .fullName("Sarah Jenkins")
                .phone("+1 (555) 349-1122")
                .role(Role.ROLE_RECRUITER)
                .active(true)
                .build());

        recruiterProfileRepository.save(RecruiterProfile.builder()
                .user(recruiterStripe)
                .company(stripe)
                .designation("Senior Talent Acquisition Lead")
                .department("Engineering Staffing")
                .build());

        User recruiterLinear = userRepository.save(User.builder()
                .email("recruiter@linear.app")
                .password(passwordEncoder.encode("password123"))
                .fullName("Marcus Chen")
                .phone("+1 (555) 782-9901")
                .role(Role.ROLE_RECRUITER)
                .active(true)
                .build());

        recruiterProfileRepository.save(RecruiterProfile.builder()
                .user(recruiterLinear)
                .company(linear)
                .designation("Head of Talent")
                .department("Core Team")
                .build());

        // 5. Job Seeker
        User seeker = userRepository.save(User.builder()
                .email("seeker@hirehub.com")
                .password(passwordEncoder.encode("password123"))
                .fullName("Alex Rivera")
                .phone("+1 (555) 890-4411")
                .role(Role.ROLE_JOB_SEEKER)
                .active(true)
                .build());

        JobSeekerProfile seekerProfile = JobSeekerProfile.builder()
                .user(seeker)
                .headline("Senior Full Stack Engineer | React & Spring Boot")
                .about("Passionate software engineer with 5+ years of production experience designing and building high-traffic, reliable web systems and distributed microservices.")
                .location("San Francisco, CA")
                .preferredRole("Senior Full Stack Engineer")
                .preferredLocation("Remote or Hybrid")
                .expectedSalary(165000.0)
                .workPreferences("Full-time, Remote")
                .portfolioUrl("https://alexrivera.dev")
                .linkedInUrl("https://linkedin.com/in/alexrivera")
                .gitHubUrl("https://github.com/alexrivera")
                .resumeOriginalName("Alex_Rivera_Resume_2026.pdf")
                .resumeText("Alex Rivera. Senior Full Stack Engineer. 5 years building with React, TypeScript, Java, Spring Boot, MySQL, REST APIs, Docker, and AWS.")
                .profileCompletionPercentage(85)
                .skills(List.of("React", "Java", "Spring Boot", "TypeScript", "MySQL", "Docker", "REST APIs", "Tailwind CSS"))
                .build();

        seekerProfile.getExperienceList().add(Experience.builder()
                .jobSeekerProfile(seekerProfile)
                .title("Full Stack Engineer")
                .company("Acme Cloud Systems")
                .location("San Francisco, CA")
                .startDate(LocalDate.of(2021, 6, 1))
                .isCurrent(true)
                .description("Spearheaded migration to modern microservices, reducing API latency by 32% and scaling to 1.2M daily active users.")
                .build());

        seekerProfile.getEducationList().add(Education.builder()
                .jobSeekerProfile(seekerProfile)
                .degree("B.S. in Computer Science")
                .institution("University of California, Berkeley")
                .fieldOfStudy("Software Engineering & Distributed Systems")
                .startDate(LocalDate.of(2017, 9, 1))
                .endDate(LocalDate.of(2021, 5, 20))
                .grade("3.85 GPA")
                .build());

        jobSeekerProfileRepository.save(seekerProfile);

        // 6. Job Postings
        Job job1 = jobRepository.save(Job.builder()
                .company(stripe)
                .recruiter(recruiterStripe)
                .title("Senior Full Stack Engineer")
                .description("Join our Global Payouts team to build reliable, high-throughput financial infrastructure processing billions of transactions worldwide.")
                .responsibilities("• Architect resilient RESTful APIs and distributed workflows.\n• Build intuitive user experiences with React and Tailwind CSS.\n• Ensure 99.999% uptime for mission-critical payment rails.")
                .requirements("• 5+ years of software engineering experience.\n• Strong background in Java/Spring Boot and modern React.\n• Solid understanding of relational database design (MySQL/PostgreSQL).")
                .salaryMin(160000.0)
                .salaryMax(210000.0)
                .location("Remote (US/Europe)")
                .employmentType(EmploymentType.FULL_TIME)
                .workMode(WorkMode.REMOTE)
                .experienceLevel(ExperienceLevel.SENIOR_LEVEL)
                .category("Software Engineering")
                .status(JobStatus.PUBLISHED)
                .deadline(LocalDate.now().plusDays(45))
                .benefits("Comprehensive healthcare, 401(k) matching, home office stipend, generous PTO.")
                .requiredSkills(List.of("React", "Java", "Spring Boot", "MySQL", "REST APIs", "Docker"))
                .viewsCount(284L)
                .build());

        Job job2 = jobRepository.save(Job.builder()
                .company(linear)
                .recruiter(recruiterLinear)
                .title("Principal Frontend Architect")
                .description("Lead frontend engineering for Linear's lightning-fast desktop and web clients, pushing the boundaries of interaction speed and local-first architecture.")
                .responsibilities("• Design next-generation frontend architectures with 60fps responsiveness.\n• Drive web performance, bundle size optimization, and client cache sync.\n• Mentor engineering peers and elevate design-system standards.")
                .requirements("• 7+ years of dedicated web frontend architecture experience.\n• Deep mastery of React, TypeScript, and state management.\n• Keen eye for micro-interactions, typography, and motion design.")
                .salaryMin(180000.0)
                .salaryMax(240000.0)
                .location("San Francisco, CA / Remote")
                .employmentType(EmploymentType.FULL_TIME)
                .workMode(WorkMode.REMOTE)
                .experienceLevel(ExperienceLevel.LEAD)
                .category("Frontend & Design")
                .status(JobStatus.PUBLISHED)
                .deadline(LocalDate.now().plusDays(30))
                .benefits("Equity grant, wellness allowance, premium hardware budget, bi-annual offsites.")
                .requiredSkills(List.of("React", "TypeScript", "Tailwind CSS", "Git", "Figma"))
                .viewsCount(412L)
                .build());

        Job job3 = jobRepository.save(Job.builder()
                .company(notion)
                .recruiter(recruiterStripe)
                .title("Lead Backend Platform Engineer")
                .description("Help architect the collaborative data engine powering hundreds of millions of real-time collaborative Notion pages, blocks, and databases.")
                .responsibilities("• Scale distributed document storage and real-time syncing mechanisms.\n• Optimize database query pipelines and distributed caching layers.\n• Lead incident resolution and fault-tolerant architecture initiatives.")
                .requirements("• 6+ years in backend systems with Java or Go.\n• Experience with event streaming (Kafka) and distributed key-value stores.\n• Deep knowledge of database query plans and concurrency control.")
                .salaryMin(165000.0)
                .salaryMax(220000.0)
                .location("New York, NY / Hybrid")
                .employmentType(EmploymentType.FULL_TIME)
                .workMode(WorkMode.HYBRID)
                .experienceLevel(ExperienceLevel.SENIOR_LEVEL)
                .category("Backend & Cloud")
                .status(JobStatus.PUBLISHED)
                .deadline(LocalDate.now().plusDays(60))
                .benefits("Full health & dental, flexible hybrid schedule, catered lunches, commuter benefits.")
                .requiredSkills(List.of("Java", "Spring Boot", "Microservices", "Kafka", "MySQL", "AWS"))
                .viewsCount(195L)
                .build());

        // 7. Seed Applications
        Application app1 = applicationRepository.save(Application.builder()
                .job(job1)
                .applicant(seeker)
                .status(ApplicationStatus.INTERVIEW)
                .aiMatchScore(92)
                .aiMatchExplanation("Candidate profile demonstrates strong alignment with Stripe requirements: 5+ years experience, solid React and Spring Boot background, and clean relational database expertise.")
                .coverLetter("I am thrilled to apply for the Senior Full Stack Engineer role at Stripe. Having scaled mission-critical backend systems and crafted intuitive web applications, I look forward to contributing to Stripe's global payments infrastructure.")
                .recruiterNotes("Strong technical candidate. Progress to technical interview round.")
                .build());

        // 8. Seed Scheduled Interview
        interviewRepository.save(Interview.builder()
                .application(app1)
                .recruiter(recruiterStripe)
                .applicant(seeker)
                .interviewDate(LocalDateTime.now().plusDays(3).withHour(15).withMinute(0))
                .interviewType(InterviewType.TECHNICAL)
                .meetingLink("https://meet.google.com/hhr-zydw-kpm")
                .notes("Focus on distributed systems design and live React state management problem.")
                .status(InterviewStatus.SCHEDULED)
                .build());

        log.info("HireHub demo data initialization completed successfully!");
    }
}
