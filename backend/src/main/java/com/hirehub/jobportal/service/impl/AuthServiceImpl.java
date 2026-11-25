package com.hirehub.jobportal.service.impl;

import com.hirehub.jobportal.dto.auth.AuthResponse;
import com.hirehub.jobportal.dto.auth.LoginRequest;
import com.hirehub.jobportal.dto.auth.RefreshTokenRequest;
import com.hirehub.jobportal.dto.auth.RegisterRequest;
import com.hirehub.jobportal.entity.*;
import com.hirehub.jobportal.entity.enums.Role;
import com.hirehub.jobportal.exception.BadRequestException;
import com.hirehub.jobportal.repository.*;
import com.hirehub.jobportal.security.JwtTokenProvider;
import com.hirehub.jobportal.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists");
        }

        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .phone(request.getPhone())
                .role(request.getRole() != null ? request.getRole() : Role.ROLE_JOB_SEEKER)
                .active(true)
                .build();

        user = userRepository.save(user);

        Long companyId = null;
        String companyName = null;

        if (user.getRole() == Role.ROLE_JOB_SEEKER) {
            JobSeekerProfile profile = JobSeekerProfile.builder()
                    .user(user)
                    .headline("Job Seeker")
                    .profileCompletionPercentage(25)
                    .build();
            jobSeekerProfileRepository.save(profile);
        } else if (user.getRole() == Role.ROLE_RECRUITER) {
            Company company = null;
            if (request.getCompanyName() != null && !request.getCompanyName().isBlank()) {
                company = companyRepository.findByNameIgnoreCase(request.getCompanyName().trim())
                        .orElseGet(() -> companyRepository.save(Company.builder()
                                .name(request.getCompanyName().trim())
                                .verified(false)
                                .build()));
                companyId = company.getId();
                companyName = company.getName();
            }

            RecruiterProfile profile = RecruiterProfile.builder()
                    .user(user)
                    .company(company)
                    .designation("Talent Acquisition Partner")
                    .build();
            recruiterProfileRepository.save(profile);
        }

        String token = tokenProvider.generateTokenFromUsername(user.getEmail(), user.getId(), user.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .profilePhoto(user.getProfilePhoto())
                .companyId(companyId)
                .companyName(companyName)
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (!user.isActive()) {
            throw new BadRequestException("Your account has been deactivated. Please contact support.");
        }

        String token = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        Long companyId = null;
        String companyName = null;

        if (user.getRole() == Role.ROLE_RECRUITER) {
            var recProfile = recruiterProfileRepository.findByUserId(user.getId());
            if (recProfile.isPresent() && recProfile.get().getCompany() != null) {
                companyId = recProfile.get().getCompany().getId();
                companyName = recProfile.get().getCompany().getName();
            }
        }

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .profilePhoto(user.getProfilePhoto())
                .companyId(companyId)
                .companyName(companyName)
                .build();
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (!tokenProvider.validateToken(request.getRefreshToken())) {
            throw new BadRequestException("Invalid or expired refresh token");
        }

        String email = tokenProvider.getUsernameFromJwt(request.getRefreshToken());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        String newToken = tokenProvider.generateTokenFromUsername(user.getEmail(), user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(newToken)
                .refreshToken(request.getRefreshToken())
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .profilePhoto(user.getProfilePhoto())
                .build();
    }
}
