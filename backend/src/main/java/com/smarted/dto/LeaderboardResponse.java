package com.smarted.dto;

import java.util.List;

public class LeaderboardResponse {

    private List<LeaderboardEntryResponse> entries;
    private long totalStudents;

    public LeaderboardResponse() {
    }

    public LeaderboardResponse(List<LeaderboardEntryResponse> entries) {
        this.entries = entries;
        this.totalStudents = entries.size();
    }

    public List<LeaderboardEntryResponse> getEntries() {
        return entries;
    }

    public long getTotalStudents() {
        return totalStudents;
    }
}
