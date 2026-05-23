package com.smarted.dto;

public class AdminStudentProgressResponse {

    private Long courseId;
    private String courseName;
    private long totalTopics;
    private long completedTopics;
    private long pendingTopics;
    private int progressPercentage;

    public AdminStudentProgressResponse() {
    }

    public AdminStudentProgressResponse(
            Long courseId,
            String courseName,
            long totalTopics,
            long completedTopics,
            long pendingTopics,
            int progressPercentage
    ) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.totalTopics = totalTopics;
        this.completedTopics = completedTopics;
        this.pendingTopics = pendingTopics;
        this.progressPercentage = progressPercentage;
    }

    public Long getCourseId() {
        return courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public long getTotalTopics() {
        return totalTopics;
    }

    public long getCompletedTopics() {
        return completedTopics;
    }

    public long getPendingTopics() {
        return pendingTopics;
    }

    public int getProgressPercentage() {
        return progressPercentage;
    }
}
