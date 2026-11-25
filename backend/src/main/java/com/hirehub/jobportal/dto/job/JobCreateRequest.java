package com.hirehub.jobportal.dto.job;

import com.hirehub.jobportal.entity.enums.EmploymentType;
import com.hirehub.jobportal.entity.enums.ExperienceLevel;
import com.hirehub.jobportal.entity.enums.JobStatus;
import com.hirehub.jobportal.entity.enums.WorkMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobCreateRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    private Long companyId;

    @NotBlank(message = "Job description is required")
    private String description;

    private String responsibilities;
    private String requirements;

    private Double salaryMin;
    private Double salaryMax;

    private String location;

    @NotNull(message = "Employment type is required")
    private EmploymentType employmentType;

    @NotNull(message = "Work mode is required")
    private WorkMode workMode;

    @NotNull(message = "Experience level is required")
    private ExperienceLevel experienceLevel;

    private String category;
    private JobStatus status;
    private LocalDate deadline;
    private String benefits;

    @Builder.Default
    private List<String> requiredSkills = new ArrayList<>();
}
