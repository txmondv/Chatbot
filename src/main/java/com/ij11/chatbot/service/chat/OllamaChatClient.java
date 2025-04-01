package com.ij11.chatbot.service.chat;

import com.ij11.chatbot.config.ChatbotUserConfig;
import com.ij11.chatbot.models.chat.ChatMessage;
import com.ij11.chatbot.models.chat.ChatMessageOrigin;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OllamaChatClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String OLLAMA_API_URL =
            ChatbotUserConfig.getOllamaAddress() + ":" + ChatbotUserConfig.getOllamaPort() + "/api/chat";

    public String generateTitle(String model, String userMessage) {
        return respond(getRequestBody(model, List.of(), userMessage, true));
    }

    public String chat(String model, List<ChatMessage> history, String userMessage) {
        return respond(getRequestBody(model, history, userMessage));
    }

    private String respond(Map<String, Object> requestBody) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.exchange(OLLAMA_API_URL, HttpMethod.POST, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return (String) ((Map<String, Object>) response.getBody().get("message")).get("content");
        }

        throw new RuntimeException("Failed to get a response from Ollama");
    }

    private static Map<String, Object> getRequestBody(String model, List<ChatMessage> history, String userMessage) {
        return getRequestBody(model, history, userMessage, false);
    }

    private static Map<String, Object> getRequestBody(String model, List<ChatMessage> history, String userMessage, boolean isTitleGeneration) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("raw", true);
        requestBody.put("stream", false);
        requestBody.put("options", getOptions());
        requestBody.put("messages", getMessages(history, userMessage, isTitleGeneration));
        return requestBody;
    }

    private static Map<String, Object> getOptions() {
        Map<String, Object> options = new HashMap<>();
        options.put("num_predict", ChatbotUserConfig.getOllamaMaxTokens());
        options.put("temperature", ChatbotUserConfig.getOllamaTemperature());
        if(ChatbotUserConfig.getOllamaBePredictable()) options.put("seed", 42);
        options.put("top_p", ChatbotUserConfig.getOllamaTopP());
        return options;
    }

    private static List<Map<String, String>> getMessages(List<ChatMessage> history, String userMessage, boolean isTitleGeneration) {
        List<Map<String, String>> messages = new ArrayList<>();
        if(isTitleGeneration) {
            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", "Generate a concise and relevant chat title based on the user's messages. Also respect the language chosen by the user and keep any formatting out.");
            messages.add(systemMessage);
        }

        for (ChatMessage message : history) {
            Map<String, String> msgEntry = new HashMap<>();
            msgEntry.put("role", message.getOrigin().equals(ChatMessageOrigin.USER) ? "user" : "assistant");
            msgEntry.put("content", message.getContent());
            messages.add(msgEntry);
        }

        Map<String, String> userMsgEntry = new HashMap<>();
        userMsgEntry.put("role", "user");
        userMsgEntry.put("content", userMessage);
        messages.add(userMsgEntry);
        return messages;
    }
}
