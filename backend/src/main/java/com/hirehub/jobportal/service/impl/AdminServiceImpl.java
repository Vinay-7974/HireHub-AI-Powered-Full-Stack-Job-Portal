package com.hirehub.jobportal.service.impl;

import com.hirehub.jobportal.dto.job.JobDto;
import com.hirehub.jobportal.dto.user.UserDto;
import com.hirehub.jobportal.entity.*;
import com.hirehub.jobportal.entity.enums.Role;
import com.hirehub.jobportal.exception.ResourceNotFoundException;
import com.hirehub.jobportal.repository.*;
import com.hirehub.jobportal.response.PagedResponse;
import com.hirehub.jobportal.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final SkillRepository skillRepository;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAdminAnalytics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalJobSeekers", userRepository.countByRole(Role.ROLE_JOB_SEEKER));
        stats.put("totalRecruiters", userRepository.countByRole(Role.ROLE_RECRUITER));
        stats.put("totalCompanies", companyRepository.count());
        stats.put("totalJobs", jobRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("totalInterviews", interviewRepository.count());
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<UserDto> getUsers(Role role, Pageable pageable) {
        Page<User> page = (role != null)
                ? userRepository.findByRole(role, pageable)
                : userRepository.findAll(pageable);

        return PagedResponse.from(page.map(u -> UserDto.builder()
                .id(u.getId())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .phone(u.getPhone())
                .role(u.getRole())
                .active(u.isActive())
                .profilePhoto(u.getProfilePhoto())
                .createdAt(u.getCreatedAt())
                .build()));
    }

    @Override
    @Transactional
    public void toggleUserStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setActive(active);
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<JobDto> getAllJobs(Pageable pageable) {
        Page<Job> page = jobRepository.findAll(pageable);
        return PagedResponse.from(page.map(j -> JobDto.builder()
                .id(j.getId())
                .companyId(j.getCompany().getId())
                .companyName(j.getCompany().getName())
                .companyLogo(j.getCompany().getLogo())
                .recruiterId(j.getRecruiter().getId())
                .recruiterName(j.getRecruiter().getFullName())
                .title(j.getTitle())
                .salaryMin(j.getSalaryMin())
                .salaryMax(j.getSalaryMax())
                .location(j.getLocation())
                .employmentType(j.getEmploymentType())
                .workMode(j.getWorkMode())
                .experienceLevel(j.getExperienceLevel())
                .category(j.getCategory())
                .status(j.getStatus())
                .viewsCount(j.getViewsCount())
                .deadline(j.getDeadline())
                .requiredSkills(j.getRequiredSkills())
                .createdAt(j.getCreatedAt())
                .build()));
    }

    @Override
    @Transactional
    public void deleteJob(Long jobId) {
        jobRepository.deleteById(jobId);
    }

    @Override
    @Transactional
    public void verifyCompany(Long companyId, boolean verified) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));
        company.setVerified(verified);
        companyRepository.save(company);
    }

    @Override
    @Transactional
    public Skill createSkill(Skill skill) {
        return skillRepository.save(skill);
    }
}
