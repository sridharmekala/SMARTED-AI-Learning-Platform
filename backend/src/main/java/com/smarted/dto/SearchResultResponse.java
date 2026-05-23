package com.smarted.dto;

public class SearchResultResponse {

    private String type;
    private Long id;
    private Long courseId;
    private Long topicId;
    private String title;
    private String description;
    private String matchedText;
    private String actionUrl;

    public SearchResultResponse() {
    }

    public SearchResultResponse(
            String type,
            Long id,
            Long courseId,
            Long topicId,
            String title,
            String description,
            String matchedText,
            String actionUrl
    ) {
        this.type = type;
        this.id = id;
        this.courseId = courseId;
        this.topicId = topicId;
        this.title = title;
        this.description = description;
        this.matchedText = matchedText;
        this.actionUrl = actionUrl;
    }

    public String getType() {
        return type;
    }

    public Long getId() {
        return id;
    }

    public Long getCourseId() {
        return courseId;
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

    public String getMatchedText() {
        return matchedText;
    }

    public String getActionUrl() {
        return actionUrl;
    }
}
