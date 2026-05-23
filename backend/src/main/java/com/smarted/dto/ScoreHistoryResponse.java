package com.smarted.dto;

import java.time.LocalDateTime;

public class ScoreHistoryResponse {

    private Long scoreId;
    private Long topicId;
    private String topicTitle;
    private Integer score;
    private String level;
    private LocalDateTime attemptedAt;

    public ScoreHistoryResponse() {
    }

    public ScoreHistoryResponse(
            Long scoreId,
            Long topicId,
            String topicTitle,
            Integer score,
            String level,
            LocalDateTime attemptedAt
    ) {
        this.scoreId = scoreId;
        this.topicId = topicId;
        this.topicTitle = topicTitle;
        this.score = score;
        this.level = level;
        this.attemptedAt = attemptedAt;
    }

    public Long getScoreId() {
        return scoreId;
    }

    public void setScoreId(Long scoreId) {
        this.scoreId = scoreId;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public String getTopicTitle() {
        return topicTitle;
    }

    public void setTopicTitle(String topicTitle) {
        this.topicTitle = topicTitle;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public LocalDateTime getAttemptedAt() {
        return attemptedAt;
    }

    public void setAttemptedAt(LocalDateTime attemptedAt) {
        this.attemptedAt = attemptedAt;
    }
}
