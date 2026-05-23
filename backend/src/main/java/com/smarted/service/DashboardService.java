package com.smarted.service;

import com.smarted.dto.DashboardResponse;
import com.smarted.dto.RecommendationResponse;
import com.smarted.dto.ScoreHistoryResponse;
import com.smarted.entity.Score;
import com.smarted.entity.Course;
import com.smarted.entity.User;
import com.smarted.repository.CourseRepository;
import com.smarted.repository.ScoreRepository;
import com.smarted.repository.TopicRepository;
import com.smarted.repository.UserTopicProgressRepository;
import com.smarted.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final ScoreRepository scoreRepository;
    private final TopicRepository topicRepository;
    private final CourseRepository courseRepository;
    private final UserTopicProgressRepository userTopicProgressRepository;
    private final RecommendationService recommendationService;

    public DashboardService(
            UserRepository userRepository,
            ScoreRepository scoreRepository,
            TopicRepository topicRepository,
            CourseRepository courseRepository,
            UserTopicProgressRepository userTopicProgressRepository,
            RecommendationService recommendationService
    ) {
        this.userRepository = userRepository;
        this.scoreRepository = scoreRepository;
        this.topicRepository = topicRepository;
        this.courseRepository = courseRepository;
        this.userTopicProgressRepository = userTopicProgressRepository;
        this.recommendationService = recommendationService;
    }

    public DashboardResponse getDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<ScoreHistoryResponse> scoreHistory = scoreRepository
                .findByUserIdOrderByAttemptedAtDesc(user.getId())
                .stream()
                .map(this::toScoreHistoryResponse)
                .toList();

        RecommendationResponse recommendation = recommendationService.getRecommendations(email);
        Course course = courseRepository.findByNameIgnoreCase("Java Full Stack Development")
                .orElseThrow(() -> new IllegalArgumentException("Course not found: Java Full Stack Development"));
        long totalTopics = topicRepository.countByCourseId(course.getId());
        long completedTopics = userTopicProgressRepository.countByUserIdAndStatus(user.getId(), "COMPLETED");
        long pendingTopics = Math.max(totalTopics - completedTopics, 0);
        long newTopics = Math.min(pendingTopics, 5);
        int progressPercentage = totalTopics == 0 ? 0 : (int) Math.round((completedTopics * 100.0) / totalTopics);

        return new DashboardResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getLevel(),
                totalTopics,
                completedTopics,
                pendingTopics,
                newTopics,
                progressPercentage,
                scoreHistory,
                recommendation.getRecommendedTopics()
        );
    }

    private ScoreHistoryResponse toScoreHistoryResponse(Score score) {
        return new ScoreHistoryResponse(
                score.getId(),
                score.getTopic().getId(),
                score.getTopic().getTitle(),
                score.getScore(),
                score.getLevel(),
                score.getAttemptedAt()
        );
    }
}
