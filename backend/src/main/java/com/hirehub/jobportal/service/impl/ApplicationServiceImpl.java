package com.hirehub.jobportal.service.impl;

import com.hirehub.jobportal.ai.GeminiAiService;
import com.hirehub.jobportal.dto.ai.AIJobMatchDto;
import com.hirehub.jobportal.dto.application.ApplicationCreateRequest;
import com.hirehub.jobportal.dto.application.ApplicationDto;
import com.hirehub.jobportal.dto.application.ApplicationStatusUpdateRequest;
import com.hirehub.jobportal.entity.*;
import com.hirehub.jobportal.entity.enums.ApplicationStatus;
import com.hirehub.jobportal.exception.BadRequestException;
import com.hirehub.jobportal.exception.ResourceNotFoundException;
import com.hirehub.jobportal.repository.*;
import com.hirehub.jobportal.response.PagedResponse;
import com.hirehub.jobportal.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final NotificationRepository notificationRepository;
    private final GeminiAiService aiService;

    @Override
    @Transactional
    public ApplicationDto applyForJob(Long applicantId, ApplicationCreateRequest request) {
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", request.getJobId()));

        User applicant = userRepository.findById(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", applicantId));

        if (applicationRepository.existsByJobIdAndApplicantId(job.getId(), applicant.getId())) {
            throw new BadRequestException("You have already applied for this job");
        }

        var profileOpt = jobSeekerProfileRepository.findByUserId(applicantId);
        List<String> applicantSkills = profileOpt.map(JobSeekerProfile::getSkills).orElse(new ArrayList<>());
        String resumeUrl = request.getResumeUrl();
        if ((resumeUrl == null || resumeUrl.isBlank()) && profileOpt.isPresent()) {
            resumeUrl = profileOpt.get().getResumeUrl();
        }

        // Calculate AI Match Score
        AIJobMatchDto.Response matchResult = aiService.matchJob(job.getDescription(), job.getRequiredSkills(), applicantSkills);

        Application application = Application.builder()
                .job(job)
                .applicant(applicant)
                .resumeUrl(resumeUrl)
                .coverLetter(request.getCoverLetter())
                .status(ApplicationStatus.APPLIED)
                .aiMatchScore(matchResult.getMatchPercentage())
                .aiMatchExplanation(matchResult.getMatchExplanation())
                .build();

        application = applicationRepository.save(application);

        // Notify Recruiter
        notificationRepository.save(Notification.builder()
                .user(job.getRecruiter())
                .title("New Candidate Application")
                .message(applicant.getFullName() + " applied for " + job.getTitle() + " with match score " + matchResult.getMatchPercentage() + "%")
                .type("APPLICATION_UPDATE")
                .link("/recruiter/jobs/" + job.getId() + "/applicants")
                .build());

        // Notify Applicant
        notificationRepository.save(Notification.builder()
                .user(applicant)
                .title("Application Submitted")
                .message("Your application for " + job.getTitle() + " at " + job.getCompany().getName() + " was received successfully.")
                .type("APPLICATION_UPDATE")
                .link("/seeker/applications")
                .build());

        return mapToDto(application);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ApplicationDto> getJobSeekerApplications(Long applicantId, Pageable pageable) {
        Page<Application> apps = applicationRepository.findByApplicantId(applicantId, pageable);
        return PagedResponse.from(apps.map(this::mapToDto));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ApplicationDto> getJobApplications(Long recruiterId, Long jobId, ApplicationStatus status, Pageable pageable) {
        Page<Application> apps;
        if (status != null) {
            apps = applicationRepository.findByJobIdAndStatus(jobId, status, pageable);
        } else {
            apps = applicationRepository.findByJobId(jobId, pageable);
        }
        return PagedResponse.from(apps.map(this::mapToDto));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ApplicationDto> getRecruiterApplications(Long recruiterId, Pageable pageable) {
        Page<Application> apps = applicationRepository.findByJobRecruiterId(recruiterId, pageable);
        return PagedResponse.from(apps.map(this::mapToDto));
    }

    @Override
    @Transactional
    public ApplicationDto updateApplicationStatus(Long recruiterId, Long applicationId, ApplicationStatusUpdateRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        application.setStatus(request.getStatus());
        if (request.getRecruiterNotes() != null) {
            application.setRecruiterNotes(request.getRecruiterNotes());
        }

        application = applicationRepository.save(application);

        // Notify Applicant of status change
        notificationRepository.save(Notification.builder()
                .user(application.getApplicant())
                .title("Application Status Updated: " + request.getStatus())
                .message("Your application for " + application.getJob().getTitle() + " status is now " + request.getStatus() + ".")
                .type("APPLICATION_UPDATE")
                .link("/seeker/applications")
                .build());

        return mapToDto(application);
    }

    @Override
    @Transactional
    public void withdrawApplication(Long applicantId, Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        if (!application.getApplicant().getId().equals(applicantId)) {
            throw new BadRequestException("You can only withdraw your own applications");
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);
        applicationRepository.save(application);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationDto getApplicationById(Long applicationId, Long userId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));
        return mapToDto(application);
    }

    private ApplicationDto mapToDto(Application app) {
        var profileOpt = jobSeekerProfileRepository.findByUserId(app.getApplicant().getId());

        String headline = profileOpt.map(JobSeekerProfile::getHeadline).orElse("");
        List<String> skills = profileOpt.map(JobSeekerProfile::getSkills).orElse(new ArrayList<>());

        return ApplicationDto.builder()
                .id(app.getId())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .companyName(app.getJob().getCompany().getName())
                .companyLogo(app.getJob().getCompany().getLogo())
                .jobLocation(app.getJob().getLocation())
                .applicantId(app.getApplicant().getId())
                .applicantName(app.getApplicant().getFullName())
                .applicantEmail(app.getApplicant().getEmail())
                .applicantPhone(app.getApplicant().getPhone())
                .applicantHeadline(headline)
                .applicantPhoto(app.getApplicant().getProfilePhoto())
                .applicantSkills(skills)
                .resumeUrl(app.getResumeUrl())
                .coverLetter(app.getCoverLetter())
                .status(app.getStatus())
                .aiMatchScore(app.getAiMatchScore())
                .aiMatchExplanation(app.getAiMatchExplanation())
                .recruiterNotes(app.getRecruiterNotes())
                .appliedAt(app.getAppliedAt())
                .updatedAt(app.getUpdatedAt())
                .build();
    }
}
