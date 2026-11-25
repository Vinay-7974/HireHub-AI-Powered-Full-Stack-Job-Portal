package com.hirehub.jobportal.service.impl;

import com.hirehub.jobportal.dto.application.InterviewDto;
import com.hirehub.jobportal.entity.*;
import com.hirehub.jobportal.entity.enums.ApplicationStatus;
import com.hirehub.jobportal.entity.enums.InterviewStatus;
import com.hirehub.jobportal.exception.ResourceNotFoundException;
import com.hirehub.jobportal.repository.*;
import com.hirehub.jobportal.response.PagedResponse;
import com.hirehub.jobportal.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public InterviewDto scheduleInterview(Long recruiterId, InterviewDto.ScheduleRequest request) {
        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", request.getApplicationId()));

        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", recruiterId));

        User applicant = application.getApplicant();

        Interview interview = Interview.builder()
                .application(application)
                .recruiter(recruiter)
                .applicant(applicant)
                .interviewDate(request.getInterviewDate())
                .interviewType(request.getInterviewType())
                .meetingLink(request.getMeetingLink())
                .notes(request.getNotes())
                .status(InterviewStatus.SCHEDULED)
                .build();

        interview = interviewRepository.save(interview);

        // Update Application Status to INTERVIEW
        application.setStatus(ApplicationStatus.INTERVIEW);
        applicationRepository.save(application);

        // Notify Applicant
        notificationRepository.save(Notification.builder()
                .user(applicant)
                .title("Interview Scheduled: " + application.getJob().getTitle())
                .message("An interview has been scheduled for " + interview.getInterviewDate() + " (" + interview.getInterviewType() + ") with " + application.getJob().getCompany().getName() + ".")
                .type("INTERVIEW_INVITE")
                .link("/seeker/interviews")
                .build());

        return mapToDto(interview);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<InterviewDto> getApplicantInterviews(Long applicantId, Pageable pageable) {
        Page<Interview> page = interviewRepository.findByApplicantId(applicantId, pageable);
        return PagedResponse.from(page.map(this::mapToDto));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<InterviewDto> getRecruiterInterviews(Long recruiterId, Pageable pageable) {
        Page<Interview> page = interviewRepository.findByRecruiterId(recruiterId, pageable);
        return PagedResponse.from(page.map(this::mapToDto));
    }

    @Override
    @Transactional
    public InterviewDto updateInterviewStatus(Long interviewId, InterviewStatus status) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", interviewId));

        interview.setStatus(status);
        interview = interviewRepository.save(interview);
        return mapToDto(interview);
    }

    private InterviewDto mapToDto(Interview i) {
        return InterviewDto.builder()
                .id(i.getId())
                .applicationId(i.getApplication().getId())
                .jobId(i.getApplication().getJob().getId())
                .jobTitle(i.getApplication().getJob().getTitle())
                .companyName(i.getApplication().getJob().getCompany().getName())
                .recruiterId(i.getRecruiter().getId())
                .recruiterName(i.getRecruiter().getFullName())
                .applicantId(i.getApplicant().getId())
                .applicantName(i.getApplicant().getFullName())
                .applicantEmail(i.getApplicant().getEmail())
                .interviewDate(i.getInterviewDate())
                .interviewType(i.getInterviewType())
                .meetingLink(i.getMeetingLink())
                .notes(i.getNotes())
                .status(i.getStatus())
                .createdAt(i.getCreatedAt())
                .build();
    }
}
