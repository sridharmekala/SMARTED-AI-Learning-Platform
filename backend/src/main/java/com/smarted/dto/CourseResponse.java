package com.smarted.dto;

public class CourseResponse {

    private Long id;
    private String name;
    private String description;
    private long totalTopics;
    private long completedTopics;
    private long pendingTopics;
    private int progressPercentage;

    public CourseResponse() {
    }

    public CourseResponse(
            Long id,
            String name,
            String description,
            long totalTopics,
            long completedTopics,
            long pendingTopics,
            int progressPercentage
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.totalTopics = totalTopics;
        this.completedTopics = completedTopics;
        this.pendingTopics = pendingTopics;
        this.progressPercentage = progressPercentage;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
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
