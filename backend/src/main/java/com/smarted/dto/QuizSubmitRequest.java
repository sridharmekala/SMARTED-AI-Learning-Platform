package com.smarted.dto;

import java.util.List;

public class QuizSubmitRequest {

    private Long topicId;
    private List<QuizAnswerRequest> answers;

    public QuizSubmitRequest() {
    }

    public QuizSubmitRequest(Long topicId, List<QuizAnswerRequest> answers) {
        this.topicId = topicId;
        this.answers = answers;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public List<QuizAnswerRequest> getAnswers() {
        return answers;
    }

    public void setAnswers(List<QuizAnswerRequest> answers) {
        this.answers = answers;
    }
}
