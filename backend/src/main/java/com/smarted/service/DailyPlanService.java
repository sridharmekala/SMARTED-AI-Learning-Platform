package com.smarted.service;

import com.smarted.dto.DailyPlanResponse;
import com.smarted.dto.DailyPlanTaskResponse;
import com.smarted.dto.RecommendationResponse;
import com.smarted.dto.RecommendedTopicResponse;
import com.smarted.entity.Topic;
import com.smarted.entity.User;
import com.smarted.entity.UserTopicProgress;
import com.smarted.repository.TopicRepository;
import com.smarted.repository.UserRepository;
import com.smarted.repository.UserTopicProgressRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class DailyPlanService {

    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final UserTopicProgressRepository userTopicProgressRepository;
    private final RecommendationService recommendationService;

    public DailyPlanService(
            UserRepository userRepository,
            TopicRepository topicRepository,
            UserTopicProgressRepository userTopicProgressRepository,
            RecommendationService recommendationService
    ) {
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
        this.userTopicProgressRepository = userTopicProgressRepository;
        this.recommendationService = recommendationService;
    }

    public DailyPlanResponse getTodayPlan(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Topic> pendingTopics = pendingTopics(user.getId());
        RecommendationResponse recommendations = recommendationService.getRecommendations(email);
        List<DailyPlanTaskResponse> tasks = new ArrayList<>();

        Topic readTopic = pendingTopics.stream().findFirst().orElse(null);
        if (readTopic != null) {
            tasks.add(task(
                    "READ",
                    "Read one topic",
                    "Study " + readTopic.getTitle() + " and write down the key points before taking the quiz.",
                    readTopic,
                    "Read Topic",
                    "/topics/" + readTopic.getId()
            ));
        }

        Topic quizTopic = pendingTopics.stream()
                .filter(topic -> readTopic == null || !topic.getId().equals(readTopic.getId()))
                .findFirst()
                .orElse(readTopic);
        if (quizTopic != null) {
            tasks.add(task(
                    "QUIZ",
                    "Attempt one quiz",
                    "Attempt the quiz for " + quizTopic.getTitle() + " to check your current understanding.",
                    quizTopic,
                    "Attempt Quiz",
                    "/quiz/" + quizTopic.getId()
            ));
        }

        Optional<RecommendedTopicResponse> weakRecommendation = recommendations.getRecommendedTopics()
                .stream()
                .filter(topic -> topic.getLatestScore() != null && topic.getLatestScore() < 70)
                .findFirst();
        RecommendedTopicResponse reviseTopic = weakRecommendation
                .or(() -> recommendations.getRecommendedTopics().stream().findFirst())
                .orElse(null);
        if (reviseTopic != null) {
            tasks.add(new DailyPlanTaskResponse(
                    "REVISE",
                    "Revise weak subject",
                    reviseTopic.getReason(),
                    reviseTopic.getTopicId(),
                    reviseTopic.getTitle(),
                    "Revise Topic",
                    "/topics/" + reviseTopic.getTopicId()
            ));
        }

        if (tasks.isEmpty()) {
            tasks.add(new DailyPlanTaskResponse(
                    "REVISE",
                    "Revise completed topics",
                    "You have no pending topics right now. Review completed topics and keep your concepts fresh.",
                    null,
                    "Completed Topics",
                    "Review Completed",
                    "/topics/status/completed"
            ));
        }

        return new DailyPlanResponse(
                LocalDate.now(),
                user.getName(),
                "Today focus on reading, quiz practice, and revision.",
                tasks.stream().limit(3).toList()
        );
    }

    private List<Topic> pendingTopics(Long userId) {
        Map<Long, UserTopicProgress> progressByTopicId = userTopicProgressRepository.findByUserId(userId)
                .stream()
                .collect(Collectors.toMap(progress -> progress.getTopic().getId(), progress -> progress));

        return topicRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Topic::getId))
                .filter(topic -> {
                    UserTopicProgress progress = progressByTopicId.get(topic.getId());
                    return progress == null || !"COMPLETED".equals(progress.getStatus());
                })
                .toList();
    }

    private DailyPlanTaskResponse task(
            String type,
            String title,
            String description,
            Topic topic,
            String actionLabel,
            String actionUrl
    ) {
        return new DailyPlanTaskResponse(
                type,
                title,
                description,
                topic.getId(),
                topic.getTitle(),
                actionLabel,
                actionUrl
        );
    }
}
