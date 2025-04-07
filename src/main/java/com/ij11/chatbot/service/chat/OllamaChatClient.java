package com.ij11.chatbot.service.chat;

import com.ij11.chatbot.config.OllamaUserConfig;
import com.ij11.chatbot.config.RequestUserConfig;
import com.ij11.chatbot.config.ServerUserConfig;
import com.ij11.chatbot.domain.models.chat.ChatMessage;
import com.ij11.chatbot.domain.models.chat.ChatMessageOrigin;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Component
@RequiredArgsConstructor
public class OllamaChatClient {

    private final Logger Logger = LoggerFactory.getLogger(OllamaChatClient.class);
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String OLLAMA_API_URL =
            OllamaUserConfig.OLLAMA_ADDRESS.get() + ":" + OllamaUserConfig.OLLAMA_PORT.get() + "/api/chat";

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

        if(ServerUserConfig.LOG_CHAT_REQUESTS.get()) {
            Logger.info("[POST] <{}> {}", OLLAMA_API_URL, requestBody.toString());
        }

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
        options.put("num_predict", OllamaUserConfig.OLLAMA_MAX_TOKENS.get());
        options.put("temperature", OllamaUserConfig.OLLAMA_TEMPERATURE.get());
        if(OllamaUserConfig.OLLAMA_PREDICTABLE.get()) options.put("seed", 42);
        options.put("top_p", OllamaUserConfig.OLLAMA_TOP_P.get());
        return options;
    }

    private static List<Map<String, String>> getMessages(List<ChatMessage> history, String userMessage, boolean isTitleGeneration) {
        List<Map<String, String>> messages = new ArrayList<>();

        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");

        if (isTitleGeneration) {
            String prompt = OllamaUserConfig.OLLAMA_TITLE_PROMPT.get();
            systemMessage.put("content", applyPromptVariables(prompt));
            messages.add(systemMessage);
        } else if (!Objects.equals(OllamaUserConfig.OLLAMA_SYSTEM_MESSAGE.get(), "")) {
            String systemPrompt = OllamaUserConfig.OLLAMA_SYSTEM_MESSAGE.get();
            systemMessage.put("content", applyPromptVariables(systemPrompt));
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

    @SuppressWarnings("unchecked")
    private static String applyPromptVariables(String input) {
        input = input.replace("${categories}", Arrays.toString(RequestUserConfig.PROMPTVAR_CATEGORIES.get().split(", ")));

        return input;
    }
}
