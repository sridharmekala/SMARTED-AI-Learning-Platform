package com.smarted.repository;

import com.smarted.entity.Score;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScoreRepository extends JpaRepository<Score, Long> {

    List<Score> findByUserId(Long userId);

    List<Score> findByUserIdOrderByAttemptedAtDesc(Long userId);

    List<Score> findByUserIdAndTopicId(Long userId, Long topicId);

    Optional<Score> findTopByUserIdAndTopicIdOrderByAttemptedAtDesc(Long userId, Long topicId);

    void deleteByTopicId(Long topicId);

    void deleteByTopicCourseId(Long courseId);

    void deleteByUserId(Long userId);
}
