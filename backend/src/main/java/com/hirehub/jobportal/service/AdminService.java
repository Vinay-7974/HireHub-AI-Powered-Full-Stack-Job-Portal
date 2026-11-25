package com.hirehub.jobportal.service;

import com.hirehub.jobportal.dto.job.CompanyDto;
import com.hirehub.jobportal.dto.job.JobDto;
import com.hirehub.jobportal.dto.user.UserDto;
import com.hirehub.jobportal.entity.Skill;
import com.hirehub.jobportal.entity.enums.Role;
import com.hirehub.jobportal.response.PagedResponse;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface AdminService {
    Map<String, Object> getAdminAnalytics();
    PagedResponse<UserDto> getUsers(Role role, Pageable pageable);
    void toggleUserStatus(Long userId, boolean active);
    PagedResponse<JobDto> getAllJobs(Pageable pageable);
    void deleteJob(Long jobId);
    void verifyCompany(Long companyId, boolean verified);
    Skill createSkill(Skill skill);
}
