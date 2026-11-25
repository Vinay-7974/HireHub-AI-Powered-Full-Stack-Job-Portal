package com.hirehub.jobportal.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AICoverLetterDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String jobTitle;
        private String companyName;
        private String jobDescription;
        private String userProfileSummary;
        private String tone; // Professional, Enthusiastic, Confident, Concise
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String coverLetter;
        private String toneUsed;
        private boolean isAIAvailable;
    }
}
