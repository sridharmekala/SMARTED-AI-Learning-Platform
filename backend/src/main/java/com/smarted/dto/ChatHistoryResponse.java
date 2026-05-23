package com.smarted.dto;

import java.time.LocalDateTime;

public class ChatHistoryResponse {

    private Long id;
    private String question;
    private String answer;
    private String level;
    private String model;
    private LocalDateTime createdAt;

    public ChatHistoryResponse() {
    }

    public ChatHistoryResponse(Long id, String question, String answer, String level, String model, LocalDateTime createdAt) {
        this.id = id;
        this.question = question;
        this.answer = answer;
        this.level = level;
        this.model = model;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getQuestion() {
        return question;
    }

    public String getAnswer() {
        return answer;
    }

    public String getLevel() {
        return level;
    }

    public String getModel() {
        return model;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
