package com.smarted.repository;

import com.smarted.entity.QuizQuestion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {

    List<QuizQuestion> findByTopicId(Long topicId);

    void deleteByTopicId(Long topicId);

    void deleteByTopicCourseId(Long courseId);
}
