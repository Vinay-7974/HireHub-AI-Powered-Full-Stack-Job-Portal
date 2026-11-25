package com.hirehub.jobportal.controller;

import com.hirehub.jobportal.dto.job.CompanyDto;
import com.hirehub.jobportal.response.ApiResponse;
import com.hirehub.jobportal.response.PagedResponse;
import com.hirehub.jobportal.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@Tag(name = "Companies", description = "Endpoints for viewing and managing employer company profiles")
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    @Operation(summary = "Get list of companies with optional industry filter")
    public ResponseEntity<ApiResponse<PagedResponse<CompanyDto>>> getCompanies(
            @RequestParam(required = false) String industry,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        PagedResponse<CompanyDto> response = companyService.getCompanies(
                industry, PageRequest.of(page, size, Sort.by("name").ascending())
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get company profile by ID")
    public ResponseEntity<ApiResponse<CompanyDto>> getCompanyById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(companyService.getCompanyById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Update company profile")
    public ResponseEntity<ApiResponse<CompanyDto>> updateCompany(
            @PathVariable Long id,
            @RequestBody CompanyDto dto
    ) {
        return ResponseEntity.ok(ApiResponse.success("Company profile updated", companyService.updateCompany(id, dto)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Create a new company profile")
    public ResponseEntity<ApiResponse<CompanyDto>> createCompany(@Valid @RequestBody CompanyDto dto) {
        return new ResponseEntity<>(ApiResponse.success("Company created", companyService.createCompany(dto)), HttpStatus.CREATED);
    }
}
