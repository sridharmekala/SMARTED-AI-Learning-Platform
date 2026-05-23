package com.smarted.dto;

import java.time.LocalDateTime;

public class ProfileResponse {

    private Long userId;
    private String name;
    private String email;
    private String level;
    private LocalDateTime joinedDate;

    public ProfileResponse() {
    }

    public ProfileResponse(Long userId, String name, String email, String level, LocalDateTime joinedDate) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.level = level;
        this.joinedDate = joinedDate;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public LocalDateTime getJoinedDate() {
        return joinedDate;
    }

    public void setJoinedDate(LocalDateTime joinedDate) {
        this.joinedDate = joinedDate;
    }
}
