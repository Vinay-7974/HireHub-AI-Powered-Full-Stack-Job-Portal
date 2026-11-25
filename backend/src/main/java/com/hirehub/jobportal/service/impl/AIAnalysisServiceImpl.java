package com.hirehub.jobportal.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hirehub.jobportal.ai.GeminiAiService;
import com.hirehub.jobportal.dto.ai.*;
import com.hirehub.jobportal.entity.*;
import com.hirehub.jobportal.repository.*;
import com.hirehub.jobportal.service.AIAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIAnalysisServiceImpl implements AIAnalysisService {

    private final GeminiAiService geminiAiService;
    private final AIAnalysisRepository aiAnalysisRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationMessageRepository conversationMessageRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional
    public AIResumeAnalysisDto.Response analyzeResume(Long userId, AIResumeAnalysisDto.Request request) {
        String text = request.getResumeText();
        if ((text == null || text.isBlank()) && userId != null) {
            var profile = jobSeekerProfileRepository.findByUserId(userId);
            if (profile.isPresent() && profile.get().getResumeText() != null) {
                text = profile.get().getResumeText();
            }
        }

        AIResumeAnalysisDto.Response response = geminiAiService.analyzeResume(text, request.getTargetRole());

        if (userId != null) {
            saveAnalysisLog(userId, "RESUME_ANALYSIS", "Target: " + request.getTargetRole(), response);
        }

        return response;
    }

    @Override
    @Transactional
    public AIJobMatchDto.Response matchJob(Long userId, AIJobMatchDto.Request request) {
        String jobDesc = request.getJobDescription();
        List<String> requiredSkills = new ArrayList<>();
        List<String> candidateSkills = new ArrayList<>();

        if (request.getJobId() != null) {
            var job = jobRepository.findById(request.getJobId());
            if (job.isPresent()) {
                jobDesc = job.get().getDescription();
                requiredSkills = job.get().getRequiredSkills();
            }
        }

        if (userId != null) {
            var profile = jobSeekerProfileRepository.findByUserId(userId);
            if (profile.isPresent()) {
                candidateSkills = profile.get().getSkills();
            }
        }

        AIJobMatchDto.Response response = geminiAiService.matchJob(jobDesc, requiredSkills, candidateSkills);

        if (userId != null) {
            saveAnalysisLog(userId, "JOB_MATCH", "Job: " + request.getJobId(), response);
        }

        return response;
    }

    @Override
    @Transactional
    public AICoverLetterDto.Response generateCoverLetter(Long userId, AICoverLetterDto.Request request) {
        String profileSummary = request.getUserProfileSummary();
        if ((profileSummary == null || profileSummary.isBlank()) && userId != null) {
            var profile = jobSeekerProfileRepository.findByUserId(userId);
            if (profile.isPresent()) {
                profileSummary = profile.get().getAbout() != null ? profile.get().getAbout() : "Skills: " + String.join(", ", profile.get().getSkills());
            }
        }

        AICoverLetterDto.Response response = geminiAiService.generateCoverLetter(
                request.getJobTitle(),
                request.getCompanyName(),
                request.getJobDescription(),
                profileSummary,
                request.getTone()
        );

        if (userId != null) {
            saveAnalysisLog(userId, "COVER_LETTER", "Role: " + request.getJobTitle(), response);
        }

        return response;
    }

    @Override
    @Transactional
    public AIInterviewPrepDto.Response generateInterviewPrep(Long userId, AIInterviewPrepDto.Request request) {
        AIInterviewPrepDto.Response response = geminiAiService.generateInterviewPrep(
                request.getJobTitle(),
                request.getExperienceLevel()
        );

        if (userId != null) {
            saveAnalysisLog(userId, "INTERVIEW_PREP", "Role: " + request.getJobTitle(), response);
        }

        return response;
    }

    @Override
    @Transactional
    public AIChatDto.Response answerCareerChat(Long userId, AIChatDto.Request request) {
        Conversation conversation;
        if (request.getConversationId() != null) {
            conversation = conversationRepository.findById(request.getConversationId())
                    .orElseGet(() -> createNewConversation(userId, request.getMessage()));
        } else {
            conversation = createNewConversation(userId, request.getMessage());
        }

        // Save User Message
        conversationMessageRepository.save(ConversationMessage.builder()
                .conversation(conversation)
                .senderRole("user")
                .content(request.getMessage())
                .build());

        AIChatDto.Response response = geminiAiService.answerCareerChat(conversation.getId(), request.getMessage());

        // Save Assistant Reply
        conversationMessageRepository.save(ConversationMessage.builder()
                .conversation(conversation)
                .senderRole("assistant")
                .content(response.getReply())
                .build());

        List<ConversationMessage> msgs = conversationMessageRepository.findByConversationIdOrderByCreatedAtAsc(conversation.getId());
        List<AIChatDto.MessageItem> history = msgs.stream().map(m -> AIChatDto.MessageItem.builder()
                .id(m.getId())
                .senderRole(m.getSenderRole())
                .content(m.getContent())
                .createdAt(m.getCreatedAt())
                .build()).toList();

        response.setConversationId(conversation.getId());
        response.setTitle(conversation.getTitle());
        response.setHistory(history);

        return response;
    }

    @Override
    @Transactional
    public AISkillGapDto.Response analyzeSkillGap(Long userId, AISkillGapDto.Request request) {
        List<String> current = request.getCurrentSkills();
        if ((current == null || current.isEmpty()) && userId != null) {
            var profile = jobSeekerProfileRepository.findByUserId(userId);
            if (profile.isPresent()) {
                current = profile.get().getSkills();
            }
        }

        AISkillGapDto.Response response = geminiAiService.analyzeSkillGap(
                request.getTargetRole(),
                current,
                request.getTargetJobSkills()
        );

        if (userId != null) {
            saveAnalysisLog(userId, "SKILL_GAP", "Role: " + request.getTargetRole(), response);
        }

        return response;
    }

    private Conversation createNewConversation(Long userId, String initialMessage) {
        User user = (userId != null) ? userRepository.findById(userId).orElse(null) : null;
        String title = initialMessage.length() > 40 ? initialMessage.substring(0, 37) + "..." : initialMessage;
        return conversationRepository.save(Conversation.builder()
                .user(user)
                .title(title)
                .build());
    }

    private void saveAnalysisLog(Long userId, String type, String summary, Object result) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                String json = objectMapper.writeValueAsString(result);
                aiAnalysisRepository.save(AIAnalysis.builder()
                        .user(user)
                        .analysisType(type)
                        .inputSummary(summary)
                        .resultJson(json)
                        .build());
            }
        } catch (Exception ex) {
            log.warn("Could not save AI analysis log: {}", ex.getMessage());
        }
    }
}
