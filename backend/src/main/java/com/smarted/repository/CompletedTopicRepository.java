package com.smarted.repository;

import com.smarted.entity.CompletedTopic;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompletedTopicRepository extends JpaRepository<CompletedTopic, Long> {

    List<CompletedTopic> findByUserIdOrderByCompletedAtDesc(Long userId);

    Optional<CompletedTopic> findByUserIdAndTopicId(Long userId, Long topicId);

    long countByUserId(Long userId);

    void deleteByUserId(Long userId);

    void deleteByTopicId(Long topicId);

    void deleteByTopicCourseId(Long courseId);
}
