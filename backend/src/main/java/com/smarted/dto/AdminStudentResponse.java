package com.smarted.dto;

import java.time.LocalDateTime;

public class AdminStudentResponse {

    private Long userId;
    private String name;
    private String email;
    private String level;
    private String role;
    private LocalDateTime joinedDate;

    public AdminStudentResponse() {
    }

    public AdminStudentResponse(Long userId, String name, String email, String level, String role, LocalDateTime joinedDate) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.level = level;
        this.role = role;
        this.joinedDate = joinedDate;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getLevel() {
        return level;
    }

    public String getRole() {
        return role;
    }

    public LocalDateTime getJoinedDate() {
        return joinedDate;
    }
}
