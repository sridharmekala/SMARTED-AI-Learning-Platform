package com.smarted.controller;

import com.smarted.dto.AdminQuizQuestionRequest;
import com.smarted.dto.AdminQuizQuestionResponse;
import com.smarted.dto.AdminPasswordResetRequest;
import com.smarted.dto.AdminStudentProgressResponse;
import com.smarted.dto.AdminStudentRequest;
import com.smarted.dto.AdminStudentResponse;
import com.smarted.dto.CourseRequest;
import com.smarted.dto.CourseResponse;
import com.smarted.dto.ScoreHistoryResponse;
import com.smarted.dto.TopicRequest;
import com.smarted.entity.Topic;
import com.smarted.service.AdminService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/courses")
    public ResponseEntity<List<CourseResponse>> getCourses() {
        return ResponseEntity.ok(adminService.getCourses());
    }

    @PostMapping("/courses")
    public ResponseEntity<CourseResponse> addCourse(@RequestBody CourseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.addCourse(request));
    }

    @PutMapping("/courses/{courseId}")
    public ResponseEntity<CourseResponse> updateCourse(@PathVariable Long courseId, @RequestBody CourseRequest request) {
        return ResponseEntity.ok(adminService.updateCourse(courseId, request));
    }

    @DeleteMapping("/courses/{courseId}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long courseId) {
        adminService.deleteCourse(courseId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/courses/{courseId}/topics")
    public ResponseEntity<List<Topic>> getCourseTopics(@PathVariable Long courseId) {
        return ResponseEntity.ok(adminService.getCourseTopics(courseId));
    }

    @PostMapping("/courses/{courseId}/topics")
    public ResponseEntity<Topic> addCourseTopic(@PathVariable Long courseId, @RequestBody TopicRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.addTopic(courseId, request));
    }

    @PostMapping("/topics")
    public ResponseEntity<Topic> addTopic(@RequestBody TopicRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.addTopic(request));
    }

    @PutMapping("/topics/{topicId}")
    public ResponseEntity<Topic> updateTopic(@PathVariable Long topicId, @RequestBody TopicRequest request) {
        return ResponseEntity.ok(adminService.updateTopic(topicId, request));
    }

    @DeleteMapping("/topics/{topicId}")
    public ResponseEntity<Void> deleteTopic(@PathVariable Long topicId) {
        adminService.deleteTopic(topicId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/quiz-questions")
    public ResponseEntity<List<AdminQuizQuestionResponse>> getQuizQuestions() {
        return ResponseEntity.ok(adminService.getQuizQuestions());
    }

    @GetMapping("/topics/{topicId}/questions")
    public ResponseEntity<List<AdminQuizQuestionResponse>> getTopicQuestions(@PathVariable Long topicId) {
        return ResponseEntity.ok(adminService.getTopicQuestions(topicId));
    }

    @PostMapping("/topics/{topicId}/questions")
    public ResponseEntity<AdminQuizQuestionResponse> addTopicQuestion(
            @PathVariable Long topicId,
            @RequestBody AdminQuizQuestionRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.addQuizQuestion(topicId, request));
    }

    @PostMapping("/quiz-questions")
    public ResponseEntity<AdminQuizQuestionResponse> addQuizQuestion(@RequestBody AdminQuizQuestionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.addQuizQuestion(request));
    }

    @PutMapping("/questions/{questionId}")
    public ResponseEntity<AdminQuizQuestionResponse> updateQuestion(
            @PathVariable Long questionId,
            @RequestBody AdminQuizQuestionRequest request
    ) {
        return ResponseEntity.ok(adminService.updateQuizQuestion(questionId, request));
    }

    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long questionId) {
        adminService.deleteQuizQuestion(questionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/students")
    public ResponseEntity<List<AdminStudentResponse>> getStudents() {
        return ResponseEntity.ok(adminService.getStudents());
    }

    @PostMapping("/students")
    public ResponseEntity<AdminStudentResponse> addStudent(@RequestBody AdminStudentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.addStudent(request));
    }

    @GetMapping("/students/{studentId}")
    public ResponseEntity<AdminStudentResponse> getStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(adminService.getStudent(studentId));
    }

    @PutMapping("/students/{studentId}")
    public ResponseEntity<AdminStudentResponse> updateStudent(
            @PathVariable Long studentId,
            @RequestBody AdminStudentRequest request
    ) {
        return ResponseEntity.ok(adminService.updateStudent(studentId, request));
    }

    @DeleteMapping("/students/{studentId}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long studentId) {
        adminService.deleteStudent(studentId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/students/{studentId}/reset-password")
    public ResponseEntity<AdminStudentResponse> resetStudentPassword(
            @PathVariable Long studentId,
            @RequestBody AdminPasswordResetRequest request
    ) {
        return ResponseEntity.ok(adminService.resetStudentPassword(studentId, request));
    }

    @GetMapping("/students/{studentId}/progress")
    public ResponseEntity<List<AdminStudentProgressResponse>> getStudentProgress(@PathVariable Long studentId) {
        return ResponseEntity.ok(adminService.getStudentProgress(studentId));
    }

    @GetMapping("/students/{studentId}/scores")
    public ResponseEntity<List<ScoreHistoryResponse>> getStudentScores(@PathVariable Long studentId) {
        return ResponseEntity.ok(adminService.getStudentScores(studentId));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(exception.getMessage());
    }
}
