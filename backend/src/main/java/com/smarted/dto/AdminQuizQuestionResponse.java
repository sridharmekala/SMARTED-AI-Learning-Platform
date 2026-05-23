package com.smarted.dto;

public class AdminQuizQuestionResponse {

    private Long id;
    private Long topicId;
    private String topicTitle;
    private String question;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctAnswer;

    public AdminQuizQuestionResponse() {
    }

    public AdminQuizQuestionResponse(
            Long id,
            Long topicId,
            String topicTitle,
            String question,
            String optionA,
            String optionB,
            String optionC,
            String optionD,
            String correctAnswer
    ) {
        this.id = id;
        this.topicId = topicId;
        this.topicTitle = topicTitle;
        this.question = question;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.correctAnswer = correctAnswer;
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

    public String getQuestion() {
        return question;
    }

    public String getOptionA() {
        return optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public String getOptionD() {
        return optionD;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }
}
