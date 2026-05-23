package com.smarted.service;

import com.smarted.dto.LearningProgressResponse;
import com.smarted.dto.NotificationResponse;
import com.smarted.dto.RecommendationResponse;
import com.smarted.dto.RecommendedTopicResponse;
import com.smarted.dto.TopicProgressResponse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final LearningProgressService learningProgressService;
    private final RecommendationService recommendationService;

    public NotificationService(
            LearningProgressService learningProgressService,
            RecommendationService recommendationService
    ) {
        this.learningProgressService = learningProgressService;
        this.recommendationService = recommendationService;
    }

    public List<NotificationResponse> getNotifications(String email) {
        LearningProgressResponse progress = learningProgressService.getProgress(email);
        RecommendationResponse recommendations = recommendationService.getRecommendations(email);
        List<NotificationResponse> notifications = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        if (progress.getPendingCount() > 0) {
            notifications.add(new NotificationResponse(
                    "PENDING_TOPICS",
                    "You have pending topics",
                    "You still have " + progress.getPendingCount() + " pending topics in " + progress.getCourseName() + ".",
                    "HIGH",
                    null,
                    "View Pending",
                    "/topics/status/pending",
                    now
            ));
        }

        progress.getPendingTopics()
                .stream()
                .limit(3)
                .map(topic -> quizReminder(topic, now))
                .forEach(notifications::add);

        recommendations.getRecommendedTopics()
                .stream()
                .filter(topic -> topic.getLatestScore() != null && topic.getLatestScore() < 70)
                .limit(3)
                .map(topic -> weakTopicReminder(topic, now))
                .forEach(notifications::add);

        if (progress.getTotalTopics() > 0 && progress.getProgressPercentage() == 100) {
            notifications.add(new NotificationResponse(
                    "CERTIFICATE_READY",
                    "Certificate ready",
                    "You completed " + progress.getCourseName() + ". Download your certificate from the course page.",
                    "HIGH",
                    null,
                    "View Courses",
                    "/courses",
                    now
            ));
        }

        if (notifications.isEmpty()) {
            notifications.add(new NotificationResponse(
                    "ALL_CAUGHT_UP",
                    "You are all caught up",
                    "No urgent reminders right now. Keep revising completed topics or try a new quiz.",
                    "LOW",
                    null,
                    "Open Dashboard",
                    "/dashboard",
                    now
            ));
        }

        return notifications;
    }

    private NotificationResponse quizReminder(TopicProgressResponse topic, LocalDateTime now) {
        return new NotificationResponse(
                "QUIZ_REMINDER",
                "Complete " + topic.getTitle() + " quiz",
                "Read " + topic.getTitle() + " and attempt the quiz to measure your understanding.",
                "MEDIUM",
                topic.getTopicId(),
                "Attempt Quiz",
                "/quiz/" + topic.getTopicId(),
                now
        );
    }

    private NotificationResponse weakTopicReminder(RecommendedTopicResponse topic, LocalDateTime now) {
        return new NotificationResponse(
                "WEAK_TOPIC",
                "Revise " + topic.getTitle(),
                topic.getReason(),
                "HIGH",
                topic.getTopicId(),
                "Revise Topic",
                "/topics/" + topic.getTopicId(),
                now
        );
    }
}
