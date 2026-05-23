package com.smarted.service;

import com.smarted.dto.SearchResponse;
import com.smarted.dto.SearchResultResponse;
import com.smarted.entity.Course;
import com.smarted.entity.QuizQuestion;
import com.smarted.entity.Topic;
import com.smarted.repository.CourseRepository;
import com.smarted.repository.QuizQuestionRepository;
import com.smarted.repository.TopicRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SearchService {

    private final CourseRepository courseRepository;
    private final TopicRepository topicRepository;
    private final QuizQuestionRepository quizQuestionRepository;

    public SearchService(
            CourseRepository courseRepository,
            TopicRepository topicRepository,
            QuizQuestionRepository quizQuestionRepository
    ) {
        this.courseRepository = courseRepository;
        this.topicRepository = topicRepository;
        this.quizQuestionRepository = quizQuestionRepository;
    }

    public SearchResponse search(String query) {
        String normalizedQuery = normalize(query);
        if (normalizedQuery.length() < 2) {
            return new SearchResponse(query == null ? "" : query.trim(), List.of(), List.of(), List.of(), List.of());
        }

        List<SearchResultResponse> courses = courseRepository.findAll()
                .stream()
                .filter(course -> matches(normalizedQuery, course.getName(), course.getDescription()))
                .map(this::courseResult)
                .limit(8)
                .toList();

        List<SearchResultResponse> topics = topicRepository.findAll()
                .stream()
                .filter(topic -> matches(normalizedQuery, topic.getTitle(), topic.getDescription(), topic.getDifficulty()))
                .map(this::topicResult)
                .limit(12)
                .toList();

        List<SearchResultResponse> quizQuestions = quizQuestionRepository.findAll()
                .stream()
                .filter(question -> matches(
                        normalizedQuery,
                        question.getQuestion(),
                        question.getOptionA(),
                        question.getOptionB(),
                        question.getOptionC(),
                        question.getOptionD(),
                        question.getTopic().getTitle()
                ))
                .map(this::questionResult)
                .limit(12)
                .toList();

        List<SearchResultResponse> learningContent = topicRepository.findAll()
                .stream()
                .filter(topic -> matches(normalizedQuery, topic.getContent()))
                .map(topic -> contentResult(topic, query))
                .limit(12)
                .toList();

        return new SearchResponse(query.trim(), courses, topics, quizQuestions, learningContent);
    }

    private SearchResultResponse courseResult(Course course) {
        return new SearchResultResponse(
                "COURSE",
                course.getId(),
                course.getId(),
                null,
                course.getName(),
                course.getDescription(),
                course.getDescription(),
                "/courses/" + course.getId()
        );
    }

    private SearchResultResponse topicResult(Topic topic) {
        Course course = topic.getCourse();
        return new SearchResultResponse(
                "TOPIC",
                topic.getId(),
                course == null ? null : course.getId(),
                topic.getId(),
                topic.getTitle(),
                topic.getDescription(),
                topic.getDescription(),
                "/topics/" + topic.getId()
        );
    }

    private SearchResultResponse questionResult(QuizQuestion question) {
        Topic topic = question.getTopic();
        Course course = topic.getCourse();
        return new SearchResultResponse(
                "QUIZ",
                question.getId(),
                course == null ? null : course.getId(),
                topic.getId(),
                topic.getTitle() + " Quiz Question",
                "Quiz question from " + topic.getTitle(),
                question.getQuestion(),
                "/quiz/" + topic.getId()
        );
    }

    private SearchResultResponse contentResult(Topic topic, String query) {
        Course course = topic.getCourse();
        return new SearchResultResponse(
                "CONTENT",
                topic.getId(),
                course == null ? null : course.getId(),
                topic.getId(),
                topic.getTitle() + " Learning Content",
                topic.getDescription(),
                excerpt(topic.getContent(), query),
                "/topics/" + topic.getId()
        );
    }

    private boolean matches(String normalizedQuery, String... values) {
        for (String value : values) {
            if (normalize(value).contains(normalizedQuery)) {
                return true;
            }
        }
        return false;
    }

    private String normalize(String value) {
        if (value == null) {
            return "";
        }
        return value.toLowerCase().replaceAll("[^a-z0-9]+", " ").trim();
    }

    private String excerpt(String value, String query) {
        if (value == null || value.isBlank()) {
            return "";
        }

        String lowerValue = value.toLowerCase();
        String lowerQuery = query == null ? "" : query.toLowerCase().trim();
        int index = lowerQuery.isBlank() ? -1 : lowerValue.indexOf(lowerQuery);
        int start = index < 0 ? 0 : Math.max(index - 70, 0);
        int end = Math.min(start + 180, value.length());
        String prefix = start > 0 ? "... " : "";
        String suffix = end < value.length() ? " ..." : "";
        return prefix + value.substring(start, end).trim() + suffix;
    }
}
