package com.hirehub.jobportal.service;

import com.hirehub.jobportal.dto.application.ApplicationCreateRequest;
import com.hirehub.jobportal.dto.application.ApplicationDto;
import com.hirehub.jobportal.dto.application.ApplicationStatusUpdateRequest;
import com.hirehub.jobportal.entity.enums.ApplicationStatus;
import com.hirehub.jobportal.response.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface ApplicationService {
    ApplicationDto applyForJob(Long applicantId, ApplicationCreateRequest request);
    PagedResponse<ApplicationDto> getJobSeekerApplications(Long applicantId, Pageable pageable);
    PagedResponse<ApplicationDto> getJobApplications(Long recruiterId, Long jobId, ApplicationStatus status, Pageable pageable);
    PagedResponse<ApplicationDto> getRecruiterApplications(Long recruiterId, Pageable pageable);
    ApplicationDto updateApplicationStatus(Long recruiterId, Long applicationId, ApplicationStatusUpdateRequest request);
    void withdrawApplication(Long applicantId, Long applicationId);
    ApplicationDto getApplicationById(Long applicationId, Long userId);
}
