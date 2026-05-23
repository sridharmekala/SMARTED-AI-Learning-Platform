package com.smarted.dto;

import java.time.LocalDate;

public class CertificateResponse {

    private boolean eligible;
    private String studentName;
    private String courseName;
    private LocalDate completionDate;
    private long totalTopics;
    private long completedTopics;
    private int progressPercentage;
    private String message;

    public CertificateResponse() {
    }

    public CertificateResponse(
            boolean eligible,
            String studentName,
            String courseName,
            LocalDate completionDate,
            long totalTopics,
            long completedTopics,
            int progressPercentage,
            String message
    ) {
        this.eligible = eligible;
        this.studentName = studentName;
        this.courseName = courseName;
        this.completionDate = completionDate;
        this.totalTopics = totalTopics;
        this.completedTopics = completedTopics;
        this.progressPercentage = progressPercentage;
        this.message = message;
    }

    public boolean isEligible() {
        return eligible;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getCourseName() {
        return courseName;
    }

    public LocalDate getCompletionDate() {
        return completionDate;
    }

    public long getTotalTopics() {
        return totalTopics;
    }

    public long getCompletedTopics() {
        return completedTopics;
    }

    public int getProgressPercentage() {
        return progressPercentage;
    }

    public String getMessage() {
        return message;
    }
}
