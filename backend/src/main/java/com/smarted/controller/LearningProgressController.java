package com.smarted.controller;

import com.smarted.dto.LearningProgressResponse;
import com.smarted.dto.CourseResponse;
import com.smarted.dto.TopicProgressResponse;
import com.smarted.service.LearningProgressService;
import java.security.Principal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LearningProgressController {

    private final LearningProgressService learningProgressService;

    public LearningProgressController(LearningProgressService learningProgressService) {
        this.learningProgressService = learningProgressService;
    }

    @GetMapping("/progress")
    public ResponseEntity<LearningProgressResponse> getProgress(Principal principal) {
        return ResponseEntity.ok(learningProgressService.getProgress(principal.getName()));
    }

    @GetMapping("/course")
    public ResponseEntity<LearningProgressResponse> getCourse(Principal principal) {
        return ResponseEntity.ok(learningProgressService.getProgress(principal.getName()));
    }

    @GetMapping("/courses")
    public ResponseEntity<List<CourseResponse>> getCourses(Principal principal) {
        return ResponseEntity.ok(learningProgressService.getCourses(principal.getName()));
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<CourseResponse> getCourseById(Principal principal, @PathVariable Long courseId) {
        return ResponseEntity.ok(learningProgressService.getCourse(principal.getName(), courseId));
    }

    @GetMapping("/courses/{courseId}/topics")
    public ResponseEntity<List<TopicProgressResponse>> getCourseTopicsById(
            Principal principal,
            @PathVariable Long courseId
    ) {
        return ResponseEntity.ok(learningProgressService.getAllTopics(principal.getName(), courseId));
    }

    @GetMapping("/courses/{courseId}/progress")
    public ResponseEntity<LearningProgressResponse> getCourseProgress(
            Principal principal,
            @PathVariable Long courseId
    ) {
        return ResponseEntity.ok(learningProgressService.getCourseProgress(principal.getName(), courseId));
    }

    @GetMapping("/courses/{courseId}/topics/completed")
    public ResponseEntity<List<TopicProgressResponse>> getCourseCompletedTopics(
            Principal principal,
            @PathVariable Long courseId
    ) {
        return ResponseEntity.ok(learningProgressService.getCompletedTopics(principal.getName(), courseId));
    }

    @GetMapping("/courses/{courseId}/topics/pending")
    public ResponseEntity<List<TopicProgressResponse>> getCoursePendingTopics(
            Principal principal,
            @PathVariable Long courseId
    ) {
        return ResponseEntity.ok(learningProgressService.getPendingTopics(principal.getName(), courseId));
    }

    @GetMapping("/course/topics")
    public ResponseEntity<List<TopicProgressResponse>> getCourseTopics(Principal principal) {
        return ResponseEntity.ok(learningProgressService.getAllTopics(principal.getName()));
    }

    @GetMapping("/course/topics/completed")
    public ResponseEntity<List<TopicProgressResponse>> getCompletedTopics(Principal principal) {
        return ResponseEntity.ok(learningProgressService.getCompletedTopics(principal.getName()));
    }

    @GetMapping("/course/topics/pending")
    public ResponseEntity<List<TopicProgressResponse>> getPendingTopics(Principal principal) {
        return ResponseEntity.ok(learningProgressService.getPendingTopics(principal.getName()));
    }

    @GetMapping("/course/topics/new")
    public ResponseEntity<List<TopicProgressResponse>> getNewTopics(Principal principal) {
        return ResponseEntity.ok(learningProgressService.getNewTopics(principal.getName()));
    }

    @GetMapping("/course/topics/{topicId}")
    public ResponseEntity<TopicProgressResponse> getTopic(
            Principal principal,
            @PathVariable Long topicId
    ) {
        return ResponseEntity.ok(learningProgressService.getTopic(principal.getName(), topicId));
    }

    @PostMapping("/topics/{topicId}/complete")
    public ResponseEntity<LearningProgressResponse> markCompleted(
            Principal principal,
            @PathVariable Long topicId
    ) {
        return ResponseEntity.ok(learningProgressService.markCompleted(principal.getName(), topicId));
    }

    @PostMapping("/course/topics/{topicId}/complete")
    public ResponseEntity<LearningProgressResponse> markCourseTopicCompleted(
            Principal principal,
            @PathVariable Long topicId
    ) {
        return ResponseEntity.ok(learningProgressService.markCompleted(principal.getName(), topicId));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(exception.getMessage());
    }
}
