package com.smarted.dto;

import java.util.List;

public class SearchResponse {

    private String query;
    private long totalResults;
    private List<SearchResultResponse> courses;
    private List<SearchResultResponse> topics;
    private List<SearchResultResponse> quizQuestions;
    private List<SearchResultResponse> learningContent;

    public SearchResponse() {
    }

    public SearchResponse(
            String query,
            List<SearchResultResponse> courses,
            List<SearchResultResponse> topics,
            List<SearchResultResponse> quizQuestions,
            List<SearchResultResponse> learningContent
    ) {
        this.query = query;
        this.courses = courses;
        this.topics = topics;
        this.quizQuestions = quizQuestions;
        this.learningContent = learningContent;
        this.totalResults = courses.size() + topics.size() + quizQuestions.size() + learningContent.size();
    }

    public String getQuery() {
        return query;
    }

    public long getTotalResults() {
        return totalResults;
    }

    public List<SearchResultResponse> getCourses() {
        return courses;
    }

    public List<SearchResultResponse> getTopics() {
        return topics;
    }

    public List<SearchResultResponse> getQuizQuestions() {
        return quizQuestions;
    }

    public List<SearchResultResponse> getLearningContent() {
        return learningContent;
    }
}
