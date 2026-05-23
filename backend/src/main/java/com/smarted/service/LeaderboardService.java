package com.smarted.service;

import com.smarted.dto.LeaderboardEntryResponse;
import com.smarted.dto.LeaderboardResponse;
import com.smarted.entity.Score;
import com.smarted.entity.User;
import com.smarted.repository.ScoreRepository;
import com.smarted.repository.UserRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class LeaderboardService {

    private final ScoreRepository scoreRepository;
    private final UserRepository userRepository;

    public LeaderboardService(ScoreRepository scoreRepository, UserRepository userRepository) {
        this.scoreRepository = scoreRepository;
        this.userRepository = userRepository;
    }

    public LeaderboardResponse getLeaderboard() {
        Map<Long, List<Score>> scoresByUserId = scoreRepository.findAll()
                .stream()
                .filter(score -> score.getUser() != null && !"ADMIN".equalsIgnoreCase(score.getUser().getRole()))
                .collect(Collectors.groupingBy(score -> score.getUser().getId()));

        List<LeaderboardEntryResponse> sortedEntries = userRepository.findAll()
                .stream()
                .filter(user -> !"ADMIN".equalsIgnoreCase(user.getRole()))
                .map(user -> toEntry(user, scoresByUserId.getOrDefault(user.getId(), List.of())))
                .filter(entry -> entry.getTotalAttempts() > 0)
                .sorted(Comparator
                        .comparingDouble(LeaderboardEntryResponse::getAverageScore).reversed()
                        .thenComparing(LeaderboardEntryResponse::getBestScore, Comparator.reverseOrder())
                        .thenComparing(LeaderboardEntryResponse::getTotalAttempts, Comparator.reverseOrder())
                        .thenComparing(LeaderboardEntryResponse::getStudentName))
                .toList();

        return new LeaderboardResponse(assignRanks(sortedEntries));
    }

    private LeaderboardEntryResponse toEntry(User user, List<Score> scores) {
        double averageScore = scores.stream()
                .mapToInt(Score::getScore)
                .average()
                .orElse(0);
        int bestScore = scores.stream()
                .mapToInt(Score::getScore)
                .max()
                .orElse(0);

        return new LeaderboardEntryResponse(
                0,
                user.getId(),
                user.getName(),
                user.getLevel(),
                round(averageScore),
                scores.size(),
                bestScore
        );
    }

    private List<LeaderboardEntryResponse> assignRanks(List<LeaderboardEntryResponse> entries) {
        return java.util.stream.IntStream.range(0, entries.size())
                .mapToObj(index -> {
                    LeaderboardEntryResponse entry = entries.get(index);
                    return new LeaderboardEntryResponse(
                            index + 1,
                            entry.getStudentId(),
                            entry.getStudentName(),
                            entry.getLevel(),
                            entry.getAverageScore(),
                            entry.getTotalAttempts(),
                            entry.getBestScore()
                    );
                })
                .toList();
    }

    private double round(double value) {
        return BigDecimal.valueOf(value).setScale(1, RoundingMode.HALF_UP).doubleValue();
    }
}
