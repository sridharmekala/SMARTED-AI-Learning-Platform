package com.smarted.dto;

public class AdminPasswordResetRequest {

    private String newPassword;

    public AdminPasswordResetRequest() {
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
