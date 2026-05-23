package com.smarted.dto;

public class DailyPlanTaskResponse {

    private String type;
    private String title;
    private String description;
    private Long topicId;
    private String topicTitle;
    private String actionLabel;
    private String actionUrl;

    public DailyPlanTaskResponse() {
    }

    public DailyPlanTaskResponse(
            String type,
            String title,
            String description,
            Long topicId,
            String topicTitle,
            String actionLabel,
            String actionUrl
    ) {
        this.type = type;
        this.title = title;
        this.description = description;
        this.topicId = topicId;
        this.topicTitle = topicTitle;
        this.actionLabel = actionLabel;
        this.actionUrl = actionUrl;
    }

    public String getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Long getTopicId() {
        return topicId;
    }

    public String getTopicTitle() {
        return topicTitle;
    }

    public String getActionLabel() {
        return actionLabel;
    }

    public String getActionUrl() {
        return actionUrl;
    }
}
