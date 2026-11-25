package com.hirehub.jobportal.service.impl;

import com.hirehub.jobportal.dto.job.JobDto;
import com.hirehub.jobportal.dto.user.JobSeekerProfileDto;
import com.hirehub.jobportal.dto.user.RecruiterProfileDto;
import com.hirehub.jobportal.dto.user.UserDto;
import com.hirehub.jobportal.entity.*;
import com.hirehub.jobportal.exception.BadRequestException;
import com.hirehub.jobportal.exception.ResourceNotFoundException;
import com.hirehub.jobportal.repository.*;
import com.hirehub.jobportal.response.PagedResponse;
import com.hirehub.jobportal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final JobAlertRepository jobAlertRepository;

    @Value("${hirehub.upload.dir:./uploads}")
    private String uploadDir;

    @Override
    @Transactional(readOnly = true)
    public UserDto getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .active(user.isActive())
                .profilePhoto(user.getProfilePhoto())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public JobSeekerProfileDto getJobSeekerProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        JobSeekerProfile profile = jobSeekerProfileRepository.findByUserId(userId)
                .orElseGet(() -> jobSeekerProfileRepository.save(JobSeekerProfile.builder().user(user).build()));

        return mapToJobSeekerDto(profile);
    }

    @Override
    @Transactional
    public JobSeekerProfileDto updateJobSeekerProfile(Long userId, JobSeekerProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        JobSeekerProfile profile = jobSeekerProfileRepository.findByUserId(userId)
                .orElseGet(() -> JobSeekerProfile.builder().user(user).build());

        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getProfilePhoto() != null) user.setProfilePhoto(dto.getProfilePhoto());
        userRepository.save(user);

        profile.setHeadline(dto.getHeadline());
        profile.setAbout(dto.getAbout());
        profile.setLocation(dto.getLocation());
        profile.setPreferredRole(dto.getPreferredRole());
        profile.setPreferredLocation(dto.getPreferredLocation());
        profile.setExpectedSalary(dto.getExpectedSalary());
        profile.setWorkPreferences(dto.getWorkPreferences());
        profile.setPortfolioUrl(dto.getPortfolioUrl());
        profile.setLinkedInUrl(dto.getLinkedInUrl());
        profile.setGitHubUrl(dto.getGitHubUrl());

        if (dto.getSkills() != null) {
            profile.getSkills().clear();
            profile.getSkills().addAll(dto.getSkills());
        }

        // Calculate Profile Completion
        int score = 20;
        if (profile.getHeadline() != null && !profile.getHeadline().isBlank()) score += 15;
        if (profile.getAbout() != null && !profile.getAbout().isBlank()) score += 15;
        if (!profile.getSkills().isEmpty()) score += 20;
        if (profile.getResumeUrl() != null) score += 20;
        if (profile.getLocation() != null) score += 10;
        profile.setProfileCompletionPercentage(Math.min(100, score));

        profile = jobSeekerProfileRepository.save(profile);
        return mapToJobSeekerDto(profile);
    }

    @Override
    @Transactional
    public JobSeekerProfileDto uploadResume(Long userId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file is empty");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf");
        if (!originalFilename.toLowerCase().endsWith(".pdf") && !originalFilename.toLowerCase().endsWith(".docx")) {
            throw new BadRequestException("Only PDF or DOCX files are supported");
        }

        try {
            Path targetDir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(targetDir);

            String storedFilename = UUID.randomUUID() + "_" + originalFilename;
            Path targetLocation = targetDir.resolve(storedFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            JobSeekerProfile profile = jobSeekerProfileRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("JobSeekerProfile", "userId", userId));

            profile.setResumeUrl("/uploads/" + storedFilename);
            profile.setResumeOriginalName(originalFilename);

            // Mock basic textual extraction for AI ATS processing
            profile.setResumeText("Uploaded resume file: " + originalFilename + ". Candidate skills: " + String.join(", ", profile.getSkills()));

            int current = profile.getProfileCompletionPercentage() != null ? profile.getProfileCompletionPercentage() : 30;
            profile.setProfileCompletionPercentage(Math.min(100, current + 20));

            profile = jobSeekerProfileRepository.save(profile);
            return mapToJobSeekerDto(profile);
        } catch (IOException ex) {
            throw new BadRequestException("Could not store file: " + ex.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public RecruiterProfileDto getRecruiterProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        RecruiterProfile profile = recruiterProfileRepository.findByUserId(userId)
                .orElseGet(() -> recruiterProfileRepository.save(RecruiterProfile.builder().user(user).build()));

        return mapToRecruiterDto(profile);
    }

    @Override
    @Transactional
    public RecruiterProfileDto updateRecruiterProfile(Long userId, RecruiterProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        RecruiterProfile profile = recruiterProfileRepository.findByUserId(userId)
                .orElseGet(() -> RecruiterProfile.builder().user(user).build());

        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        userRepository.save(user);

        profile.setDesignation(dto.getDesignation());
        profile.setDepartment(dto.getDepartment());

        profile = recruiterProfileRepository.save(profile);
        return mapToRecruiterDto(profile);
    }

    @Override
    @Transactional
    public void saveJob(Long userId, Long jobId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (!savedJobRepository.existsByUserIdAndJobId(userId, jobId)) {
            savedJobRepository.save(SavedJob.builder().user(user).job(job).build());
        }
    }

    @Override
    @Transactional
    public void unsaveJob(Long userId, Long jobId) {
        savedJobRepository.deleteByUserIdAndJobId(userId, jobId);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<JobDto> getSavedJobs(Long userId, Pageable pageable) {
        Page<SavedJob> page = savedJobRepository.findByUserId(userId, pageable);
        Page<JobDto> jobDtos = page.map(sj -> JobDto.builder()
                .id(sj.getJob().getId())
                .companyId(sj.getJob().getCompany().getId())
                .companyName(sj.getJob().getCompany().getName())
                .companyLogo(sj.getJob().getCompany().getLogo())
                .companyLocation(sj.getJob().getCompany().getLocation())
                .title(sj.getJob().getTitle())
                .description(sj.getJob().getDescription())
                .salaryMin(sj.getJob().getSalaryMin())
                .salaryMax(sj.getJob().getSalaryMax())
                .location(sj.getJob().getLocation())
                .employmentType(sj.getJob().getEmploymentType())
                .workMode(sj.getJob().getWorkMode())
                .experienceLevel(sj.getJob().getExperienceLevel())
                .category(sj.getJob().getCategory())
                .status(sj.getJob().getStatus())
                .isSaved(true)
                .build());
        return PagedResponse.from(jobDtos);
    }

    @Override
    @Transactional
    public JobAlert createJobAlert(Long userId, JobAlert alert) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        alert.setUser(user);
        return jobAlertRepository.save(alert);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<JobAlert> getJobAlerts(Long userId, Pageable pageable) {
        return PagedResponse.from(jobAlertRepository.findByUserId(userId, pageable));
    }

    @Override
    @Transactional
    public void deleteJobAlert(Long userId, Long alertId) {
        jobAlertRepository.deleteById(alertId);
    }

    private JobSeekerProfileDto mapToJobSeekerDto(JobSeekerProfile p) {
        User u = p.getUser();
        return JobSeekerProfileDto.builder()
                .id(p.getId())
                .userId(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .profilePhoto(u.getProfilePhoto())
                .headline(p.getHeadline())
                .about(p.getAbout())
                .location(p.getLocation())
                .preferredRole(p.getPreferredRole())
                .preferredLocation(p.getPreferredLocation())
                .expectedSalary(p.getExpectedSalary())
                .workPreferences(p.getWorkPreferences())
                .portfolioUrl(p.getPortfolioUrl())
                .linkedInUrl(p.getLinkedInUrl())
                .gitHubUrl(p.getGitHubUrl())
                .resumeUrl(p.getResumeUrl())
                .resumeOriginalName(p.getResumeOriginalName())
                .profileCompletionPercentage(p.getProfileCompletionPercentage())
                .skills(p.getSkills())
                .educationList(p.getEducationList().stream().map(e -> JobSeekerProfileDto.EducationDto.builder()
                        .id(e.getId())
                        .degree(e.getDegree())
                        .institution(e.getInstitution())
                        .fieldOfStudy(e.getFieldOfStudy())
                        .startDate(e.getStartDate())
                        .endDate(e.getEndDate())
                        .grade(e.getGrade())
                        .build()).collect(Collectors.toList()))
                .experienceList(p.getExperienceList().stream().map(e -> JobSeekerProfileDto.ExperienceDto.builder()
                        .id(e.getId())
                        .title(e.getTitle())
                        .company(e.getCompany())
                        .location(e.getLocation())
                        .startDate(e.getStartDate())
                        .endDate(e.getEndDate())
                        .isCurrent(e.isCurrent())
                        .description(e.getDescription())
                        .build()).collect(Collectors.toList()))
                .projectList(p.getProjectList().stream().map(pr -> JobSeekerProfileDto.ProjectDto.builder()
                        .id(pr.getId())
                        .title(pr.getTitle())
                        .description(pr.getDescription())
                        .technologies(pr.getTechnologies())
                        .projectUrl(pr.getProjectUrl())
                        .githubUrl(pr.getGithubUrl())
                        .build()).collect(Collectors.toList()))
                .certificationList(p.getCertificationList().stream().map(c -> JobSeekerProfileDto.CertificationDto.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .issuingOrganization(c.getIssuingOrganization())
                        .issueDate(c.getIssueDate())
                        .expirationDate(c.getExpirationDate())
                        .credentialUrl(c.getCredentialUrl())
                        .build()).collect(Collectors.toList()))
                .build();
    }

    private RecruiterProfileDto mapToRecruiterDto(RecruiterProfile p) {
        User u = p.getUser();
        Company c = p.getCompany();
        return RecruiterProfileDto.builder()
                .id(p.getId())
                .userId(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .companyId(c != null ? c.getId() : null)
                .companyName(c != null ? c.getName() : null)
                .companyLogo(c != null ? c.getLogo() : null)
                .designation(p.getDesignation())
                .department(p.getDepartment())
                .build();
    }
}
