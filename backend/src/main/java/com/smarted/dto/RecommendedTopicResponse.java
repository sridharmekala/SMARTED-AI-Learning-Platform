package com.smarted.dto;

public class RecommendedTopicResponse {

    private Long topicId;
    private String title;
    private String reason;
    private Integer latestScore;

    public RecommendedTopicResponse() {
    }

    public RecommendedTopicResponse(Long topicId, String title, String reason, Integer latestScore) {
        this.topicId = topicId;
        this.title = title;
        this.reason = reason;
        this.latestScore = latestScore;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Integer getLatestScore() {
        return latestScore;
    }

    public void setLatestScore(Integer latestScore) {
        this.latestScore = latestScore;
    }
}
