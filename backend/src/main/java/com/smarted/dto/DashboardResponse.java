package com.smarted.dto;

import java.util.List;

public class DashboardResponse {

    private Long userId;
    private String name;
    private String email;
    private String level;
    private long totalTopics;
    private long completedTopics;
    private long pendingTopics;
    private long newTopics;
    private int progressPercentage;
    private List<ScoreHistoryResponse> scoreHistory;
    private List<RecommendedTopicResponse> recommendedTopics;

    public DashboardResponse() {
    }

    public DashboardResponse(
            Long userId,
            String name,
            String email,
            String level,
            long totalTopics,
            long completedTopics,
            long pendingTopics,
            long newTopics,
            int progressPercentage,
            List<ScoreHistoryResponse> scoreHistory,
            List<RecommendedTopicResponse> recommendedTopics
    ) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.level = level;
        this.totalTopics = totalTopics;
        this.completedTopics = completedTopics;
        this.pendingTopics = pendingTopics;
        this.newTopics = newTopics;
        this.progressPercentage = progressPercentage;
        this.scoreHistory = scoreHistory;
        this.recommendedTopics = recommendedTopics;
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

    public long getTotalTopics() {
        return totalTopics;
    }

    public void setTotalTopics(long totalTopics) {
        this.totalTopics = totalTopics;
    }

    public long getCompletedTopics() {
        return completedTopics;
    }

    public void setCompletedTopics(long completedTopics) {
        this.completedTopics = completedTopics;
    }

    public long getPendingTopics() {
        return pendingTopics;
    }

    public void setPendingTopics(long pendingTopics) {
        this.pendingTopics = pendingTopics;
    }

    public long getNewTopics() {
        return newTopics;
    }

    public void setNewTopics(long newTopics) {
        this.newTopics = newTopics;
    }

    public int getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(int progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public List<ScoreHistoryResponse> getScoreHistory() {
        return scoreHistory;
    }

    public void setScoreHistory(List<ScoreHistoryResponse> scoreHistory) {
        this.scoreHistory = scoreHistory;
    }

    public List<RecommendedTopicResponse> getRecommendedTopics() {
        return recommendedTopics;
    }

    public void setRecommendedTopics(List<RecommendedTopicResponse> recommendedTopics) {
        this.recommendedTopics = recommendedTopics;
    }
}
