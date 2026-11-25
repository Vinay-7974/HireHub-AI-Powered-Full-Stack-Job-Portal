package com.hirehub.jobportal.service;

import com.hirehub.jobportal.dto.job.CompanyDto;
import com.hirehub.jobportal.response.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface CompanyService {
    CompanyDto getCompanyById(Long id);
    PagedResponse<CompanyDto> getCompanies(String industry, Pageable pageable);
    CompanyDto updateCompany(Long companyId, CompanyDto dto);
    CompanyDto createCompany(CompanyDto dto);
}
