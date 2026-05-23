package com.smarted.repository;

import com.smarted.entity.SavedTopic;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavedTopicRepository extends JpaRepository<SavedTopic, Long> {

    List<SavedTopic> findByUserIdOrderBySavedAtDesc(Long userId);

    Optional<SavedTopic> findByUserIdAndTopicId(Long userId, Long topicId);

    boolean existsByUserIdAndTopicId(Long userId, Long topicId);

    void deleteByUserId(Long userId);

    void deleteByUserIdAndTopicId(Long userId, Long topicId);

    void deleteByTopicId(Long topicId);

    void deleteByTopicCourseId(Long courseId);
}
