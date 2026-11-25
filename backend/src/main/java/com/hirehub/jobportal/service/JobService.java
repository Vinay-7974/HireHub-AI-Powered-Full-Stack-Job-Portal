package com.hirehub.jobportal.service;

import com.hirehub.jobportal.dto.job.JobCreateRequest;
import com.hirehub.jobportal.dto.job.JobDto;
import com.hirehub.jobportal.entity.enums.EmploymentType;
import com.hirehub.jobportal.entity.enums.ExperienceLevel;
import com.hirehub.jobportal.entity.enums.JobStatus;
import com.hirehub.jobportal.entity.enums.WorkMode;
import com.hirehub.jobportal.response.PagedResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface JobService {
    JobDto getJobById(Long id, Long currentUserId);
    PagedResponse<JobDto> searchJobs(String keyword, String location, WorkMode workMode, EmploymentType employmentType, ExperienceLevel experienceLevel, String category, Double minSalary, Long currentUserId, Pageable pageable);
    PagedResponse<JobDto> getRecruiterJobs(Long recruiterId, Pageable pageable);
    JobDto createJob(Long recruiterId, JobCreateRequest request);
    JobDto updateJob(Long recruiterId, Long jobId, JobCreateRequest request);
    void updateJobStatus(Long recruiterId, Long jobId, JobStatus status);
    void deleteJob(Long recruiterId, Long jobId);
    List<String> getJobCategories();
}
