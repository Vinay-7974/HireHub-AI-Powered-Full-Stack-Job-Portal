package com.hirehub.jobportal.service;

import com.hirehub.jobportal.dto.auth.AuthResponse;
import com.hirehub.jobportal.dto.auth.LoginRequest;
import com.hirehub.jobportal.dto.auth.RefreshTokenRequest;
import com.hirehub.jobportal.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
}
