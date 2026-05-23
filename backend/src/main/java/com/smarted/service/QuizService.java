package com.smarted.service;

import com.smarted.dto.QuizAnswerRequest;
import com.smarted.dto.QuizQuestionResponse;
import com.smarted.dto.QuizResultResponse;
import com.smarted.dto.QuizSubmitRequest;
import com.smarted.entity.QuizQuestion;
import com.smarted.entity.Score;
import com.smarted.entity.Topic;
import com.smarted.entity.User;
import com.smarted.repository.QuizQuestionRepository;
import com.smarted.repository.ScoreRepository;
import com.smarted.repository.TopicRepository;
import com.smarted.repository.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class QuizService {

    private final QuizQuestionRepository quizQuestionRepository;
    private final ScoreRepository scoreRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;
    private final RecommendationService recommendationService;

    public QuizService(
            QuizQuestionRepository quizQuestionRepository,
            ScoreRepository scoreRepository,
            TopicRepository topicRepository,
            UserRepository userRepository,
            RecommendationService recommendationService
    ) {
        this.quizQuestionRepository = quizQuestionRepository;
        this.scoreRepository = scoreRepository;
        this.topicRepository = topicRepository;
        this.userRepository = userRepository;
        this.recommendationService = recommendationService;
    }

    public List<QuizQuestionResponse> getQuizByTopicId(Long topicId) {
        if (!topicRepository.existsById(topicId)) {
            throw new IllegalArgumentException("Topic not found with id: " + topicId);
        }

        return quizQuestionRepository.findByTopicId(topicId)
                .stream()
                .map(this::toQuestionResponse)
                .toList();
    }

    public QuizResultResponse submitQuiz(String email, QuizSubmitRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new IllegalArgumentException("Topic not found with id: " + request.getTopicId()));
        List<QuizQuestion> questions = quizQuestionRepository.findByTopicId(request.getTopicId());

        if (questions.isEmpty()) {
            throw new IllegalArgumentException("No quiz questions found for topic id: " + request.getTopicId());
        }

        if (request.getAnswers() == null || request.getAnswers().isEmpty()) {
            throw new IllegalArgumentException("Quiz answers are required");
        }

        Map<Long, String> submittedAnswers = request.getAnswers()
                .stream()
                .collect(Collectors.toMap(
                        QuizAnswerRequest::getQuestionId,
                        answer -> normalizeAnswer(answer.getSelectedAnswer()),
                        (first, second) -> second
                ));

        int correctAnswers = 0;
        for (QuizQuestion question : questions) {
            String selectedAnswer = submittedAnswers.get(question.getId());
            if (question.getCorrectAnswer().equalsIgnoreCase(selectedAnswer)) {
                correctAnswers++;
            }
        }

        int scoreValue = (int) Math.round((correctAnswers * 100.0) / questions.size());
        String level = recommendationService.calculateLevel(scoreValue);

        scoreRepository.save(new Score(user, topic, scoreValue, level));
        recommendationService.updateStudentLevel(user, scoreValue);

        return new QuizResultResponse(
                topic.getId(),
                questions.size(),
                correctAnswers,
                scoreValue,
                level
        );
    }

    private QuizQuestionResponse toQuestionResponse(QuizQuestion question) {
        return new QuizQuestionResponse(
                question.getId(),
                question.getTopic().getId(),
                question.getQuestion(),
                question.getOptionA(),
                question.getOptionB(),
                question.getOptionC(),
                question.getOptionD()
        );
    }

    private String normalizeAnswer(String selectedAnswer) {
        if (selectedAnswer == null) {
            return "";
        }
        return selectedAnswer.trim().toUpperCase();
    }
}
