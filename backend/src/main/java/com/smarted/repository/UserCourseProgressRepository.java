package com.smarted.repository;

import com.smarted.entity.UserCourseProgress;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCourseProgressRepository extends JpaRepository<UserCourseProgress, Long> {

    Optional<UserCourseProgress> findByUserIdAndCourseId(Long userId, Long courseId);

    void deleteByUserId(Long userId);

    void deleteByCourseId(Long courseId);
}
