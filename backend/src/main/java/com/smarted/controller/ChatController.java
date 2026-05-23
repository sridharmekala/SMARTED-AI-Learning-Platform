package com.smarted.controller;

import com.smarted.dto.ChatRequest;
import com.smarted.dto.ChatHistoryResponse;
import com.smarted.dto.ChatResponse;
import com.smarted.service.ChatService;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            Principal principal,
            @RequestBody ChatRequest request
    ) {
        return ResponseEntity.ok(chatService.chat(principal.getName(), request));
    }

    @GetMapping("/chat/history")
    public ResponseEntity<List<ChatHistoryResponse>> getHistory(Principal principal) {
        return ResponseEntity.ok(chatService.getHistory(principal.getName()));
    }

    @DeleteMapping("/chat/history")
    public ResponseEntity<Void> clearHistory(Principal principal) {
        chatService.clearHistory(principal.getName());
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(RuntimeException exception) {
        return ResponseEntity.badRequest().body(exception.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleChatError(RuntimeException exception) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(exception.getMessage());
    }
}
