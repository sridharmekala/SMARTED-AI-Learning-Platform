package com.smarted.dto;

public class ChatResponse {

    private String reply;
    private String level;
    private String model;

    public ChatResponse() {
    }

    public ChatResponse(String reply, String level, String model) {
        this.reply = reply;
        this.level = level;
        this.model = model;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }
}
