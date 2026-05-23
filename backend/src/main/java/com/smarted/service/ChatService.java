package com.smarted.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.smarted.dto.ChatRequest;
import com.smarted.dto.ChatHistoryResponse;
import com.smarted.dto.ChatResponse;
import com.smarted.entity.ChatHistory;
import com.smarted.entity.User;
import com.smarted.repository.ChatHistoryRepository;
import com.smarted.repository.UserRepository;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

@Service
public class ChatService {

    private static final String TUTOR_SYSTEM_PROMPT =
            "You are a helpful AI tutor helping students understand programming concepts in a simple and clear way.";

    private final UserRepository userRepository;
    private final ChatHistoryRepository chatHistoryRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${nvidia.api-key}")
    private String nvidiaApiKey;

    @Value("${nvidia.model}")
    private String nvidiaModel;

    @Value("${nvidia.base-url}")
    private String nvidiaBaseUrl;

    public ChatService(
            UserRepository userRepository,
            ChatHistoryRepository chatHistoryRepository,
            ObjectMapper objectMapper
    ) {
        this.userRepository = userRepository;
        this.chatHistoryRepository = chatHistoryRepository;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newHttpClient();
    }

    public ChatResponse chat(String email, ChatRequest request) {
        if (request.getMessage() == null || request.getMessage().isBlank()) {
            throw new IllegalArgumentException("Message is required");
        }

        if (nvidiaApiKey == null || nvidiaApiKey.isBlank()) {
            throw new IllegalStateException("NVIDIA_API_KEY environment variable is not configured");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String prompt = buildPrompt(user.getLevel(), request.getMessage());
        String reply = callNvidia(prompt);
        chatHistoryRepository.save(new ChatHistory(
                user,
                request.getMessage().trim(),
                reply,
                user.getLevel(),
                nvidiaModel
        ));

        return new ChatResponse(reply, user.getLevel(), nvidiaModel);
    }

    public List<ChatHistoryResponse> getHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return chatHistoryRepository.findByUserIdOrderByCreatedAtAsc(user.getId())
                .stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    @Transactional
    public void clearHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        chatHistoryRepository.deleteByUserId(user.getId());
    }

    private ChatHistoryResponse toHistoryResponse(ChatHistory history) {
        return new ChatHistoryResponse(
                history.getId(),
                history.getQuestion(),
                history.getAnswer(),
                history.getLevel(),
                history.getModel(),
                history.getCreatedAt()
        );
    }

    private String buildPrompt(String level, String message) {
        return """
                Student level: %s
                Explanation style:
                - Beginner: use very simple language, short examples, and avoid heavy jargon.
                - Intermediate: use moderate detail and connect ideas to practical coding.
                - Advanced: use technical terms, tradeoffs, and deeper implementation details.

                Student question:
                %s
                """.formatted(level, message);
    }

    private String callNvidia(String userPrompt) {
        try {
            ObjectNode body = objectMapper.createObjectNode();
            body.put("model", nvidiaModel);
            body.put("temperature", 0.3);
            body.put("max_tokens", 600);

            ArrayNode messages = body.putArray("messages");
            ObjectNode systemMessage = messages.addObject();
            systemMessage.put("role", "system");
            systemMessage.put("content", TUTOR_SYSTEM_PROMPT);

            ObjectNode userMessage = messages.addObject();
            userMessage.put("role", "user");
            userMessage.put("content", userPrompt);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(nvidiaBaseUrl))
                    .header("Authorization", "Bearer " + nvidiaApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalStateException("NVIDIA API error: " + response.body());
            }

            JsonNode responseJson = objectMapper.readTree(response.body());
            return extractResponseText(responseJson);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("NVIDIA request was interrupted", exception);
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to get chatbot response: " + exception.getMessage(), exception);
        }
    }

    private String extractResponseText(JsonNode responseJson) {
        JsonNode choices = responseJson.get("choices");
        if (choices != null && choices.isArray() && !choices.isEmpty()) {
            JsonNode content = choices.get(0).path("message").path("content");
            if (content.isTextual()) {
                return content.asText();
            }
        }

        return "I could not read the NVIDIA AI response. Please try again.";
    }
}
