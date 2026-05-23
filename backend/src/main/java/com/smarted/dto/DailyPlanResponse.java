package com.smarted.dto;

import java.time.LocalDate;
import java.util.List;

public class DailyPlanResponse {

    private LocalDate date;
    private String studentName;
    private String summary;
    private List<DailyPlanTaskResponse> tasks;

    public DailyPlanResponse() {
    }

    public DailyPlanResponse(LocalDate date, String studentName, String summary, List<DailyPlanTaskResponse> tasks) {
        this.date = date;
        this.studentName = studentName;
        this.summary = summary;
        this.tasks = tasks;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getSummary() {
        return summary;
    }

    public List<DailyPlanTaskResponse> getTasks() {
        return tasks;
    }
}
