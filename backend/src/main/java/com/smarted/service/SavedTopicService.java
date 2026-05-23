package com.smarted.service;

import com.smarted.dto.SavedTopicResponse;
import com.smarted.entity.Course;
import com.smarted.entity.SavedTopic;
import com.smarted.entity.Topic;
import com.smarted.entity.User;
import com.smarted.repository.SavedTopicRepository;
import com.smarted.repository.TopicRepository;
import com.smarted.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SavedTopicService {

    private final SavedTopicRepository savedTopicRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;

    public SavedTopicService(
            SavedTopicRepository savedTopicRepository,
            TopicRepository topicRepository,
            UserRepository userRepository
    ) {
        this.savedTopicRepository = savedTopicRepository;
        this.topicRepository = topicRepository;
        this.userRepository = userRepository;
    }

    public List<SavedTopicResponse> getSavedTopics(String email) {
        User user = getUser(email);
        return savedTopicRepository.findByUserIdOrderBySavedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public SavedTopicResponse saveTopic(String email, Long topicId) {
        User user = getUser(email);
        Topic topic = getTopic(topicId);
        SavedTopic savedTopic = savedTopicRepository.findByUserIdAndTopicId(user.getId(), topic.getId())
                .orElseGet(() -> savedTopicRepository.save(new SavedTopic(user, topic)));

        return toResponse(savedTopic);
    }

    @Transactional
    public void removeSavedTopic(String email, Long topicId) {
        User user = getUser(email);
        getTopic(topicId);
        savedTopicRepository.deleteByUserIdAndTopicId(user.getId(), topicId);
    }

    public boolean isTopicSaved(String email, Long topicId) {
        User user = getUser(email);
        return savedTopicRepository.existsByUserIdAndTopicId(user.getId(), topicId);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Topic getTopic(Long topicId) {
        return topicRepository.findById(topicId)
                .orElseThrow(() -> new IllegalArgumentException("Topic not found with id: " + topicId));
    }

    private SavedTopicResponse toResponse(SavedTopic savedTopic) {
        Topic topic = savedTopic.getTopic();
        Course course = topic.getCourse();
        return new SavedTopicResponse(
                savedTopic.getId(),
                topic.getId(),
                topic.getTitle(),
                topic.getDescription(),
                topic.getContent(),
                topic.getDifficulty(),
                topic.getEstimatedTimeMinutes(),
                course == null ? null : course.getId(),
                course == null ? "General Course" : course.getName(),
                savedTopic.getSavedAt()
        );
    }
}
