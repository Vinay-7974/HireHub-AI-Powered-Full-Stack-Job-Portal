package com.hirehub.jobportal.controller;

import com.hirehub.jobportal.dto.application.ApplicationCreateRequest;
import com.hirehub.jobportal.dto.application.ApplicationDto;
import com.hirehub.jobportal.dto.application.ApplicationStatusUpdateRequest;
import com.hirehub.jobportal.entity.enums.ApplicationStatus;
import com.hirehub.jobportal.response.ApiResponse;
import com.hirehub.jobportal.response.PagedResponse;
import com.hirehub.jobportal.security.UserPrincipal;
import com.hirehub.jobportal.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Tag(name = "Applications", description = "Endpoints for job applications, status updates, and tracking")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @Operation(summary = "Submit a job application")
    public ResponseEntity<ApiResponse<ApplicationDto>> applyForJob(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ApplicationCreateRequest request
    ) {
        ApplicationDto application = applicationService.applyForJob(userPrincipal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Application submitted successfully", application), HttpStatus.CREATED);
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @Operation(summary = "Get all applications submitted by the logged-in job seeker")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationDto>>> getMyApplications(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<ApplicationDto> apps = applicationService.getJobSeekerApplications(
                userPrincipal.getId(), PageRequest.of(page, size, Sort.by("appliedAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.success(apps));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Get all applications for a specific job posting")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationDto>>> getJobApplications(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long jobId,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<ApplicationDto> apps = applicationService.getJobApplications(
                userPrincipal.getId(), jobId, status, PageRequest.of(page, size, Sort.by("appliedAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.success(apps));
    }

    @GetMapping("/recruiter/all")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Get all applications across all jobs posted by this recruiter")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationDto>>> getRecruiterApplications(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        PagedResponse<ApplicationDto> apps = applicationService.getRecruiterApplications(
                userPrincipal.getId(), PageRequest.of(page, size, Sort.by("appliedAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.success(apps));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get application details by ID")
    public ResponseEntity<ApiResponse<ApplicationDto>> getApplicationById(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.getApplicationById(id, userPrincipal.getId())));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Update application status (SHORTLISTED, REJECTED, INTERVIEW, etc.)")
    public ResponseEntity<ApiResponse<ApplicationDto>> updateStatus(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateRequest request
    ) {
        ApplicationDto updated = applicationService.updateApplicationStatus(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Status updated to " + request.getStatus(), updated));
    }

    @DeleteMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @Operation(summary = "Withdraw a submitted application")
    public ResponseEntity<ApiResponse<Void>> withdrawApplication(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id
    ) {
        applicationService.withdrawApplication(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Application withdrawn successfully", null));
    }
}
