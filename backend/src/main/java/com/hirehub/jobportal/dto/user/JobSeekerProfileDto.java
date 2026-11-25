package com.hirehub.jobportal.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobSeekerProfileDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String profilePhoto;
    private String headline;
    private String about;
    private String location;
    private String preferredRole;
    private String preferredLocation;
    private Double expectedSalary;
    private String workPreferences;
    private String portfolioUrl;
    private String linkedInUrl;
    private String gitHubUrl;
    private String resumeUrl;
    private String resumeOriginalName;
    private Integer profileCompletionPercentage;

    @Builder.Default
    private List<String> skills = new ArrayList<>();

    @Builder.Default
    private List<EducationDto> educationList = new ArrayList<>();

    @Builder.Default
    private List<ExperienceDto> experienceList = new ArrayList<>();

    @Builder.Default
    private List<ProjectDto> projectList = new ArrayList<>();

    @Builder.Default
    private List<CertificationDto> certificationList = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EducationDto {
        private Long id;
        private String degree;
        private String institution;
        private String fieldOfStudy;
        private LocalDate startDate;
        private LocalDate endDate;
        private String grade;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExperienceDto {
        private Long id;
        private String title;
        private String company;
        private String location;
        private LocalDate startDate;
        private LocalDate endDate;
        private boolean isCurrent;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectDto {
        private Long id;
        private String title;
        private String description;
        private String technologies;
        private String projectUrl;
        private String githubUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CertificationDto {
        private Long id;
        private String name;
        private String issuingOrganization;
        private LocalDate issueDate;
        private LocalDate expirationDate;
        private String credentialUrl;
    }
}
