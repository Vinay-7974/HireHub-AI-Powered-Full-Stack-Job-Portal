package com.hirehub.jobportal.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

public class AIJobMatchDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private Long jobId;
        private String jobDescription;
        private String resumeText;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private int matchPercentage;
        private String matchExplanation;
        @Builder.Default
        private List<String> matchingSkills = new ArrayList<>();
        @Builder.Default
        private List<String> missingSkills = new ArrayList<>();
        @Builder.Default
        private List<String> recommendations = new ArrayList<>();
        private boolean isAIAvailable;
    }
}
