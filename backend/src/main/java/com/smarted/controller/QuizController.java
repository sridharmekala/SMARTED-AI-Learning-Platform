package com.smarted.controller;

import com.smarted.dto.QuizQuestionResponse;
import com.smarted.dto.QuizResultResponse;
import com.smarted.dto.QuizSubmitRequest;
import com.smarted.service.QuizService;
import java.security.Principal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/quiz/{topicId}")
    public ResponseEntity<List<QuizQuestionResponse>> getQuizByTopicId(@PathVariable Long topicId) {
        return ResponseEntity.ok(quizService.getQuizByTopicId(topicId));
    }

    @PostMapping("/quiz/submit")
    public ResponseEntity<QuizResultResponse> submitQuiz(
            Principal principal,
            @RequestBody QuizSubmitRequest request
    ) {
        return ResponseEntity.ok(quizService.submitQuiz(principal.getName(), request));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(exception.getMessage());
    }
}
