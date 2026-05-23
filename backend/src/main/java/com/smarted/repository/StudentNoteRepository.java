package com.smarted.repository;

import com.smarted.entity.StudentNote;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentNoteRepository extends JpaRepository<StudentNote, Long> {

    List<StudentNote> findByUserIdOrderByUpdatedAtDesc(Long userId);

    Optional<StudentNote> findByUserIdAndTopicId(Long userId, Long topicId);

    void deleteByUserId(Long userId);

    void deleteByUserIdAndTopicId(Long userId, Long topicId);

    void deleteByTopicId(Long topicId);

    void deleteByTopicCourseId(Long courseId);
}
