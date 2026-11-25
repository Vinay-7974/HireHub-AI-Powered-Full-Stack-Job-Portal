package com.hirehub.jobportal.service.impl;

import com.hirehub.jobportal.dto.job.JobCreateRequest;
import com.hirehub.jobportal.dto.job.JobDto;
import com.hirehub.jobportal.entity.*;
import com.hirehub.jobportal.entity.enums.*;
import com.hirehub.jobportal.exception.BadRequestException;
import com.hirehub.jobportal.exception.ResourceNotFoundException;
import com.hirehub.jobportal.repository.*;
import com.hirehub.jobportal.response.PagedResponse;
import com.hirehub.jobportal.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;

    @Override
    @Transactional
    public JobDto getJobById(Long id, Long currentUserId) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        // Increment views
        job.setViewsCount(job.getViewsCount() + 1);
        jobRepository.save(job);

        return mapToDto(job, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<JobDto> searchJobs(String keyword, String location, WorkMode workMode, EmploymentType employmentType, ExperienceLevel experienceLevel, String category, Double minSalary, Long currentUserId, Pageable pageable) {
        Page<Job> jobs = jobRepository.searchJobs(
                JobStatus.PUBLISHED,
                (keyword != null && !keyword.isBlank()) ? keyword.trim() : null,
                (location != null && !location.isBlank()) ? location.trim() : null,
                workMode,
                employmentType,
                experienceLevel,
                (category != null && !category.isBlank()) ? category.trim() : null,
                minSalary,
                pageable
        );

        return PagedResponse.from(jobs.map(j -> mapToDto(j, currentUserId)));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<JobDto> getRecruiterJobs(Long recruiterId, Pageable pageable) {
        Page<Job> jobs = jobRepository.findByRecruiterId(recruiterId, pageable);
        return PagedResponse.from(jobs.map(j -> mapToDto(j, recruiterId)));
    }

    @Override
    @Transactional
    public JobDto createJob(Long recruiterId, JobCreateRequest request) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", recruiterId));

        Company company = null;
        if (request.getCompanyId() != null) {
            company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company", "id", request.getCompanyId()));
        } else {
            var recProfile = recruiterProfileRepository.findByUserId(recruiterId);
            if (recProfile.isPresent() && recProfile.get().getCompany() != null) {
                company = recProfile.get().getCompany();
            }
        }

        if (company == null) {
            throw new BadRequestException("Recruiter must be affiliated with a company to post jobs");
        }

        Job job = Job.builder()
                .company(company)
                .recruiter(recruiter)
                .title(request.getTitle())
                .description(request.getDescription())
                .responsibilities(request.getResponsibilities())
                .requirements(request.getRequirements())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .location(request.getLocation() != null ? request.getLocation() : company.getLocation())
                .employmentType(request.getEmploymentType() != null ? request.getEmploymentType() : EmploymentType.FULL_TIME)
                .workMode(request.getWorkMode() != null ? request.getWorkMode() : WorkMode.REMOTE)
                .experienceLevel(request.getExperienceLevel() != null ? request.getExperienceLevel() : ExperienceLevel.MID_LEVEL)
                .category(request.getCategory())
                .status(request.getStatus() != null ? request.getStatus() : JobStatus.PUBLISHED)
                .deadline(request.getDeadline())
                .benefits(request.getBenefits())
                .requiredSkills(request.getRequiredSkills())
                .viewsCount(0L)
                .build();

        job = jobRepository.save(job);
        return mapToDto(job, recruiterId);
    }

    @Override
    @Transactional
    public JobDto updateJob(Long recruiterId, Long jobId, JobCreateRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (!job.getRecruiter().getId().equals(recruiterId)) {
            User recruiter = userRepository.findById(recruiterId).orElseThrow();
            if (recruiter.getRole() != Role.ROLE_ADMIN) {
                throw new BadRequestException("You are not authorized to update this job");
            }
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setResponsibilities(request.getResponsibilities());
        job.setRequirements(request.getRequirements());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setLocation(request.getLocation());
        job.setEmploymentType(request.getEmploymentType());
        job.setWorkMode(request.getWorkMode());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setCategory(request.getCategory());
        if (request.getStatus() != null) job.setStatus(request.getStatus());
        job.setDeadline(request.getDeadline());
        job.setBenefits(request.getBenefits());
        if (request.getRequiredSkills() != null) job.setRequiredSkills(request.getRequiredSkills());

        job = jobRepository.save(job);
        return mapToDto(job, recruiterId);
    }

    @Override
    @Transactional
    public void updateJobStatus(Long recruiterId, Long jobId, JobStatus status) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        job.setStatus(status);
        jobRepository.save(job);
    }

    @Override
    @Transactional
    public void deleteJob(Long recruiterId, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        jobRepository.delete(job);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getJobCategories() {
        return jobRepository.findDistinctCategories();
    }

    private JobDto mapToDto(Job job, Long currentUserId) {
        long applicantsCount = applicationRepository.findByJobId(job.getId(), Pageable.unpaged()).getTotalElements();
        boolean isSaved = false;
        boolean hasApplied = false;

        if (currentUserId != null) {
            isSaved = savedJobRepository.existsByUserIdAndJobId(currentUserId, job.getId());
            hasApplied = applicationRepository.existsByJobIdAndApplicantId(job.getId(), currentUserId);
        }

        return JobDto.builder()
                .id(job.getId())
                .companyId(job.getCompany().getId())
                .companyName(job.getCompany().getName())
                .companyLogo(job.getCompany().getLogo())
                .companyLocation(job.getCompany().getLocation())
                .recruiterId(job.getRecruiter().getId())
                .recruiterName(job.getRecruiter().getFullName())
                .title(job.getTitle())
                .description(job.getDescription())
                .responsibilities(job.getResponsibilities())
                .requirements(job.getRequirements())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .location(job.getLocation())
                .employmentType(job.getEmploymentType())
                .workMode(job.getWorkMode())
                .experienceLevel(job.getExperienceLevel())
                .category(job.getCategory())
                .status(job.getStatus())
                .viewsCount(job.getViewsCount())
                .deadline(job.getDeadline())
                .benefits(job.getBenefits())
                .requiredSkills(job.getRequiredSkills())
                .applicantsCount(applicantsCount)
                .isSaved(isSaved)
                .hasApplied(hasApplied)
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
