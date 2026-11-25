package com.hirehub.jobportal.controller;

import com.hirehub.jobportal.dto.job.JobDto;
import com.hirehub.jobportal.dto.user.JobSeekerProfileDto;
import com.hirehub.jobportal.dto.user.RecruiterProfileDto;
import com.hirehub.jobportal.dto.user.UserDto;
import com.hirehub.jobportal.entity.JobAlert;
import com.hirehub.jobportal.response.ApiResponse;
import com.hirehub.jobportal.response.PagedResponse;
import com.hirehub.jobportal.security.UserPrincipal;
import com.hirehub.jobportal.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Endpoints for Profile, Resume, Saved Jobs, and Job Alerts")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user info")
    public ResponseEntity<ApiResponse<UserDto>> getMyInfo(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.success(userService.getCurrentUser(userPrincipal.getId())));
    }

    // Job Seeker Profile
    @GetMapping("/jobseeker/profile")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'ADMIN')")
    @Operation(summary = "Get job seeker profile")
    public ResponseEntity<ApiResponse<JobSeekerProfileDto>> getJobSeekerProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.success(userService.getJobSeekerProfile(userPrincipal.getId())));
    }

    @PutMapping("/jobseeker/profile")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'ADMIN')")
    @Operation(summary = "Update job seeker profile")
    public ResponseEntity<ApiResponse<JobSeekerProfileDto>> updateJobSeekerProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody JobSeekerProfileDto dto
    ) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", userService.updateJobSeekerProfile(userPrincipal.getId(), dto)));
    }

    @PostMapping(value = "/jobseeker/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @Operation(summary = "Upload resume PDF/DOCX for Job Seeker")
    public ResponseEntity<ApiResponse<JobSeekerProfileDto>> uploadResume(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam("file") MultipartFile file
    ) {
        JobSeekerProfileDto updated = userService.uploadResume(userPrincipal.getId(), file);
        return ResponseEntity.ok(ApiResponse.success("Resume uploaded successfully", updated));
    }

    // Recruiter Profile
    @GetMapping("/recruiter/profile")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Get recruiter profile")
    public ResponseEntity<ApiResponse<RecruiterProfileDto>> getRecruiterProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.success(userService.getRecruiterProfile(userPrincipal.getId())));
    }

    @PutMapping("/recruiter/profile")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Update recruiter profile")
    public ResponseEntity<ApiResponse<RecruiterProfileDto>> updateRecruiterProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody RecruiterProfileDto dto
    ) {
        return ResponseEntity.ok(ApiResponse.success("Recruiter profile updated", userService.updateRecruiterProfile(userPrincipal.getId(), dto)));
    }

    // Saved Jobs
    @PostMapping("/saved-jobs/{jobId}")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @Operation(summary = "Bookmark / save a job posting")
    public ResponseEntity<ApiResponse<Void>> saveJob(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long jobId
    ) {
        userService.saveJob(userPrincipal.getId(), jobId);
        return ResponseEntity.ok(ApiResponse.success("Job saved successfully", null));
    }

    @DeleteMapping("/saved-jobs/{jobId}")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @Operation(summary = "Remove bookmark / unsave a job posting")
    public ResponseEntity<ApiResponse<Void>> unsaveJob(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long jobId
    ) {
        userService.unsaveJob(userPrincipal.getId(), jobId);
        return ResponseEntity.ok(ApiResponse.success("Job removed from saved list", null));
    }

    @GetMapping("/saved-jobs")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @Operation(summary = "Get user's bookmarked / saved jobs")
    public ResponseEntity<ApiResponse<PagedResponse<JobDto>>> getSavedJobs(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(userService.getSavedJobs(userPrincipal.getId(), PageRequest.of(page, size))));
    }

    // Job Alerts
    @PostMapping("/alerts")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @Operation(summary = "Create a custom job alert")
    public ResponseEntity<ApiResponse<JobAlert>> createJobAlert(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody JobAlert alert
    ) {
        return ResponseEntity.ok(ApiResponse.success("Job alert created", userService.createJobAlert(userPrincipal.getId(), alert)));
    }

    @GetMapping("/alerts")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @Operation(summary = "Get user's active job alerts")
    public ResponseEntity<ApiResponse<PagedResponse<JobAlert>>> getJobAlerts(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(userService.getJobAlerts(userPrincipal.getId(), PageRequest.of(page, size))));
    }

    @DeleteMapping("/alerts/{id}")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @Operation(summary = "Delete a job alert")
    public ResponseEntity<ApiResponse<Void>> deleteJobAlert(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id
    ) {
        userService.deleteJobAlert(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Job alert deleted", null));
    }
}
