package com.smarted.dto;

import java.time.LocalDateTime;

public class SavedTopicResponse {

    private Long id;
    private Long topicId;
    private String title;
    private String description;
    private String content;
    private String difficulty;
    private Integer estimatedTimeMinutes;
    private Long courseId;
    private String courseName;
    private LocalDateTime savedAt;

    public SavedTopicResponse() {
    }

    public SavedTopicResponse(
            Long id,
            Long topicId,
            String title,
            String description,
            String content,
            String difficulty,
            Integer estimatedTimeMinutes,
            Long courseId,
            String courseName,
            LocalDateTime savedAt
    ) {
        this.id = id;
        this.topicId = topicId;
        this.title = title;
        this.description = description;
        this.content = content;
        this.difficulty = difficulty;
        this.estimatedTimeMinutes = estimatedTimeMinutes;
        this.courseId = courseId;
        this.courseName = courseName;
        this.savedAt = savedAt;
    }

    public Long getId() {
        return id;
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

    public Long getCourseId() {
        return courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public LocalDateTime getSavedAt() {
        return savedAt;
    }
}
