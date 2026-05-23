package com.smarted.dto;

import java.util.List;

public class RecommendationResponse {

    private Long userId;
    private String name;
    private String level;
    private List<RecommendedTopicResponse> recommendedTopics;

    public RecommendationResponse() {
    }

    public RecommendationResponse(
            Long userId,
            String name,
            String level,
            List<RecommendedTopicResponse> recommendedTopics
    ) {
        this.userId = userId;
        this.name = name;
        this.level = level;
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

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public List<RecommendedTopicResponse> getRecommendedTopics() {
        return recommendedTopics;
    }

    public void setRecommendedTopics(List<RecommendedTopicResponse> recommendedTopics) {
        this.recommendedTopics = recommendedTopics;
    }
}
