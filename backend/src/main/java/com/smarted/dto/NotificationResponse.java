package com.smarted.dto;

import java.time.LocalDateTime;

public class NotificationResponse {

    private String type;
    private String title;
    private String message;
    private String priority;
    private Long topicId;
    private String actionLabel;
    private String actionUrl;
    private LocalDateTime createdAt;

    public NotificationResponse() {
    }

    public NotificationResponse(
            String type,
            String title,
            String message,
            String priority,
            Long topicId,
            String actionLabel,
            String actionUrl,
            LocalDateTime createdAt
    ) {
        this.type = type;
        this.title = title;
        this.message = message;
        this.priority = priority;
        this.topicId = topicId;
        this.actionLabel = actionLabel;
        this.actionUrl = actionUrl;
        this.createdAt = createdAt;
    }

    public String getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public String getPriority() {
        return priority;
    }

    public Long getTopicId() {
        return topicId;
    }

    public String getActionLabel() {
        return actionLabel;
    }

    public String getActionUrl() {
        return actionUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
