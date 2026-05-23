package com.smarted.controller;

import com.smarted.dto.SavedTopicResponse;
import com.smarted.service.SavedTopicService;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SavedTopicController {

    private final SavedTopicService savedTopicService;

    public SavedTopicController(SavedTopicService savedTopicService) {
        this.savedTopicService = savedTopicService;
    }

    @GetMapping("/saved-topics")
    public ResponseEntity<List<SavedTopicResponse>> getSavedTopics(Principal principal) {
        return ResponseEntity.ok(savedTopicService.getSavedTopics(principal.getName()));
    }

    @PostMapping("/saved-topics/{topicId}")
    public ResponseEntity<SavedTopicResponse> saveTopic(
            Principal principal,
            @PathVariable Long topicId
    ) {
        return ResponseEntity.ok(savedTopicService.saveTopic(principal.getName(), topicId));
    }

    @DeleteMapping("/saved-topics/{topicId}")
    public ResponseEntity<Void> removeSavedTopic(
            Principal principal,
            @PathVariable Long topicId
    ) {
        savedTopicService.removeSavedTopic(principal.getName(), topicId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/saved-topics/{topicId}/status")
    public ResponseEntity<Map<String, Boolean>> isTopicSaved(
            Principal principal,
            @PathVariable Long topicId
    ) {
        return ResponseEntity.ok(Map.of("saved", savedTopicService.isTopicSaved(principal.getName(), topicId)));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(RuntimeException exception) {
        return ResponseEntity.badRequest().body(exception.getMessage());
    }
}
