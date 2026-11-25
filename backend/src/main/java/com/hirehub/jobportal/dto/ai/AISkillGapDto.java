package com.hirehub.jobportal.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

public class AISkillGapDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String targetRole;
        @Builder.Default
        private List<String> currentSkills = new ArrayList<>();
        @Builder.Default
        private List<String> targetJobSkills = new ArrayList<>();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LearningStep {
        private String skill;
        private String priority; // High, Medium, Low
        private String estimatedTimeToLearn;
        private String recommendedResources;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String targetRole;
        private int readinessScore;
        @Builder.Default
        private List<String> matchingSkills = new ArrayList<>();
        @Builder.Default
        private List<String> missingSkills = new ArrayList<>();
        @Builder.Default
        private List<LearningStep> learningRoadmap = new ArrayList<>();
        private boolean isAIAvailable;
    }
}
