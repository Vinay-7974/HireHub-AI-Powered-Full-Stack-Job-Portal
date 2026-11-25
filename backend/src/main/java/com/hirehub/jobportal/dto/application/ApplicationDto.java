package com.hirehub.jobportal.dto.application;

import com.hirehub.jobportal.entity.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDto {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String companyLogo;
    private String jobLocation;

    private Long applicantId;
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private String applicantHeadline;
    private String applicantPhoto;
    private List<String> applicantSkills;

    private String resumeUrl;
    private String coverLetter;
    private ApplicationStatus status;
    private Integer aiMatchScore;
    private String aiMatchExplanation;
    private String recruiterNotes;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
