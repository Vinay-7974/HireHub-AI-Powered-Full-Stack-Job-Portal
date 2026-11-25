package com.hirehub.jobportal.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

public class AIResumeAnalysisDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String resumeText;
        private String targetRole;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private int overallScore; // 0 - 100
        private int atsScore;     // 0 - 100
        private String summary;
        @Builder.Default
        private List<String> skillsDetected = new ArrayList<>();
        @Builder.Default
        private List<String> missingSkills = new ArrayList<>();
        @Builder.Default
        private List<String> strengths = new ArrayList<>();
        @Builder.Default
        private List<String> weakSections = new ArrayList<>();
        @Builder.Default
        private List<String> improvementSuggestions = new ArrayList<>();
        @Builder.Default
        private List<String> formattingRecommendations = new ArrayList<>();
        private boolean isAIAvailable;
    }
}
