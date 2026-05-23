package com.smarted.dto;

import java.util.List;

public class LearningProgressResponse {

    private String courseName;
    private long totalTopics;
    private long completedCount;
    private long pendingCount;
    private int progressPercentage;
    private List<TopicProgressResponse> completedTopics;
    private List<TopicProgressResponse> pendingTopics;
    private List<TopicProgressResponse> newTopics;

    public LearningProgressResponse() {
    }

    public LearningProgressResponse(
            String courseName,
            long totalTopics,
            long completedCount,
            long pendingCount,
            int progressPercentage,
            List<TopicProgressResponse> completedTopics,
            List<TopicProgressResponse> pendingTopics,
            List<TopicProgressResponse> newTopics
    ) {
        this.courseName = courseName;
        this.totalTopics = totalTopics;
        this.completedCount = completedCount;
        this.pendingCount = pendingCount;
        this.progressPercentage = progressPercentage;
        this.completedTopics = completedTopics;
        this.pendingTopics = pendingTopics;
        this.newTopics = newTopics;
    }

    public String getCourseName() {
        return courseName;
    }

    public long getTotalTopics() {
        return totalTopics;
    }

    public long getCompletedCount() {
        return completedCount;
    }

    public long getPendingCount() {
        return pendingCount;
    }

    public int getProgressPercentage() {
        return progressPercentage;
    }

    public List<TopicProgressResponse> getCompletedTopics() {
        return completedTopics;
    }

    public List<TopicProgressResponse> getPendingTopics() {
        return pendingTopics;
    }

    public List<TopicProgressResponse> getNewTopics() {
        return newTopics;
    }
}
