package com.hirehub.jobportal.controller;

import com.hirehub.jobportal.dto.job.JobCreateRequest;
import com.hirehub.jobportal.dto.job.JobDto;
import com.hirehub.jobportal.entity.enums.EmploymentType;
import com.hirehub.jobportal.entity.enums.ExperienceLevel;
import com.hirehub.jobportal.entity.enums.JobStatus;
import com.hirehub.jobportal.entity.enums.WorkMode;
import com.hirehub.jobportal.response.ApiResponse;
import com.hirehub.jobportal.response.PagedResponse;
import com.hirehub.jobportal.security.UserPrincipal;
import com.hirehub.jobportal.service.JobService;
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

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@Tag(name = "Jobs", description = "Endpoints for searching, viewing, creating, and managing job postings")
public class JobController {

    private final JobService jobService;

    @GetMapping
    @Operation(summary = "Search jobs with rich filters and pagination")
    public ResponseEntity<ApiResponse<PagedResponse<JobDto>>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) WorkMode workMode,
            @RequestParam(required = false) EmploymentType employmentType,
            @RequestParam(required = false) ExperienceLevel experienceLevel,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minSalary,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Long userId = (userPrincipal != null) ? userPrincipal.getId() : null;

        PagedResponse<JobDto> jobs = jobService.searchJobs(
                keyword, location, workMode, employmentType, experienceLevel, category, minSalary, userId, pageRequest
        );
        return ResponseEntity.ok(ApiResponse.success("Jobs fetched successfully", jobs));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed information for a single job")
    public ResponseEntity<ApiResponse<JobDto>> getJobById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Long userId = (userPrincipal != null) ? userPrincipal.getId() : null;
        JobDto job = jobService.getJobById(id, userId);
        return ResponseEntity.ok(ApiResponse.success(job));
    }

    @GetMapping("/categories")
    @Operation(summary = "List all distinct job categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(jobService.getJobCategories()));
    }

    @GetMapping("/recruiter/my-jobs")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Get jobs posted by the logged-in recruiter")
    public ResponseEntity<ApiResponse<PagedResponse<JobDto>>> getMyJobs(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<JobDto> jobs = jobService.getRecruiterJobs(
                userPrincipal.getId(), PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Create and publish a new job posting")
    public ResponseEntity<ApiResponse<JobDto>> createJob(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody JobCreateRequest request
    ) {
        JobDto created = jobService.createJob(userPrincipal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Job posted successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Update an existing job posting")
    public ResponseEntity<ApiResponse<JobDto>> updateJob(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @Valid @RequestBody JobCreateRequest request
    ) {
        JobDto updated = jobService.updateJob(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Job updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Update job status (PUBLISHED, PAUSED, CLOSED)")
    public ResponseEntity<ApiResponse<Void>> updateJobStatus(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @RequestParam JobStatus status
    ) {
        jobService.updateJobStatus(userPrincipal.getId(), id, status);
        return ResponseEntity.ok(ApiResponse.success("Job status updated to " + status, null));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Delete a job posting")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id
    ) {
        jobService.deleteJob(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Job deleted successfully", null));
    }
}
