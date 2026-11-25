package com.hirehub.jobportal.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hirehub.jobportal.dto.ai.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiAiService {

    @Value("${hirehub.ai.gemini.api-key:}")
    private String apiKey;

    @Value("${hirehub.ai.gemini.model:gemini-1.5-flash}")
    private String model;

    @Value("${hirehub.ai.gemini.endpoint:https://generativelanguage.googleapis.com/v1beta/models}")
    private String endpoint;

    private final FallbackAiEngine fallbackAiEngine;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean isAiConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    public AIResumeAnalysisDto.Response analyzeResume(String resumeText, String targetRole) {
        if (!isAiConfigured()) {
            return fallbackAiEngine.analyzeResume(resumeText, targetRole);
        }

        try {
            String prompt = String.format(
                    "You are an expert ATS resume reviewer and senior technical recruiter. Analyze the following resume text for the role of '%s'. " +
                    "Respond ONLY with a valid JSON object matching this schema: " +
                    "{\"overallScore\": number(0-100), \"atsScore\": number(0-100), \"summary\": string, " +
                    "\"skillsDetected\": [string], \"missingSkills\": [string], \"strengths\": [string], " +
                    "\"weakSections\": [string], \"improvementSuggestions\": [string], \"formattingRecommendations\": [string]}. " +
                    "Resume text:\n%s",
                    targetRole != null ? targetRole : "Software Engineer",
                    resumeText != null ? resumeText : ""
            );

            String rawJson = callGeminiApi(prompt);
            JsonNode root = parseJsonFromResponse(rawJson);

            AIResumeAnalysisDto.Response response = AIResumeAnalysisDto.Response.builder()
                    .overallScore(root.path("overallScore").asInt(80))
                    .atsScore(root.path("atsScore").asInt(78))
                    .summary(root.path("summary").asText("Resume analyzed successfully by Gemini AI."))
                    .skillsDetected(extractStringList(root.path("skillsDetected")))
                    .missingSkills(extractStringList(root.path("missingSkills")))
                    .strengths(extractStringList(root.path("strengths")))
                    .weakSections(extractStringList(root.path("weakSections")))
                    .improvementSuggestions(extractStringList(root.path("improvementSuggestions")))
                    .formattingRecommendations(extractStringList(root.path("formattingRecommendations")))
                    .isAIAvailable(true)
                    .build();

            return response;
        } catch (Exception ex) {
            log.warn("Gemini AI invocation failed, falling back to heuristic engine: {}", ex.getMessage());
            AIResumeAnalysisDto.Response fallback = fallbackAiEngine.analyzeResume(resumeText, targetRole);
            return fallback;
        }
    }

    public AIJobMatchDto.Response matchJob(String jobDescription, List<String> requiredSkills, List<String> candidateSkills) {
        if (!isAiConfigured()) {
            return fallbackAiEngine.matchJob(jobDescription, requiredSkills, candidateSkills);
        }

        try {
            String prompt = String.format(
                    "You are an AI recruiting match specialist. Compare candidate skills: %s with job requirements: %s and description: %s. " +
                    "Respond ONLY with a JSON object: {\"matchPercentage\": number(0-100), \"matchExplanation\": string, " +
                    "\"matchingSkills\": [string], \"missingSkills\": [string], \"recommendations\": [string]}",
                    candidateSkills != null ? candidateSkills.toString() : "[]",
                    requiredSkills != null ? requiredSkills.toString() : "[]",
                    jobDescription != null ? jobDescription : ""
            );

            String rawJson = callGeminiApi(prompt);
            JsonNode root = parseJsonFromResponse(rawJson);

            return AIJobMatchDto.Response.builder()
                    .matchPercentage(root.path("matchPercentage").asInt(75))
                    .matchExplanation(root.path("matchExplanation").asText())
                    .matchingSkills(extractStringList(root.path("matchingSkills")))
                    .missingSkills(extractStringList(root.path("missingSkills")))
                    .recommendations(extractStringList(root.path("recommendations")))
                    .isAIAvailable(true)
                    .build();
        } catch (Exception ex) {
            log.warn("Gemini AI match failed: {}", ex.getMessage());
            return fallbackAiEngine.matchJob(jobDescription, requiredSkills, candidateSkills);
        }
    }

    public AICoverLetterDto.Response generateCoverLetter(String jobTitle, String companyName, String jobDesc, String profileSummary, String tone) {
        if (!isAiConfigured()) {
            return fallbackAiEngine.generateCoverLetter(jobTitle, companyName, jobDesc, profileSummary, tone);
        }

        try {
            String prompt = String.format(
                    "Write a professional, compelling cover letter for the role '%s' at '%s'. Tone: '%s'. " +
                    "Job details: %s. Candidate background: %s. Output only the body text of the cover letter.",
                    jobTitle, companyName, tone, jobDesc, profileSummary
            );

            String raw = callGeminiApi(prompt);
            return AICoverLetterDto.Response.builder()
                    .coverLetter(raw.trim())
                    .toneUsed(tone)
                    .isAIAvailable(true)
                    .build();
        } catch (Exception ex) {
            log.warn("Gemini AI cover letter failed: {}", ex.getMessage());
            return fallbackAiEngine.generateCoverLetter(jobTitle, companyName, jobDesc, profileSummary, tone);
        }
    }

    public AIInterviewPrepDto.Response generateInterviewPrep(String jobTitle, String experienceLevel) {
        if (!isAiConfigured()) {
            return fallbackAiEngine.generateInterviewPrep(jobTitle, experienceLevel);
        }

        try {
            String prompt = String.format(
                    "Generate interview preparation for '%s' (%s level). Return ONLY a JSON object: " +
                    "{\"jobTitle\": \"%s\", \"questions\": [{\"category\": string, \"question\": string, \"sampleAnswer\": string, \"keyTip\": string}], " +
                    "\"generalTips\": [string]}",
                    jobTitle, experienceLevel, jobTitle
            );

            String raw = callGeminiApi(prompt);
            JsonNode root = parseJsonFromResponse(raw);

            List<AIInterviewPrepDto.QuestionItem> items = new ArrayList<>();
            JsonNode qNode = root.path("questions");
            if (qNode.isArray()) {
                for (JsonNode item : qNode) {
                    items.add(new AIInterviewPrepDto.QuestionItem(
                            item.path("category").asText(),
                            item.path("question").asText(),
                            item.path("sampleAnswer").asText(),
                            item.path("keyTip").asText()
                    ));
                }
            }

            return AIInterviewPrepDto.Response.builder()
                    .jobTitle(jobTitle)
                    .questions(items)
                    .generalTips(extractStringList(root.path("generalTips")))
                    .isAIAvailable(true)
                    .build();
        } catch (Exception ex) {
            log.warn("Gemini AI interview prep failed: {}", ex.getMessage());
            return fallbackAiEngine.generateInterviewPrep(jobTitle, experienceLevel);
        }
    }

    public AIChatDto.Response answerCareerChat(Long conversationId, String message) {
        if (!isAiConfigured()) {
            return fallbackAiEngine.answerCareerChat(conversationId, message);
        }

        try {
            String prompt = "You are HireHub's AI Career Assistant. Help the user with job search, skills, or career guidance. User question: " + message;
            String raw = callGeminiApi(prompt);
            return AIChatDto.Response.builder()
                    .conversationId(conversationId != null ? conversationId : 1L)
                    .title("Career Guidance")
                    .reply(raw.trim())
                    .isAIAvailable(true)
                    .build();
        } catch (Exception ex) {
            log.warn("Gemini AI chat failed: {}", ex.getMessage());
            return fallbackAiEngine.answerCareerChat(conversationId, message);
        }
    }

    public AISkillGapDto.Response analyzeSkillGap(String targetRole, List<String> currentSkills, List<String> targetJobSkills) {
        if (!isAiConfigured()) {
            return fallbackAiEngine.analyzeSkillGap(targetRole, currentSkills, targetJobSkills);
        }

        try {
            String prompt = String.format(
                    "Perform a skill gap analysis for target role '%s'. Current skills: %s. Target skills: %s. " +
                    "Return ONLY a JSON object: {\"targetRole\": \"%s\", \"readinessScore\": number(0-100), " +
                    "\"matchingSkills\": [string], \"missingSkills\": [string], " +
                    "\"learningRoadmap\": [{\"skill\": string, \"priority\": string, \"estimatedTimeToLearn\": string, \"recommendedResources\": string}]}",
                    targetRole, currentSkills, targetJobSkills, targetRole
            );

            String raw = callGeminiApi(prompt);
            JsonNode root = parseJsonFromResponse(raw);

            List<AISkillGapDto.LearningStep> steps = new ArrayList<>();
            JsonNode stepsNode = root.path("learningRoadmap");
            if (stepsNode.isArray()) {
                for (JsonNode s : stepsNode) {
                    steps.add(new AISkillGapDto.LearningStep(
                            s.path("skill").asText(),
                            s.path("priority").asText(),
                            s.path("estimatedTimeToLearn").asText(),
                            s.path("recommendedResources").asText()
                    ));
                }
            }

            return AISkillGapDto.Response.builder()
                    .targetRole(targetRole)
                    .readinessScore(root.path("readinessScore").asInt(70))
                    .matchingSkills(extractStringList(root.path("matchingSkills")))
                    .missingSkills(extractStringList(root.path("missingSkills")))
                    .learningRoadmap(steps)
                    .isAIAvailable(true)
                    .build();
        } catch (Exception ex) {
            log.warn("Gemini AI skill gap failed: {}", ex.getMessage());
            return fallbackAiEngine.analyzeSkillGap(targetRole, currentSkills, targetJobSkills);
        }
    }

    private String callGeminiApi(String prompt) throws Exception {
        String url = String.format("%s/%s:generateContent?key=%s", endpoint, model, apiKey);

        Map<String, Object> part = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", List.of(part));
        Map<String, Object> requestBody = Map.of("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        JsonNode root = objectMapper.readTree(response.getBody());
        return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
    }

    private JsonNode parseJsonFromResponse(String raw) throws Exception {
        String clean = raw.trim();
        if (clean.startsWith("```json")) {
            clean = clean.substring(7);
        } else if (clean.startsWith("```")) {
            clean = clean.substring(3);
        }
        if (clean.endsWith("```")) {
            clean = clean.substring(0, clean.length() - 3);
        }
        return objectMapper.readTree(clean.trim());
    }

    private List<String> extractStringList(JsonNode node) {
        List<String> list = new ArrayList<>();
        if (node != null && node.isArray()) {
            for (JsonNode n : node) {
                list.add(n.asText());
            }
        }
        return list;
    }
}
