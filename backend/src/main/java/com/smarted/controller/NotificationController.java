package com.smarted.controller;

import com.smarted.dto.NotificationResponse;
import com.smarted.service.NotificationService;
import java.security.Principal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> getNotifications(Principal principal) {
        return ResponseEntity.ok(notificationService.getNotifications(principal.getName()));
    }
}
