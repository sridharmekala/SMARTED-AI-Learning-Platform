package com.smarted.repository;

import com.smarted.entity.UserTopicProgress;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserTopicProgressRepository extends JpaRepository<UserTopicProgress, Long> {

    List<UserTopicProgress> findByUserId(Long userId);

    Optional<UserTopicProgress> findByUserIdAndTopicId(Long userId, Long topicId);

    long countByUserIdAndStatus(Long userId, String status);

    long countByUserIdAndTopicCourseIdAndStatus(Long userId, Long courseId, String status);

    void deleteByUserId(Long userId);

    void deleteByTopicId(Long topicId);

    void deleteByTopicCourseId(Long courseId);
}
