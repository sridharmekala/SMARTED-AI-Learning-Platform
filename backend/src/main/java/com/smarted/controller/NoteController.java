package com.smarted.controller;

import com.smarted.dto.NoteRequest;
import com.smarted.dto.NoteResponse;
import com.smarted.service.NoteService;
import java.security.Principal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping("/notes")
    public ResponseEntity<List<NoteResponse>> getNotes(Principal principal) {
        return ResponseEntity.ok(noteService.getNotes(principal.getName()));
    }

    @GetMapping("/notes/topics/{topicId}")
    public ResponseEntity<NoteResponse> getTopicNote(
            Principal principal,
            @PathVariable Long topicId
    ) {
        return ResponseEntity.ok(noteService.getTopicNote(principal.getName(), topicId));
    }

    @PostMapping("/notes/topics/{topicId}")
    public ResponseEntity<NoteResponse> saveTopicNote(
            Principal principal,
            @PathVariable Long topicId,
            @RequestBody NoteRequest request
    ) {
        return ResponseEntity.ok(noteService.saveTopicNote(principal.getName(), topicId, request));
    }

    @PutMapping("/notes/{noteId}")
    public ResponseEntity<NoteResponse> updateNote(
            Principal principal,
            @PathVariable Long noteId,
            @RequestBody NoteRequest request
    ) {
        return ResponseEntity.ok(noteService.updateNote(principal.getName(), noteId, request));
    }

    @DeleteMapping("/notes/topics/{topicId}")
    public ResponseEntity<Void> deleteTopicNote(
            Principal principal,
            @PathVariable Long topicId
    ) {
        noteService.deleteTopicNote(principal.getName(), topicId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/notes/{noteId}")
    public ResponseEntity<Void> deleteNote(
            Principal principal,
            @PathVariable Long noteId
    ) {
        noteService.deleteNote(principal.getName(), noteId);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(RuntimeException exception) {
        return ResponseEntity.badRequest().body(exception.getMessage());
    }
}
