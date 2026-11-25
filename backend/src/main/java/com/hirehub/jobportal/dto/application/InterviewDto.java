package com.hirehub.jobportal.dto.application;

import com.hirehub.jobportal.entity.enums.InterviewStatus;
import com.hirehub.jobportal.entity.enums.InterviewType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewDto {
    private Long id;
    private Long applicationId;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private Long recruiterId;
    private String recruiterName;
    private Long applicantId;
    private String applicantName;
    private String applicantEmail;
    private LocalDateTime interviewDate;
    private InterviewType interviewType;
    private String meetingLink;
    private String notes;
    private InterviewStatus status;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScheduleRequest {
        @NotNull(message = "Application ID is required")
        private Long applicationId;

        @NotNull(message = "Interview date is required")
        @Future(message = "Interview date must be in the future")
        private LocalDateTime interviewDate;

        @NotNull(message = "Interview type is required")
        private InterviewType interviewType;

        private String meetingLink;
        private String notes;
    }
}
