package com.smarted.service;

import com.smarted.dto.AdminQuizQuestionRequest;
import com.smarted.dto.AdminQuizQuestionResponse;
import com.smarted.dto.AdminPasswordResetRequest;
import com.smarted.dto.AdminStudentProgressResponse;
import com.smarted.dto.AdminStudentRequest;
import com.smarted.dto.AdminStudentResponse;
import com.smarted.dto.CourseRequest;
import com.smarted.dto.CourseResponse;
import com.smarted.dto.ScoreHistoryResponse;
import com.smarted.dto.TopicRequest;
import com.smarted.entity.Course;
import com.smarted.entity.QuizQuestion;
import com.smarted.entity.Score;
import com.smarted.entity.Topic;
import com.smarted.entity.User;
import com.smarted.repository.ChatHistoryRepository;
import com.smarted.repository.CourseRepository;
import com.smarted.repository.QuizQuestionRepository;
import com.smarted.repository.ScoreRepository;
import com.smarted.repository.SavedTopicRepository;
import com.smarted.repository.StudentNoteRepository;
import com.smarted.repository.CompletedTopicRepository;
import com.smarted.repository.TopicRepository;
import com.smarted.repository.UserCourseProgressRepository;
import com.smarted.repository.UserTopicProgressRepository;
import com.smarted.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final TopicRepository topicRepository;
    private final CourseRepository courseRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final ScoreRepository scoreRepository;
    private final SavedTopicRepository savedTopicRepository;
    private final StudentNoteRepository studentNoteRepository;
    private final CompletedTopicRepository completedTopicRepository;
    private final UserCourseProgressRepository userCourseProgressRepository;
    private final UserTopicProgressRepository userTopicProgressRepository;
    private final ChatHistoryRepository chatHistoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(
            TopicRepository topicRepository,
            CourseRepository courseRepository,
            QuizQuestionRepository quizQuestionRepository,
            ScoreRepository scoreRepository,
            SavedTopicRepository savedTopicRepository,
            StudentNoteRepository studentNoteRepository,
            CompletedTopicRepository completedTopicRepository,
            UserCourseProgressRepository userCourseProgressRepository,
            UserTopicProgressRepository userTopicProgressRepository,
            ChatHistoryRepository chatHistoryRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.topicRepository = topicRepository;
        this.courseRepository = courseRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.scoreRepository = scoreRepository;
        this.savedTopicRepository = savedTopicRepository;
        this.studentNoteRepository = studentNoteRepository;
        this.completedTopicRepository = completedTopicRepository;
        this.userCourseProgressRepository = userCourseProgressRepository;
        this.userTopicProgressRepository = userTopicProgressRepository;
        this.chatHistoryRepository = chatHistoryRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Topic addTopic(TopicRequest request) {
        Course course = getDefaultCourse();
        return addTopic(course.getId(), request);
    }

    public List<CourseResponse> getCourses() {
        return courseRepository.findAll()
                .stream()
                .map(this::toCourseResponse)
                .toList();
    }

    public CourseResponse addCourse(CourseRequest request) {
        validateCourse(request);
        Course course = courseRepository.save(new Course(request.getName().trim(), request.getDescription().trim()));
        return toCourseResponse(course);
    }

    public CourseResponse updateCourse(Long courseId, CourseRequest request) {
        validateCourse(request);
        Course course = getCourse(courseId);
        course.setName(request.getName().trim());
        course.setDescription(request.getDescription().trim());
        return toCourseResponse(courseRepository.save(course));
    }

    @Transactional
    public void deleteCourse(Long courseId) {
        Course course = getCourse(courseId);
        scoreRepository.deleteByTopicCourseId(course.getId());
        savedTopicRepository.deleteByTopicCourseId(course.getId());
        studentNoteRepository.deleteByTopicCourseId(course.getId());
        quizQuestionRepository.deleteByTopicCourseId(course.getId());
        completedTopicRepository.deleteByTopicCourseId(course.getId());
        userTopicProgressRepository.deleteByTopicCourseId(course.getId());
        topicRepository.findByCourseId(course.getId()).forEach(topicRepository::delete);
        courseRepository.delete(course);
    }

    public List<Topic> getCourseTopics(Long courseId) {
        getCourse(courseId);
        return topicRepository.findByCourseIdOrderByIdAsc(courseId);
    }

    public Topic addTopic(Long courseId, TopicRequest request) {
        validateTopic(request);
        Course course = getCourse(courseId);
        Topic topic = new Topic(
                request.getTitle().trim(),
                request.getDescription().trim(),
                request.getContent().trim(),
                course,
                defaultDifficulty(request),
                defaultEstimatedTime(request)
        );
        return topicRepository.save(topic);
    }

    public Topic updateTopic(Long topicId, TopicRequest request) {
        validateTopic(request);
        Topic topic = getTopic(topicId);
        topic.setTitle(request.getTitle().trim());
        topic.setDescription(request.getDescription().trim());
        topic.setContent(request.getContent().trim());
        topic.setCourse(topic.getCourse() == null ? getDefaultCourse() : topic.getCourse());
        topic.setDifficulty(defaultDifficulty(request));
        topic.setEstimatedTimeMinutes(defaultEstimatedTime(request));
        return topicRepository.save(topic);
    }

    @Transactional
    public void deleteTopic(Long topicId) {
        Topic topic = getTopic(topicId);
        quizQuestionRepository.deleteByTopicId(topic.getId());
        scoreRepository.deleteByTopicId(topic.getId());
        savedTopicRepository.deleteByTopicId(topic.getId());
        studentNoteRepository.deleteByTopicId(topic.getId());
        completedTopicRepository.deleteByTopicId(topic.getId());
        userTopicProgressRepository.deleteByTopicId(topic.getId());
        topicRepository.delete(topic);
    }

    public List<AdminQuizQuestionResponse> getQuizQuestions() {
        return quizQuestionRepository.findAll()
                .stream()
                .map(this::toQuestionResponse)
                .toList();
    }

    public List<AdminQuizQuestionResponse> getTopicQuestions(Long topicId) {
        getTopic(topicId);
        return quizQuestionRepository.findByTopicId(topicId)
                .stream()
                .map(this::toQuestionResponse)
                .toList();
    }

    public AdminQuizQuestionResponse addQuizQuestion(AdminQuizQuestionRequest request) {
        validateQuestion(request);
        Topic topic = getTopic(request.getTopicId());
        QuizQuestion question = quizQuestionRepository.save(new QuizQuestion(
                topic,
                request.getQuestion().trim(),
                request.getOptionA().trim(),
                request.getOptionB().trim(),
                request.getOptionC().trim(),
                request.getOptionD().trim(),
                request.getCorrectAnswer().trim().toUpperCase()
        ));

        return toQuestionResponse(question);
    }

    public AdminQuizQuestionResponse addQuizQuestion(Long topicId, AdminQuizQuestionRequest request) {
        request.setTopicId(topicId);
        return addQuizQuestion(request);
    }

    public AdminQuizQuestionResponse updateQuizQuestion(Long questionId, AdminQuizQuestionRequest request) {
        validateQuestion(request);
        QuizQuestion question = quizQuestionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + questionId));
        Topic topic = getTopic(request.getTopicId());

        question.setTopic(topic);
        question.setQuestion(request.getQuestion().trim());
        question.setOptionA(request.getOptionA().trim());
        question.setOptionB(request.getOptionB().trim());
        question.setOptionC(request.getOptionC().trim());
        question.setOptionD(request.getOptionD().trim());
        question.setCorrectAnswer(request.getCorrectAnswer().trim().toUpperCase());
        return toQuestionResponse(quizQuestionRepository.save(question));
    }

    public void deleteQuizQuestion(Long questionId) {
        if (!quizQuestionRepository.existsById(questionId)) {
            throw new IllegalArgumentException("Question not found with id: " + questionId);
        }
        quizQuestionRepository.deleteById(questionId);
    }

    public List<AdminStudentResponse> getStudents() {
        return userRepository.findAll()
                .stream()
                .filter(user -> !"ADMIN".equalsIgnoreCase(user.getRole()))
                .map(this::toStudentResponse)
                .toList();
    }

    public AdminStudentResponse addStudent(AdminStudentRequest request) {
        validateStudent(request, true);
        if (userRepository.existsByEmail(request.getEmail().trim())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User student = new User(
                request.getName().trim(),
                request.getEmail().trim(),
                passwordEncoder.encode(request.getPassword().trim()),
                "STUDENT"
        );
        student.setLevel(defaultLevel(request.getLevel()));
        return toStudentResponse(userRepository.save(student));
    }

    public AdminStudentResponse getStudent(Long studentId) {
        return toStudentResponse(getStudentUser(studentId));
    }

    public AdminStudentResponse updateStudent(Long studentId, AdminStudentRequest request) {
        validateStudent(request, false);
        User student = getStudentUser(studentId);
        String email = request.getEmail().trim();
        userRepository.findByEmail(email)
                .filter(existing -> !existing.getId().equals(student.getId()))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Email is already registered");
                });

        student.setName(request.getName().trim());
        student.setEmail(email);
        student.setLevel(defaultLevel(request.getLevel()));
        return toStudentResponse(userRepository.save(student));
    }

    @Transactional
    public void deleteStudent(Long studentId) {
        User student = getStudentUser(studentId);
        scoreRepository.deleteByUserId(student.getId());
        savedTopicRepository.deleteByUserId(student.getId());
        studentNoteRepository.deleteByUserId(student.getId());
        completedTopicRepository.deleteByUserId(student.getId());
        userTopicProgressRepository.deleteByUserId(student.getId());
        userCourseProgressRepository.deleteByUserId(student.getId());
        chatHistoryRepository.deleteByUserId(student.getId());
        userRepository.delete(student);
    }

    public AdminStudentResponse resetStudentPassword(Long studentId, AdminPasswordResetRequest request) {
        if (request == null || isBlank(request.getNewPassword())) {
            throw new IllegalArgumentException("New password is required");
        }
        User student = getStudentUser(studentId);
        student.setPassword(passwordEncoder.encode(request.getNewPassword().trim()));
        return toStudentResponse(userRepository.save(student));
    }

    public List<AdminStudentProgressResponse> getStudentProgress(Long studentId) {
        User student = getStudentUser(studentId);
        return courseRepository.findAll()
                .stream()
                .map(course -> {
                    long totalTopics = topicRepository.countByCourseId(course.getId());
                    long completed = userTopicProgressRepository.countByUserIdAndTopicCourseIdAndStatus(student.getId(), course.getId(), "COMPLETED");
                    long pending = Math.max(totalTopics - completed, 0);
                    int percentage = totalTopics == 0 ? 0 : (int) Math.round((completed * 100.0) / totalTopics);
                    return new AdminStudentProgressResponse(course.getId(), course.getName(), totalTopics, completed, pending, percentage);
                })
                .toList();
    }

    public List<ScoreHistoryResponse> getStudentScores(Long studentId) {
        User student = getStudentUser(studentId);
        return scoreRepository.findByUserIdOrderByAttemptedAtDesc(student.getId())
                .stream()
                .map(this::toScoreHistoryResponse)
                .toList();
    }

    private Topic getTopic(Long topicId) {
        return topicRepository.findById(topicId)
                .orElseThrow(() -> new IllegalArgumentException("Topic not found with id: " + topicId));
    }

    private Course getDefaultCourse() {
        return courseRepository.findByNameIgnoreCase("Java Full Stack Development")
                .orElseThrow(() -> new IllegalArgumentException("Course not found: Java Full Stack Development"));
    }

    private Course getCourse(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + courseId));
    }

    private User getStudentUser(Long studentId) {
        User user = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + studentId));
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("Admin users cannot be managed as students");
        }
        return user;
    }

    private void validateCourse(CourseRequest request) {
        if (isBlank(request.getName()) || isBlank(request.getDescription())) {
            throw new IllegalArgumentException("Course name and description are required");
        }
    }

    private String defaultDifficulty(TopicRequest request) {
        return isBlank(request.getDifficulty()) ? "Beginner" : request.getDifficulty().trim();
    }

    private Integer defaultEstimatedTime(TopicRequest request) {
        return request.getEstimatedTimeMinutes() == null || request.getEstimatedTimeMinutes() <= 0
                ? 45
                : request.getEstimatedTimeMinutes();
    }

    private void validateTopic(TopicRequest request) {
        if (isBlank(request.getTitle()) || isBlank(request.getDescription()) || isBlank(request.getContent())) {
            throw new IllegalArgumentException("Title, description, and content are required");
        }
    }

    private void validateQuestion(AdminQuizQuestionRequest request) {
        if (request.getTopicId() == null
                || isBlank(request.getQuestion())
                || isBlank(request.getOptionA())
                || isBlank(request.getOptionB())
                || isBlank(request.getOptionC())
                || isBlank(request.getOptionD())
                || isBlank(request.getCorrectAnswer())) {
            throw new IllegalArgumentException("All quiz question fields are required");
        }

        String answer = request.getCorrectAnswer().trim().toUpperCase();
        if (!List.of("A", "B", "C", "D").contains(answer)) {
            throw new IllegalArgumentException("Correct answer must be A, B, C, or D");
        }
    }

    private void validateStudent(AdminStudentRequest request, boolean passwordRequired) {
        if (request == null || isBlank(request.getName()) || isBlank(request.getEmail())) {
            throw new IllegalArgumentException("Student name and email are required");
        }
        if (passwordRequired && isBlank(request.getPassword())) {
            throw new IllegalArgumentException("Student password is required");
        }
    }

    private String defaultLevel(String level) {
        return isBlank(level) ? "Beginner" : level.trim();
    }

    private AdminQuizQuestionResponse toQuestionResponse(QuizQuestion question) {
        return new AdminQuizQuestionResponse(
                question.getId(),
                question.getTopic().getId(),
                question.getTopic().getTitle(),
                question.getQuestion(),
                question.getOptionA(),
                question.getOptionB(),
                question.getOptionC(),
                question.getOptionD(),
                question.getCorrectAnswer()
        );
    }

    private AdminStudentResponse toStudentResponse(User user) {
        return new AdminStudentResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getLevel(),
                user.getRole(),
                user.getCreatedAt()
        );
    }

    private ScoreHistoryResponse toScoreHistoryResponse(Score score) {
        return new ScoreHistoryResponse(
                score.getId(),
                score.getTopic().getId(),
                score.getTopic().getTitle(),
                score.getScore(),
                score.getLevel(),
                score.getAttemptedAt()
        );
    }

    private CourseResponse toCourseResponse(Course course) {
        long totalTopics = topicRepository.countByCourseId(course.getId());
        return new CourseResponse(course.getId(), course.getName(), course.getDescription(), totalTopics, 0, totalTopics, 0);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
