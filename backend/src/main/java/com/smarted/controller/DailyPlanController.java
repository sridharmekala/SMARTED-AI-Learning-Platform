package com.smarted.controller;

import com.smarted.dto.DailyPlanResponse;
import com.smarted.service.DailyPlanService;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DailyPlanController {

    private final DailyPlanService dailyPlanService;

    public DailyPlanController(DailyPlanService dailyPlanService) {
        this.dailyPlanService = dailyPlanService;
    }

    @GetMapping("/daily-plan")
    public ResponseEntity<DailyPlanResponse> getDailyPlan(Principal principal) {
        return ResponseEntity.ok(dailyPlanService.getTodayPlan(principal.getName()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(RuntimeException exception) {
        return ResponseEntity.badRequest().body(exception.getMessage());
    }
}
