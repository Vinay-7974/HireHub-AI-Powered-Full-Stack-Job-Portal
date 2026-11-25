package com.hirehub.jobportal.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

public class AIInterviewPrepDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String jobTitle;
        private String industry;
        private String experienceLevel;
        private String topicOrSkill;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionItem {
        private String category; // Technical, HR, Behavioral, System Design
        private String question;
        private String sampleAnswer;
        private String keyTip;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String jobTitle;
        @Builder.Default
        private List<QuestionItem> questions = new ArrayList<>();
        @Builder.Default
        private List<String> generalTips = new ArrayList<>();
        private boolean isAIAvailable;
    }
}
