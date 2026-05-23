package com.smarted.dto;

public class AuthResponse {

    private String token;
    private Long userId;
    private String name;
    private String email;
    private String level;
    private String role;

    public AuthResponse() {
    }

    public AuthResponse(String token, Long userId, String name, String email, String level) {
        this(token, userId, name, email, level, "STUDENT");
    }

    public AuthResponse(String token, Long userId, String name, String email, String level, String role) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.level = level;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
