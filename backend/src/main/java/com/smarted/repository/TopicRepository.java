package com.smarted.repository;

import com.smarted.entity.Topic;
import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicRepository extends JpaRepository<Topic, Long> {

    Optional<Topic> findByTitleIgnoreCase(String title);

    List<Topic> findByCourseIdOrderByIdAsc(Long courseId);

    long countByCourseId(Long courseId);

    List<Topic> findByCourseId(Long courseId);
}
