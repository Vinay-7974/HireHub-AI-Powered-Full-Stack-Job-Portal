package com.hirehub.jobportal.dto.job;

import com.hirehub.jobportal.entity.enums.EmploymentType;
import com.hirehub.jobportal.entity.enums.ExperienceLevel;
import com.hirehub.jobportal.entity.enums.JobStatus;
import com.hirehub.jobportal.entity.enums.WorkMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDto {
    private Long id;
    private Long companyId;
    private String companyName;
    private String companyLogo;
    private String companyLocation;
    private Long recruiterId;
    private String recruiterName;
    private String title;
    private String description;
    private String responsibilities;
    private String requirements;
    private Double salaryMin;
    private Double salaryMax;
    private String location;
    private EmploymentType employmentType;
    private WorkMode workMode;
    private ExperienceLevel experienceLevel;
    private String category;
    private JobStatus status;
    private Long viewsCount;
    private LocalDate deadline;
    private String benefits;
    @Builder.Default
    private List<String> requiredSkills = new ArrayList<>();
    private long applicantsCount;
    private boolean isSaved;
    private boolean hasApplied;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
