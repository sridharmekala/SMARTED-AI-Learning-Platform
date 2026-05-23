package com.smarted.dto;

public class QuizResultResponse {

    private Long topicId;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer score;
    private String level;

    public QuizResultResponse() {
    }

    public QuizResultResponse(
            Long topicId,
            Integer totalQuestions,
            Integer correctAnswers,
            Integer score,
            String level
    ) {
        this.topicId = topicId;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.score = score;
        this.level = level;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
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
}
