package com.smarted.service;

import com.smarted.dto.RecommendationResponse;
import com.smarted.dto.RecommendedTopicResponse;
import com.smarted.entity.ChatHistory;
import com.smarted.entity.Score;
import com.smarted.entity.Topic;
import com.smarted.entity.User;
import com.smarted.entity.UserTopicProgress;
import com.smarted.repository.ChatHistoryRepository;
import com.smarted.repository.ScoreRepository;
import com.smarted.repository.TopicRepository;
import com.smarted.repository.UserTopicProgressRepository;
import com.smarted.repository.UserRepository;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class RecommendationService {

    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final ScoreRepository scoreRepository;
    private final UserTopicProgressRepository userTopicProgressRepository;
    private final ChatHistoryRepository chatHistoryRepository;

    public RecommendationService(
            UserRepository userRepository,
            TopicRepository topicRepository,
            ScoreRepository scoreRepository,
            UserTopicProgressRepository userTopicProgressRepository,
            ChatHistoryRepository chatHistoryRepository
    ) {
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
        this.scoreRepository = scoreRepository;
        this.userTopicProgressRepository = userTopicProgressRepository;
        this.chatHistoryRepository = chatHistoryRepository;
    }

    public String calculateLevel(int score) {
        if (score < 40) {
            return "Beginner";
        }
        if (score <= 70) {
            return "Intermediate";
        }
        return "Advanced";
    }

    public void updateStudentLevel(User user, int latestScore) {
        user.setLevel(calculateLevel(latestScore));
        userRepository.save(user);
    }

    public RecommendationResponse getRecommendations(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Map<Long, Score> latestScoreByTopicId = latestScores(user.getId());
        Set<Long> completedTopicIds = completedTopicIds(user.getId());
        List<ChatHistory> chatHistory = chatHistoryRepository.findByUserIdOrderByCreatedAtAsc(user.getId());
        List<RecommendationCandidate> candidates = new ArrayList<>();

        for (Topic topic : topicRepository.findAll()) {
            Score latestScore = latestScoreByTopicId.get(topic.getId());
            boolean completed = completedTopicIds.contains(topic.getId());
            int chatMentions = chatMentionCount(topic, chatHistory);

            RecommendationCandidate candidate = buildCandidate(topic, latestScore, completed, chatMentions);
            if (candidate != null) {
                candidates.add(candidate);
            }
        }

        List<RecommendedTopicResponse> recommendedTopics = candidates.stream()
                .sorted(Comparator
                        .comparingInt(RecommendationCandidate::priority).reversed()
                        .thenComparing(candidate -> candidate.response().getTitle()))
                .limit(8)
                .map(RecommendationCandidate::response)
                .toList();

        return new RecommendationResponse(
                user.getId(),
                user.getName(),
                user.getLevel(),
                recommendedTopics
        );
    }

    private RecommendationCandidate buildCandidate(Topic topic, Score latestScore, boolean completed, int chatMentions) {
        if (latestScore != null && latestScore.getScore() < 70) {
            return new RecommendationCandidate(
                    new RecommendedTopicResponse(
                            topic.getId(),
                            topic.getTitle(),
                            "Recommended because your " + topic.getTitle() + " score is low (" + latestScore.getScore() + "%). Revise this weak topic and retry the quiz.",
                            latestScore.getScore()
                    ),
                    100 - latestScore.getScore() + chatMentions
            );
        }

        if (!completed && latestScore == null && chatMentions > 0) {
            return new RecommendationCandidate(
                    new RecommendedTopicResponse(
                            topic.getId(),
                            topic.getTitle(),
                            "Recommended because you asked the AI Tutor about this topic and have not attempted its quiz yet.",
                            null
                    ),
                    72 + chatMentions
            );
        }

        if (!completed && latestScore == null) {
            return new RecommendationCandidate(
                    new RecommendedTopicResponse(
                            topic.getId(),
                            topic.getTitle(),
                            "Recommended because this topic is still pending and you have not attempted its quiz yet.",
                            null
                    ),
                    45
            );
        }

        if (!completed && chatMentions > 0) {
            return new RecommendationCandidate(
                    new RecommendedTopicResponse(
                            topic.getId(),
                            topic.getTitle(),
                            "Recommended because your AI Tutor questions suggest you are revising this topic.",
                            latestScore == null ? null : latestScore.getScore()
                    ),
                    35 + chatMentions
            );
        }

        return null;
    }

    private Map<Long, Score> latestScores(Long userId) {
        Map<Long, Score> latestScoreByTopicId = new HashMap<>();
        for (Score score : scoreRepository.findByUserIdOrderByAttemptedAtDesc(userId)) {
            latestScoreByTopicId.putIfAbsent(score.getTopic().getId(), score);
        }
        return latestScoreByTopicId;
    }

    private Set<Long> completedTopicIds(Long userId) {
        Set<Long> completedTopicIds = new HashSet<>();
        for (UserTopicProgress progress : userTopicProgressRepository.findByUserId(userId)) {
            if ("COMPLETED".equals(progress.getStatus())) {
                completedTopicIds.add(progress.getTopic().getId());
            }
        }
        return completedTopicIds;
    }

    private int chatMentionCount(Topic topic, List<ChatHistory> chatHistory) {
        Set<String> keywords = topicKeywords(topic);
        if (keywords.isEmpty()) {
            return 0;
        }

        int mentions = 0;
        for (ChatHistory history : chatHistory) {
            String question = normalize(history.getQuestion());
            for (String keyword : keywords) {
                if (question.contains(keyword)) {
                    mentions++;
                    break;
                }
            }
        }
        return mentions;
    }

    private Set<String> topicKeywords(Topic topic) {
        Set<String> keywords = new HashSet<>();
        for (String token : normalize(topic.getTitle()).split(" ")) {
            if (token.length() >= 3) {
                keywords.add(token);
            }
        }
        return keywords;
    }

    private String normalize(String value) {
        if (value == null) {
            return "";
        }
        return value.toLowerCase().replaceAll("[^a-z0-9]+", " ").trim();
    }

    private record RecommendationCandidate(RecommendedTopicResponse response, int priority) {
    }
}
