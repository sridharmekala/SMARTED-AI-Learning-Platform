package com.smarted.dto;

public class LeaderboardEntryResponse {

    private int rank;
    private Long studentId;
    private String studentName;
    private String level;
    private double averageScore;
    private long totalAttempts;
    private int bestScore;

    public LeaderboardEntryResponse() {
    }

    public LeaderboardEntryResponse(
            int rank,
            Long studentId,
            String studentName,
            String level,
            double averageScore,
            long totalAttempts,
            int bestScore
    ) {
        this.rank = rank;
        this.studentId = studentId;
        this.studentName = studentName;
        this.level = level;
        this.averageScore = averageScore;
        this.totalAttempts = totalAttempts;
        this.bestScore = bestScore;
    }

    public int getRank() {
        return rank;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getLevel() {
        return level;
    }

    public double getAverageScore() {
        return averageScore;
    }

    public long getTotalAttempts() {
        return totalAttempts;
    }

    public int getBestScore() {
        return bestScore;
    }
}
