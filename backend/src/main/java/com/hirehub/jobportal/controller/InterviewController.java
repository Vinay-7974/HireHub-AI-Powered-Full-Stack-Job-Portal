package com.hirehub.jobportal.controller;

import com.hirehub.jobportal.dto.application.InterviewDto;
import com.hirehub.jobportal.entity.enums.InterviewStatus;
import com.hirehub.jobportal.response.ApiResponse;
import com.hirehub.jobportal.response.PagedResponse;
import com.hirehub.jobportal.security.UserPrincipal;
import com.hirehub.jobportal.service.InterviewService;
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
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
@Tag(name = "Interviews", description = "Endpoints for scheduling, managing, and viewing candidate interviews")
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping("/schedule")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Schedule an interview with a candidate")
    public ResponseEntity<ApiResponse<InterviewDto>> scheduleInterview(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody InterviewDto.ScheduleRequest request
    ) {
        InterviewDto interview = interviewService.scheduleInterview(userPrincipal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Interview scheduled successfully", interview), HttpStatus.CREATED);
    }

    @GetMapping("/seeker")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @Operation(summary = "Get upcoming and past interviews for job seeker")
    public ResponseEntity<ApiResponse<PagedResponse<InterviewDto>>> getSeekerInterviews(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<InterviewDto> interviews = interviewService.getApplicantInterviews(
                userPrincipal.getId(), PageRequest.of(page, size, Sort.by("interviewDate").descending())
        );
        return ResponseEntity.ok(ApiResponse.success(interviews));
    }

    @GetMapping("/recruiter")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Get scheduled interviews for recruiter")
    public ResponseEntity<ApiResponse<PagedResponse<InterviewDto>>> getRecruiterInterviews(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<InterviewDto> interviews = interviewService.getRecruiterInterviews(
                userPrincipal.getId(), PageRequest.of(page, size, Sort.by("interviewDate").descending())
        );
        return ResponseEntity.ok(ApiResponse.success(interviews));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Update interview status (SCHEDULED, COMPLETED, CANCELLED, RESCHEDULED)")
    public ResponseEntity<ApiResponse<InterviewDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam InterviewStatus status
    ) {
        return ResponseEntity.ok(ApiResponse.success("Interview status updated", interviewService.updateInterviewStatus(id, status)));
    }
}
