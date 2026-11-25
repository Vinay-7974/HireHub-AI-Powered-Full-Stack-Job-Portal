package com.hirehub.jobportal.ai;

import com.hirehub.jobportal.dto.ai.*;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;

@Component
public class FallbackAiEngine {

    private static final Map<String, List<String>> ROLE_SKILLS_MAP = new HashMap<>();

    static {
        ROLE_SKILLS_MAP.put("frontend", List.of("React", "JavaScript", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "Redux", "Next.js", "Git", "REST APIs"));
        ROLE_SKILLS_MAP.put("backend", List.of("Java", "Spring Boot", "MySQL", "PostgreSQL", "REST APIs", "Hibernate", "Microservices", "Docker", "Redis", "Kafka"));
        ROLE_SKILLS_MAP.put("fullstack", List.of("React", "Java", "Spring Boot", "Node.js", "MySQL", "Docker", "Git", "REST APIs", "Tailwind CSS", "AWS"));
        ROLE_SKILLS_MAP.put("devops", List.of("Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Linux", "Git", "Jenkins", "Monitoring", "Prometheus"));
        ROLE_SKILLS_MAP.put("data", List.of("Python", "SQL", "Pandas", "Machine Learning", "Tableau", "Power BI", "Spark", "Data Modeling", "TensorFlow", "Statistics"));
    }

    public AIResumeAnalysisDto.Response analyzeResume(String resumeText, String targetRole) {
        String lowerText = (resumeText != null) ? resumeText.toLowerCase() : "";
        String roleKey = detectRoleKey(targetRole);
        List<String> expectedSkills = ROLE_SKILLS_MAP.getOrDefault(roleKey, ROLE_SKILLS_MAP.get("fullstack"));

        List<String> detected = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String skill : expectedSkills) {
            if (Pattern.compile("\\b" + Pattern.quote(skill.toLowerCase()) + "\\b").matcher(lowerText).find()) {
                detected.add(skill);
            } else {
                missing.add(skill);
            }
        }

        // Heuristics for scoring
        int skillScore = (int) Math.round(((double) detected.size() / Math.max(1, expectedSkills.size())) * 50);
        int lengthScore = Math.min(30, lowerText.length() > 500 ? 30 : (lowerText.length() / 20));
        int structureScore = 15;
        if (lowerText.contains("experience") || lowerText.contains("work")) structureScore += 3;
        if (lowerText.contains("education") || lowerText.contains("degree")) structureScore += 2;

        int overallScore = Math.min(96, Math.max(45, skillScore + lengthScore + structureScore));
        int atsScore = Math.min(94, Math.max(50, (int) (overallScore * 0.95) + (detected.size() * 2)));

        List<String> strengths = new ArrayList<>();
        strengths.add("Clear demonstration of foundational technologies: " + String.join(", ", detected.subList(0, Math.min(3, detected.size()))));
        strengths.add("Strong presentation of project deliverables and practical contributions.");
        strengths.add("Effective ATS-friendly font hierarchy and chronological sequencing.");

        List<String> weakSections = new ArrayList<>();
        if (!lowerText.contains("metrics") && !lowerText.contains("%") && !lowerText.contains("$")) {
            weakSections.add("Quantifiable impact: Add concrete metrics (e.g., 'reduced latency by 35%').");
        }
        if (missing.size() > 2) {
            weakSections.add("Missing target role keywords: " + String.join(", ", missing.subList(0, Math.min(3, missing.size()))));
        }

        List<String> suggestions = new ArrayList<>();
        suggestions.add("Incorporate action verbs at the start of bullet points (e.g., Architected, Optimized, Spearheaded).");
        suggestions.add("Tailor the summary statement to target '" + (targetRole != null ? targetRole : "Software Engineer") + "' specifically.");
        suggestions.add("Add a designated Technical Skills matrix grouped by Languages, Frameworks, and Tools.");

        List<String> formatting = new ArrayList<>();
        formatting.add("Keep standard 1-inch margins to avoid printer truncation in enterprise screening systems.");
        formatting.add("Use standard bullet symbols rather than decorative shapes for best OCR parser compatibility.");

        return AIResumeAnalysisDto.Response.builder()
                .overallScore(overallScore)
                .atsScore(atsScore)
                .summary("Resume exhibits good technical baseline for " + (targetRole != null ? targetRole : "target positions") + ". Incorporating quantifiable metrics and missing keywords will boost recruiter conversion.")
                .skillsDetected(detected)
                .missingSkills(missing)
                .strengths(strengths)
                .weakSections(weakSections)
                .improvementSuggestions(suggestions)
                .formattingRecommendations(formatting)
                .isAIAvailable(false)
                .build();
    }

    public AIJobMatchDto.Response matchJob(String jobDescription, List<String> requiredSkills, List<String> candidateSkills) {
        Set<String> targetSet = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        if (requiredSkills != null) targetSet.addAll(requiredSkills);

        Set<String> userSet = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        if (candidateSkills != null) userSet.addAll(candidateSkills);

        List<String> matching = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String req : targetSet) {
            if (userSet.contains(req)) {
                matching.add(req);
            } else {
                missing.add(req);
            }
        }

        int total = Math.max(1, targetSet.size());
        int matchPct = Math.min(98, Math.max(25, (int) Math.round(((double) matching.size() / total) * 100)));

        String explanation = matchPct >= 75
                ? "Excellent match! Candidate profile covers " + matching.size() + " out of " + total + " critical core requirements."
                : "Moderate match. Profile demonstrates strong potential, but lacks explicit experience in key competencies: " + String.join(", ", missing.subList(0, Math.min(3, missing.size())));

        List<String> recommendations = new ArrayList<>();
        if (!missing.isEmpty()) {
            recommendations.add("Highlight any hands-on exposure or personal projects using " + missing.get(0) + ".");
        }
        recommendations.add("Customize your application summary to mirror the employer's stated architectural priorities.");

        return AIJobMatchDto.Response.builder()
                .matchPercentage(matchPct)
                .matchExplanation(explanation)
                .matchingSkills(matching)
                .missingSkills(missing)
                .recommendations(recommendations)
                .isAIAvailable(false)
                .build();
    }

    public AICoverLetterDto.Response generateCoverLetter(String jobTitle, String companyName, String jobDesc, String profileSummary, String tone) {
        String company = (companyName != null && !companyName.isBlank()) ? companyName : "your organization";
        String title = (jobTitle != null && !jobTitle.isBlank()) ? jobTitle : "Software Engineering position";
        String toneName = (tone != null && !tone.isBlank()) ? tone : "Professional";

        String text = "Dear Hiring Team at " + company + ",\n\n" +
                "I am writing to express my strong enthusiasm for the " + title + " opening. Having followed " + company + "'s impressive innovations, I am eager to contribute my technical foundation, problem-solving mindset, and dedication to high-performance software delivery.\n\n" +
                "Throughout my experience, I have developed a strong command of modern software architecture, collaborative version control, and building resilient, user-focused digital solutions. " +
                (profileSummary != null && !profileSummary.isBlank() ? "Specifically, " + profileSummary + " " : "") +
                "I thrive in agile, fast-paced environments where ownership, clear communication, and continuous learning are prioritized.\n\n" +
                "I am particularly drawn to " + company + " because of your standard of engineering excellence and commitment to impactful products. I welcome the opportunity to discuss how my skill set aligns with your team's objectives in greater detail.\n\n" +
                "Thank you for your time and consideration.\n\n" +
                "Sincerely,\nCandidate";

        return AICoverLetterDto.Response.builder()
                .coverLetter(text)
                .toneUsed(toneName)
                .isAIAvailable(false)
                .build();
    }

    public AIInterviewPrepDto.Response generateInterviewPrep(String jobTitle, String experienceLevel) {
        String role = (jobTitle != null && !jobTitle.isBlank()) ? jobTitle : "Software Engineer";
        List<AIInterviewPrepDto.QuestionItem> questions = new ArrayList<>();

        questions.add(new AIInterviewPrepDto.QuestionItem(
                "Technical",
                "How do you design and structure RESTful APIs for high availability, idempotency, and security?",
                "Use HTTP methods semantically (GET, POST, PUT, DELETE), enforce stateless JWT authentication, implement rate limiting, and design idempotent endpoints using unique request tokens or standard PUT/DELETE semantics.",
                "Mention status code standards (200, 201, 400, 401, 404, 500) and pagination techniques."
        ));

        questions.add(new AIInterviewPrepDto.QuestionItem(
                "System Design",
                "How would you scale a web service that experiences 10x traffic spikes during product launches?",
                "Introduce horizontal auto-scaling, an asynchronous queue (e.g. RabbitMQ/Kafka) for write spikes, an in-memory cache (Redis) for hot read paths, and a CDN for static frontend assets.",
                "Walk the interviewer through the flow from DNS/CDN to Application Servers and Database read-replicas."
        ));

        questions.add(new AIInterviewPrepDto.QuestionItem(
                "Behavioral",
                "Describe a situation where you had a disagreement with a team member over a technical decision. How did you resolve it?",
                "Focus on the STAR method (Situation, Task, Action, Result). State the two technical approaches neutrally, describe how you benchmarked or prototyped both against project goals, and aligned on the data-backed choice.",
                "Emphasize empathy, collaborative alignment, and keeping team velocity first."
        ));

        questions.add(new AIInterviewPrepDto.QuestionItem(
                "HR",
                "Why are you interested in joining our team, and where do you see your technical trajectory over the next 3 years?",
                "Connect your passion for the domain with the company's tech stack and culture. Articulate goals of growing into architectural leadership, mentoring peers, and driving scalable system design.",
                "Be authentic and demonstrate that you have researched the team's mission."
        ));

        List<String> tips = List.of(
                "Use the STAR method for behavioral questions: Situation, Task, Action, Result.",
                "Clarify requirements and edge cases before jumping into technical solutions.",
                "Prepare 2-3 thoughtful questions for the interviewers about their tech debt, team culture, and roadmap."
        );

        return AIInterviewPrepDto.Response.builder()
                .jobTitle(role)
                .questions(questions)
                .generalTips(tips)
                .isAIAvailable(false)
                .build();
    }

    public AIChatDto.Response answerCareerChat(Long conversationId, String message) {
        String query = (message != null) ? message.toLowerCase() : "";
        String reply;

        if (query.contains("resume") || query.contains("cv")) {
            reply = "To make your resume stand out in competitive screening:\n\n" +
                    "1. **Use the X-Y-Z formula**: 'Accomplished [X], as measured by [Y], by doing [Z]'.\n" +
                    "2. **Clean Single-Column Layout**: High-volume ATS parsers perform best with single-column linear hierarchy.\n" +
                    "3. **Skill Categorization**: Group your tech stack into Languages, Frameworks, Cloud/DevOps, and Databases.\n\n" +
                    "Would you like me to analyze a specific draft or target role?";
        } else if (query.contains("interview") || query.contains("prepare")) {
            reply = "Effective interview preparation focuses on three pillars:\n\n" +
                    "1. **Core Data Structures & Algorithms / Technical Mastery**: Practice explaining trade-offs (Time & Space complexity).\n" +
                    "2. **System Design & API Architecture**: Be ready to talk about latency, caching, database indexing, and microservices.\n" +
                    "3. **Behavioral STAR Stories**: Prepare 4-5 core stories that demonstrate leadership, conflict resolution, and handling ambiguity.\n\n" +
                    "What specific role or topic are you interviewing for?";
        } else if (query.contains("salary") || query.contains("offer")) {
            reply = "When negotiating compensation:\n\n" +
                    "1. **Anchor with Market Research**: Reference ranges from Levels.fyi, Glassdoor, and regional benchmarks.\n" +
                    "2. **Frame value in terms of impact**: Articulate how your domain skills reduce ramp-up time and accelerate delivery.\n" +
                    "3. **Consider the Total Package**: Base salary, performance bonus, equity/stock options, remote stipends, and growth opportunities.\n\n" +
                    "Would you like help drafting a counter-offer email?";
        } else {
            reply = "Hello! I am your HireHub AI Career Assistant. I can help you with:\n\n" +
                    "• **Resume Optimization & ATS Scoring**\n" +
                    "• **Job Matching & Skill Gap Analysis**\n" +
                    "• **Tailored Cover Letter Generation**\n" +
                    "• **Technical & Behavioral Interview Coaching**\n\n" +
                    "What career goal are you working on today?";
        }

        return AIChatDto.Response.builder()
                .conversationId(conversationId != null ? conversationId : 1L)
                .title("Career Guidance")
                .reply(reply)
                .isAIAvailable(false)
                .build();
    }

    public AISkillGapDto.Response analyzeSkillGap(String targetRole, List<String> currentSkills, List<String> targetJobSkills) {
        String role = (targetRole != null && !targetRole.isBlank()) ? targetRole : "Senior Full Stack Engineer";
        List<String> targetSkills = (targetJobSkills != null && !targetJobSkills.isEmpty())
                ? targetJobSkills
                : ROLE_SKILLS_MAP.getOrDefault(detectRoleKey(role), ROLE_SKILLS_MAP.get("fullstack"));

        Set<String> userSet = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        if (currentSkills != null) userSet.addAll(currentSkills);

        List<String> matching = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String skill : targetSkills) {
            if (userSet.contains(skill)) {
                matching.add(skill);
            } else {
                missing.add(skill);
            }
        }

        int readiness = Math.min(95, Math.max(30, (int) Math.round(((double) matching.size() / Math.max(1, targetSkills.size())) * 100)));

        List<AISkillGapDto.LearningStep> roadmap = new ArrayList<>();
        for (int i = 0; i < missing.size(); i++) {
            String skill = missing.get(i);
            String priority = i == 0 ? "High" : (i == 1 ? "High" : (i == 2 ? "Medium" : "Low"));
            String time = i < 2 ? "2-3 weeks" : "3-4 weeks";
            String res = "Official Documentation + Build 1 production-style mini-project";
            roadmap.add(new AISkillGapDto.LearningStep(skill, priority, time, res));
        }

        return AISkillGapDto.Response.builder()
                .targetRole(role)
                .readinessScore(readiness)
                .matchingSkills(matching)
                .missingSkills(missing)
                .learningRoadmap(roadmap)
                .isAIAvailable(false)
                .build();
    }

    private String detectRoleKey(String role) {
        if (role == null) return "fullstack";
        String r = role.toLowerCase();
        if (r.contains("front") || r.contains("react") || r.contains("ui")) return "frontend";
        if (r.contains("back") || r.contains("spring") || r.contains("api")) return "backend";
        if (r.contains("devops") || r.contains("cloud") || r.contains("infra")) return "devops";
        if (r.contains("data") || r.contains("ai") || r.contains("ml")) return "data";
        return "fullstack";
    }
}
