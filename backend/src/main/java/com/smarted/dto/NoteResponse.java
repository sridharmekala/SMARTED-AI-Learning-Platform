package com.smarted.dto;

import java.time.LocalDateTime;

public class NoteResponse {

    private Long id;
    private Long topicId;
    private String topicTitle;
    private Long courseId;
    private String courseName;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public NoteResponse() {
    }

    public NoteResponse(
            Long id,
            Long topicId,
            String topicTitle,
            Long courseId,
            String courseName,
            String content,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.topicId = topicId;
        this.topicTitle = topicTitle;
        this.courseId = courseId;
        this.courseName = courseName;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getTopicId() {
        return topicId;
    }

    public String getTopicTitle() {
        return topicTitle;
    }

    public Long getCourseId() {
        return courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
