package com.hirehub.jobportal.service;

import com.hirehub.jobportal.dto.application.InterviewDto;
import com.hirehub.jobportal.entity.enums.InterviewStatus;
import com.hirehub.jobportal.response.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface InterviewService {
    InterviewDto scheduleInterview(Long recruiterId, InterviewDto.ScheduleRequest request);
    PagedResponse<InterviewDto> getApplicantInterviews(Long applicantId, Pageable pageable);
    PagedResponse<InterviewDto> getRecruiterInterviews(Long recruiterId, Pageable pageable);
    InterviewDto updateInterviewStatus(Long interviewId, InterviewStatus status);
}
