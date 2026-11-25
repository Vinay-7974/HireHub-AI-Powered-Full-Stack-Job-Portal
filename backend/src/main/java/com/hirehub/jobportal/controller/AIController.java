package com.hirehub.jobportal.controller;

import com.hirehub.jobportal.dto.ai.*;
import com.hirehub.jobportal.response.ApiResponse;
import com.hirehub.jobportal.security.UserPrincipal;
import com.hirehub.jobportal.service.AIAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Career Suite", description = "Endpoints for AI Resume Analysis, Job Match, Cover Letter, Interview Prep, Chat Assistant, and Skill Gap Analyzer")
public class AIController {

    private final AIAnalysisService aiAnalysisService;

    @PostMapping("/resume-analyzer")
    @Operation(summary = "Analyze resume text for ATS compatibility, score, skills, strengths, and recommendations")
    public ResponseEntity<ApiResponse<AIResumeAnalysisDto.Response>> analyzeResume(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody AIResumeAnalysisDto.Request request
    ) {
        Long userId = (userPrincipal != null) ? userPrincipal.getId() : null;
        return ResponseEntity.ok(ApiResponse.success("Resume analysis complete", aiAnalysisService.analyzeResume(userId, request)));
    }

    @PostMapping("/job-match")
    @Operation(summary = "Match candidate profile or resume against a job description")
    public ResponseEntity<ApiResponse<AIJobMatchDto.Response>> matchJob(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody AIJobMatchDto.Request request
    ) {
        Long userId = (userPrincipal != null) ? userPrincipal.getId() : null;
        return ResponseEntity.ok(ApiResponse.success("Job match analysis complete", aiAnalysisService.matchJob(userId, request)));
    }

    @PostMapping("/cover-letter")
    @Operation(summary = "Generate a customized cover letter for a specific job and tone")
    public ResponseEntity<ApiResponse<AICoverLetterDto.Response>> generateCoverLetter(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody AICoverLetterDto.Request request
    ) {
        Long userId = (userPrincipal != null) ? userPrincipal.getId() : null;
        return ResponseEntity.ok(ApiResponse.success("Cover letter generated", aiAnalysisService.generateCoverLetter(userId, request)));
    }

    @PostMapping("/interview-prep")
    @Operation(summary = "Generate role-specific technical, behavioral, and HR interview questions and answers")
    public ResponseEntity<ApiResponse<AIInterviewPrepDto.Response>> generateInterviewPrep(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody AIInterviewPrepDto.Request request
    ) {
        Long userId = (userPrincipal != null) ? userPrincipal.getId() : null;
        return ResponseEntity.ok(ApiResponse.success("Interview prep generated", aiAnalysisService.generateInterviewPrep(userId, request)));
    }

    @PostMapping("/career-chat")
    @Operation(summary = "Interact with the AI Career Assistant for career path guidance, salary negotiation, and resume feedback")
    public ResponseEntity<ApiResponse<AIChatDto.Response>> careerChat(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody AIChatDto.Request request
    ) {
        Long userId = (userPrincipal != null) ? userPrincipal.getId() : null;
        return ResponseEntity.ok(ApiResponse.success("Assistant reply received", aiAnalysisService.answerCareerChat(userId, request)));
    }

    @PostMapping("/skill-gap")
    @Operation(summary = "Analyze candidate skills against target role and generate structured learning roadmap")
    public ResponseEntity<ApiResponse<AISkillGapDto.Response>> skillGap(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody AISkillGapDto.Request request
    ) {
        Long userId = (userPrincipal != null) ? userPrincipal.getId() : null;
        return ResponseEntity.ok(ApiResponse.success("Skill gap analysis complete", aiAnalysisService.analyzeSkillGap(userId, request)));
    }
}
