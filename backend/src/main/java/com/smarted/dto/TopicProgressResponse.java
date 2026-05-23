package com.smarted.dto;

import java.time.LocalDateTime;

public class TopicProgressResponse {

    private Long topicId;
    private String title;
    private String description;
    private String content;
    private String difficulty;
    private Integer estimatedTimeMinutes;
    private String status;
    private LocalDateTime completedAt;

    public TopicProgressResponse() {
    }

    public TopicProgressResponse(
            Long topicId,
            String title,
            String description,
            String content,
            String difficulty,
            Integer estimatedTimeMinutes,
            String status,
            LocalDateTime completedAt
    ) {
        this.topicId = topicId;
        this.title = title;
        this.description = description;
        this.content = content;
        this.difficulty = difficulty;
        this.estimatedTimeMinutes = estimatedTimeMinutes;
        this.status = status;
        this.completedAt = completedAt;
    }

    public Long getTopicId() {
        return topicId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getContent() {
        return content;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public Integer getEstimatedTimeMinutes() {
        return estimatedTimeMinutes;
    }

    public String getStatus() {
        return status;
    }

    public boolean isCompleted() {
        return "COMPLETED".equals(status);
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}
