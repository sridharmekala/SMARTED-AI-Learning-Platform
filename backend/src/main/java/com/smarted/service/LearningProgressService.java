package com.smarted.service;

import com.smarted.dto.LearningProgressResponse;
import com.smarted.dto.CourseResponse;
import com.smarted.dto.TopicProgressResponse;
import com.smarted.entity.Course;
import com.smarted.entity.Topic;
import com.smarted.entity.User;
import com.smarted.entity.UserTopicProgress;
import com.smarted.repository.CourseRepository;
import com.smarted.repository.TopicRepository;
import com.smarted.repository.UserTopicProgressRepository;
import com.smarted.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class LearningProgressService {

    private static final String COURSE_NAME = "Java Full Stack Development";

    private final CourseRepository courseRepository;
    private final UserTopicProgressRepository userTopicProgressRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;

    public LearningProgressService(
            CourseRepository courseRepository,
            UserTopicProgressRepository userTopicProgressRepository,
            TopicRepository topicRepository,
            UserRepository userRepository
    ) {
        this.courseRepository = courseRepository;
        this.userTopicProgressRepository = userTopicProgressRepository;
        this.topicRepository = topicRepository;
        this.userRepository = userRepository;
    }

    public LearningProgressResponse getProgress(String email) {
        User user = getUser(email);
        Course course = getCourse();
        return getProgressForCourse(user, course);
    }

    public List<CourseResponse> getCourses(String email) {
        User user = getUser(email);
        return courseRepository.findAll()
                .stream()
                .map(course -> toCourseResponse(user, course))
                .toList();
    }

    public CourseResponse getCourse(String email, Long courseId) {
        User user = getUser(email);
        return toCourseResponse(user, getCourse(courseId));
    }

    public LearningProgressResponse getCourseProgress(String email, Long courseId) {
        return getProgressForCourse(getUser(email), getCourse(courseId));
    }

    private LearningProgressResponse getProgressForCourse(User user, Course course) {
        List<Topic> topics = topicRepository.findByCourseIdOrderByIdAsc(course.getId());
        Map<Long, UserTopicProgress> progressByTopicId = userTopicProgressRepository
                .findByUserId(user.getId())
                .stream()
                .collect(Collectors.toMap(
                        progress -> progress.getTopic().getId(),
                        progress -> progress
                ));

        List<TopicProgressResponse> completedTopics = topics.stream()
                .filter(topic -> isCompleted(progressByTopicId.get(topic.getId())))
                .map(topic -> toTopicProgress(topic, progressByTopicId.get(topic.getId())))
                .toList();

        List<TopicProgressResponse> pendingTopics = topics.stream()
                .filter(topic -> !isCompleted(progressByTopicId.get(topic.getId())))
                .map(topic -> toTopicProgress(topic, progressByTopicId.get(topic.getId())))
                .toList();

        List<TopicProgressResponse> newTopics = pendingTopics.stream()
                .sorted(Comparator.comparing((TopicProgressResponse topic) -> topic.getTopicId()).reversed())
                .limit(5)
                .toList();

        long totalTopics = topics.size();
        long completedCount = completedTopics.size();
        long pendingCount = pendingTopics.size();
        int percentage = totalTopics == 0 ? 0 : (int) Math.round((completedCount * 100.0) / totalTopics);

        return new LearningProgressResponse(
                course.getName(),
                totalTopics,
                completedCount,
                pendingCount,
                percentage,
                completedTopics,
                pendingTopics,
                newTopics
        );
    }

    public LearningProgressResponse markCompleted(String email, Long topicId) {
        User user = getUser(email);
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new IllegalArgumentException("Topic not found with id: " + topicId));

        UserTopicProgress progress = userTopicProgressRepository.findByUserIdAndTopicId(user.getId(), topic.getId())
                .orElseGet(() -> new UserTopicProgress(user, topic, "PENDING"));
        progress.setStatus("COMPLETED");
        userTopicProgressRepository.save(progress);

        return getProgress(email);
    }

    public TopicProgressResponse getTopic(String email, Long topicId) {
        User user = getUser(email);
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new IllegalArgumentException("Topic not found with id: " + topicId));
        UserTopicProgress progress = userTopicProgressRepository.findByUserIdAndTopicId(user.getId(), topic.getId())
                .orElse(null);

        return toTopicProgress(topic, progress);
    }

    public List<TopicProgressResponse> getAllTopics(String email) {
        LearningProgressResponse progress = getProgress(email);
        return concat(progress.getCompletedTopics(), progress.getPendingTopics());
    }

    public List<TopicProgressResponse> getAllTopics(String email, Long courseId) {
        LearningProgressResponse progress = getCourseProgress(email, courseId);
        return concat(progress.getCompletedTopics(), progress.getPendingTopics());
    }

    public List<TopicProgressResponse> getCompletedTopics(String email) {
        return getProgress(email).getCompletedTopics();
    }

    public List<TopicProgressResponse> getCompletedTopics(String email, Long courseId) {
        return getCourseProgress(email, courseId).getCompletedTopics();
    }

    public List<TopicProgressResponse> getPendingTopics(String email) {
        return getProgress(email).getPendingTopics();
    }

    public List<TopicProgressResponse> getPendingTopics(String email, Long courseId) {
        return getCourseProgress(email, courseId).getPendingTopics();
    }

    public List<TopicProgressResponse> getNewTopics(String email) {
        return getProgress(email).getNewTopics();
    }

    public List<TopicProgressResponse> getNewTopics(String email, Long courseId) {
        return getCourseProgress(email, courseId).getNewTopics();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Course getCourse() {
        return courseRepository.findByNameIgnoreCase(COURSE_NAME)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + COURSE_NAME));
    }

    private Course getCourse(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + courseId));
    }

    private CourseResponse toCourseResponse(User user, Course course) {
        LearningProgressResponse progress = getProgressForCourse(user, course);
        return new CourseResponse(
                course.getId(),
                course.getName(),
                course.getDescription(),
                progress.getTotalTopics(),
                progress.getCompletedCount(),
                progress.getPendingCount(),
                progress.getProgressPercentage()
        );
    }

    private boolean isCompleted(UserTopicProgress progress) {
        return progress != null && "COMPLETED".equals(progress.getStatus());
    }

    private TopicProgressResponse toTopicProgress(Topic topic, UserTopicProgress progress) {
        String status = isCompleted(progress) ? "COMPLETED" : "PENDING";
        LocalDateTime completedAt = progress == null ? null : progress.getCompletedAt();
        return new TopicProgressResponse(
                topic.getId(),
                topic.getTitle(),
                topic.getDescription(),
                topic.getContent(),
                topic.getDifficulty(),
                topic.getEstimatedTimeMinutes(),
                status,
                completedAt
        );
    }

    private List<TopicProgressResponse> concat(List<TopicProgressResponse> first, List<TopicProgressResponse> second) {
        return java.util.stream.Stream.concat(first.stream(), second.stream()).toList();
    }
}
