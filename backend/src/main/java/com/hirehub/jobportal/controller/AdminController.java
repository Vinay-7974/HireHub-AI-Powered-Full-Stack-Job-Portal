package com.hirehub.jobportal.controller;

import com.hirehub.jobportal.dto.job.JobDto;
import com.hirehub.jobportal.dto.user.UserDto;
import com.hirehub.jobportal.entity.enums.Role;
import com.hirehub.jobportal.response.ApiResponse;
import com.hirehub.jobportal.response.PagedResponse;
import com.hirehub.jobportal.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Console", description = "Endpoints for platform analytics, user moderation, job moderation, and system settings")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/analytics")
    @Operation(summary = "Get high-level platform analytics and statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAdminAnalytics()));
    }

    @GetMapping("/users")
    @Operation(summary = "List users with role filter and pagination")
    public ResponseEntity<ApiResponse<PagedResponse<UserDto>>> getUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getUsers(role, PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Activate or suspend a user account")
    public ResponseEntity<ApiResponse<Void>> toggleUserStatus(
            @PathVariable Long id,
            @RequestParam boolean active
    ) {
        adminService.toggleUserStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success("User status updated to " + (active ? "Active" : "Suspended"), null));
    }

    @GetMapping("/jobs")
    @Operation(summary = "List all platform jobs for moderation")
    public ResponseEntity<ApiResponse<PagedResponse<JobDto>>> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllJobs(PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }

    @DeleteMapping("/jobs/{id}")
    @Operation(summary = "Delete an inappropriate job posting")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        adminService.deleteJob(id);
        return ResponseEntity.ok(ApiResponse.success("Job posting removed", null));
    }

    @PatchMapping("/companies/{id}/verify")
    @Operation(summary = "Verify or unverify a company")
    public ResponseEntity<ApiResponse<Void>> verifyCompany(
            @PathVariable Long id,
            @RequestParam boolean verified
    ) {
        adminService.verifyCompany(id, verified);
        return ResponseEntity.ok(ApiResponse.success("Company verification updated", null));
    }
}
