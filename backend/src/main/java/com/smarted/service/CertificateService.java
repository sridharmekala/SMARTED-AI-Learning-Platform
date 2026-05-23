package com.smarted.service;

import com.smarted.dto.CertificateResponse;
import com.smarted.dto.LearningProgressResponse;
import com.smarted.dto.TopicProgressResponse;
import com.smarted.entity.Course;
import com.smarted.entity.User;
import com.smarted.repository.CourseRepository;
import com.smarted.repository.UserRepository;
import java.time.LocalDate;
import java.util.Comparator;
import org.springframework.stereotype.Service;

@Service
public class CertificateService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LearningProgressService learningProgressService;

    public CertificateService(
            CourseRepository courseRepository,
            UserRepository userRepository,
            LearningProgressService learningProgressService
    ) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.learningProgressService = learningProgressService;
    }

    public CertificateResponse getCertificate(String email, Long courseId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + courseId));
        LearningProgressResponse progress = learningProgressService.getCourseProgress(email, courseId);

        boolean eligible = progress.getTotalTopics() > 0
                && progress.getCompletedCount() == progress.getTotalTopics();
        LocalDate completionDate = eligible
                ? progress.getCompletedTopics()
                        .stream()
                        .map(TopicProgressResponse::getCompletedAt)
                        .filter(completedAt -> completedAt != null)
                        .max(Comparator.naturalOrder())
                        .map(completedAt -> completedAt.toLocalDate())
                        .orElse(LocalDate.now())
                : null;

        String message = eligible
                ? "Congratulations! You can download your certificate."
                : "Complete all course topics to unlock your certificate.";

        return new CertificateResponse(
                eligible,
                user.getName(),
                course.getName(),
                completionDate,
                progress.getTotalTopics(),
                progress.getCompletedCount(),
                progress.getProgressPercentage(),
                message
        );
    }
}
