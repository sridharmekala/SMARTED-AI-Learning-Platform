package com.smarted.service;

import com.smarted.dto.NoteRequest;
import com.smarted.dto.NoteResponse;
import com.smarted.entity.Course;
import com.smarted.entity.StudentNote;
import com.smarted.entity.Topic;
import com.smarted.entity.User;
import com.smarted.repository.StudentNoteRepository;
import com.smarted.repository.TopicRepository;
import com.smarted.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class NoteService {

    private final StudentNoteRepository studentNoteRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;

    public NoteService(
            StudentNoteRepository studentNoteRepository,
            TopicRepository topicRepository,
            UserRepository userRepository
    ) {
        this.studentNoteRepository = studentNoteRepository;
        this.topicRepository = topicRepository;
        this.userRepository = userRepository;
    }

    public List<NoteResponse> getNotes(String email) {
        User user = getUser(email);
        return studentNoteRepository.findByUserIdOrderByUpdatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public NoteResponse getTopicNote(String email, Long topicId) {
        User user = getUser(email);
        getTopic(topicId);
        return studentNoteRepository.findByUserIdAndTopicId(user.getId(), topicId)
                .map(this::toResponse)
                .orElse(null);
    }

    public NoteResponse saveTopicNote(String email, Long topicId, NoteRequest request) {
        validate(request);
        User user = getUser(email);
        Topic topic = getTopic(topicId);
        StudentNote note = studentNoteRepository.findByUserIdAndTopicId(user.getId(), topic.getId())
                .orElseGet(() -> new StudentNote(user, topic, request.getContent().trim()));
        note.setContent(request.getContent().trim());

        return toResponse(studentNoteRepository.save(note));
    }

    public NoteResponse updateNote(String email, Long noteId, NoteRequest request) {
        validate(request);
        User user = getUser(email);
        StudentNote note = studentNoteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found with id: " + noteId));
        if (!note.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can update only your own notes");
        }

        note.setContent(request.getContent().trim());
        return toResponse(studentNoteRepository.save(note));
    }

    @Transactional
    public void deleteTopicNote(String email, Long topicId) {
        User user = getUser(email);
        getTopic(topicId);
        studentNoteRepository.deleteByUserIdAndTopicId(user.getId(), topicId);
    }

    public void deleteNote(String email, Long noteId) {
        User user = getUser(email);
        StudentNote note = studentNoteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found with id: " + noteId));
        if (!note.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can delete only your own notes");
        }

        studentNoteRepository.delete(note);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Topic getTopic(Long topicId) {
        return topicRepository.findById(topicId)
                .orElseThrow(() -> new IllegalArgumentException("Topic not found with id: " + topicId));
    }

    private void validate(NoteRequest request) {
        if (request == null || request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Note content is required");
        }
    }

    private NoteResponse toResponse(StudentNote note) {
        Topic topic = note.getTopic();
        Course course = topic.getCourse();
        return new NoteResponse(
                note.getId(),
                topic.getId(),
                topic.getTitle(),
                course == null ? null : course.getId(),
                course == null ? "General Course" : course.getName(),
                note.getContent(),
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }
}
