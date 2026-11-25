package com.hirehub.jobportal.service;

import com.hirehub.jobportal.dto.job.JobDto;
import com.hirehub.jobportal.dto.user.JobSeekerProfileDto;
import com.hirehub.jobportal.dto.user.RecruiterProfileDto;
import com.hirehub.jobportal.dto.user.UserDto;
import com.hirehub.jobportal.entity.JobAlert;
import com.hirehub.jobportal.response.PagedResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    UserDto getCurrentUser(Long userId);
    JobSeekerProfileDto getJobSeekerProfile(Long userId);
    JobSeekerProfileDto updateJobSeekerProfile(Long userId, JobSeekerProfileDto dto);
    JobSeekerProfileDto uploadResume(Long userId, MultipartFile file);
    RecruiterProfileDto getRecruiterProfile(Long userId);
    RecruiterProfileDto updateRecruiterProfile(Long userId, RecruiterProfileDto dto);

    // Saved Jobs
    void saveJob(Long userId, Long jobId);
    void unsaveJob(Long userId, Long jobId);
    PagedResponse<JobDto> getSavedJobs(Long userId, Pageable pageable);

    // Job Alerts
    JobAlert createJobAlert(Long userId, JobAlert alert);
    PagedResponse<JobAlert> getJobAlerts(Long userId, Pageable pageable);
    void deleteJobAlert(Long userId, Long alertId);
}
