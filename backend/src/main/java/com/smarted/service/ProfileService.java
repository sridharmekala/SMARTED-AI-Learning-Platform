package com.smarted.service;

import com.smarted.dto.AuthResponse;
import com.smarted.dto.ProfileResponse;
import com.smarted.dto.ProfileUpdateRequest;
import com.smarted.entity.User;
import com.smarted.repository.UserRepository;
import com.smarted.security.JwtUtil;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    public ProfileService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            CustomUserDetailsService userDetailsService,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    public ProfileResponse getProfile(String email) {
        User user = getUser(email);
        return toProfileResponse(user);
    }

    public AuthResponse updateProfile(String email, ProfileUpdateRequest request) {
        User user = getUser(email);
        String nextName = normalize(request.getName());
        String nextEmail = normalize(request.getEmail());
        String newPassword = normalize(request.getNewPassword());

        if (nextName == null) {
            throw new IllegalArgumentException("Name is required");
        }

        if (nextEmail == null) {
            throw new IllegalArgumentException("Email is required");
        }

        userRepository.findByEmail(nextEmail)
                .filter(existingUser -> !existingUser.getId().equals(user.getId()))
                .ifPresent(existingUser -> {
                    throw new IllegalArgumentException("Email is already registered");
                });

        user.setName(nextName);
        user.setEmail(nextEmail);

        if (newPassword != null) {
            String currentPassword = normalize(request.getCurrentPassword());

            if (currentPassword == null) {
                throw new IllegalArgumentException("Current password is required to change password");
            }

            if (newPassword.length() < 6) {
                throw new IllegalArgumentException("New password must be at least 6 characters");
            }

            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                throw new IllegalArgumentException("Current password is incorrect");
            }

            user.setPassword(passwordEncoder.encode(newPassword));
        }

        User savedUser = userRepository.save(user);
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getLevel(),
                savedUser.getRole()
        );
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private ProfileResponse toProfileResponse(User user) {
        return new ProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getLevel(),
                user.getCreatedAt()
        );
    }

    private String normalize(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}
