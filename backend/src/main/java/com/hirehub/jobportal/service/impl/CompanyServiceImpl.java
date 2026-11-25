package com.hirehub.jobportal.service.impl;

import com.hirehub.jobportal.dto.job.CompanyDto;
import com.hirehub.jobportal.entity.Company;
import com.hirehub.jobportal.entity.enums.JobStatus;
import com.hirehub.jobportal.exception.ResourceNotFoundException;
import com.hirehub.jobportal.repository.CompanyRepository;
import com.hirehub.jobportal.repository.JobRepository;
import com.hirehub.jobportal.response.PagedResponse;
import com.hirehub.jobportal.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;

    @Override
    @Transactional(readOnly = true)
    public CompanyDto getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
        return mapToDto(company);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<CompanyDto> getCompanies(String industry, Pageable pageable) {
        Page<Company> page;
        if (industry != null && !industry.isBlank()) {
            page = companyRepository.findByIndustryContainingIgnoreCase(industry, pageable);
        } else {
            page = companyRepository.findAll(pageable);
        }
        return PagedResponse.from(page.map(this::mapToDto));
    }

    @Override
    @Transactional
    public CompanyDto updateCompany(Long companyId, CompanyDto dto) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

        if (dto.getName() != null) company.setName(dto.getName());
        if (dto.getLogo() != null) company.setLogo(dto.getLogo());
        if (dto.getCoverImage() != null) company.setCoverImage(dto.getCoverImage());
        if (dto.getDescription() != null) company.setDescription(dto.getDescription());
        if (dto.getWebsite() != null) company.setWebsite(dto.getWebsite());
        if (dto.getIndustry() != null) company.setIndustry(dto.getIndustry());
        if (dto.getCompanySize() != null) company.setCompanySize(dto.getCompanySize());
        if (dto.getLocation() != null) company.setLocation(dto.getLocation());
        if (dto.getLinkedinUrl() != null) company.setLinkedinUrl(dto.getLinkedinUrl());
        if (dto.getTwitterUrl() != null) company.setTwitterUrl(dto.getTwitterUrl());

        company = companyRepository.save(company);
        return mapToDto(company);
    }

    @Override
    @Transactional
    public CompanyDto createCompany(CompanyDto dto) {
        Company company = Company.builder()
                .name(dto.getName())
                .logo(dto.getLogo())
                .coverImage(dto.getCoverImage())
                .description(dto.getDescription())
                .website(dto.getWebsite())
                .industry(dto.getIndustry())
                .companySize(dto.getCompanySize())
                .location(dto.getLocation())
                .linkedinUrl(dto.getLinkedinUrl())
                .twitterUrl(dto.getTwitterUrl())
                .verified(false)
                .build();
        company = companyRepository.save(company);
        return mapToDto(company);
    }

    private CompanyDto mapToDto(Company company) {
        long openJobs = jobRepository.findByCompanyIdAndStatus(company.getId(), JobStatus.PUBLISHED, Pageable.unpaged()).getTotalElements();
        return CompanyDto.builder()
                .id(company.getId())
                .name(company.getName())
                .logo(company.getLogo())
                .coverImage(company.getCoverImage())
                .description(company.getDescription())
                .website(company.getWebsite())
                .industry(company.getIndustry())
                .companySize(company.getCompanySize())
                .location(company.getLocation())
                .linkedinUrl(company.getLinkedinUrl())
                .twitterUrl(company.getTwitterUrl())
                .verified(company.isVerified())
                .openJobsCount(openJobs)
                .createdAt(company.getCreatedAt())
                .build();
    }
}
