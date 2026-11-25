package com.hirehub.jobportal.dto.job;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDto {
    private Long id;
    private String name;
    private String logo;
    private String coverImage;
    private String description;
    private String website;
    private String industry;
    private String companySize;
    private String location;
    private String linkedinUrl;
    private String twitterUrl;
    private boolean verified;
    private long openJobsCount;
    private LocalDateTime createdAt;
}
