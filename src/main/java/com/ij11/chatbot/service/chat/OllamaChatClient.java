package com.ij11.chatbot.service.chat;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ij11.chatbot.api.dto.chat.ChatSummary;
import com.ij11.chatbot.config.OllamaUserConfig;
import com.ij11.chatbot.config.ServerUserConfig;
import com.ij11.chatbot.config.systemmessage.SummaryMessageConfig;
import com.ij11.chatbot.config.systemmessage.SystemMessageConfig;
import com.ij11.chatbot.domain.models.chat.ChatMessage;
import com.ij11.chatbot.domain.models.chat.ChatMessageOrigin;
import com.ij11.chatbot.domain.models.system.StatName;
import com.ij11.chatbot.service.system.StatsService;
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
    private final StatsService statsService;
    private final RestTemplate restTemplate = new RestTemplate();
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final String OLLAMA_API_URL =
            OllamaUserConfig.OLLAMA_ADDRESS.get() + ":" + OllamaUserConfig.OLLAMA_PORT.get() + "/api/chat";

    public String generateTitle(String model, String userMessage) {
        return (String) respond(getRequestBody(model, List.of(), userMessage, RequestType.TITLE_GENERATION));
    }

    public String chat(String model, List<ChatMessage> history, String userMessage) {
        return (String) respond(getRequestBody(model, history, userMessage, RequestType.CHAT));
    }

    public ChatSummary summarize(String model, List<ChatMessage> history) {
        String response = respond(getRequestBody(model, history, "", RequestType.SUMMARY)).toString();
        try {
            return objectMapper.readValue(response, ChatSummary.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }


    private Object respond(Map<String, Object> requestBody) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        statsService.incrementStat(StatName.ASSISTANT_REQUESTS);
        if(ServerUserConfig.LOG_CHAT_REQUESTS.get()) {
            Logger.info("[POST] <{}> {}", OLLAMA_API_URL, requestBody.toString());
        }

        Date startTime = new Date();
        ResponseEntity<Map> response = restTemplate.exchange(OLLAMA_API_URL, HttpMethod.POST, entity, Map.class);
        Date endTime = new Date();

        statsService.addResponseTime(endTime.getTime() - startTime.getTime());

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map<String, Object> message = (Map<String, Object>) response.getBody().get("message");
            if (message != null) {
                return message.get("content");
            }
        }

        throw new RuntimeException("Failed to get a response from Ollama");
    }

    private static Map<String, Object> getRequestBody(String model, List<ChatMessage> history, String userMessage, RequestType type) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("raw", true);
        requestBody.put("stream", false);
        requestBody.put("options", getOptions());
        requestBody.put("messages", getMessages(history, userMessage, type));

        if (RequestType.SUMMARY.equals(type)) {
            Map<String, Object> format = getStructuredOutputFormat();
            requestBody.put("format", format);
        }

        return requestBody;
    }

    private static Map<String, Object> getStructuredOutputFormat() {
        List<String> requiredStringProperties = List.of("category", "title", "summary");

        Map<String, Object> format = new HashMap<>();
        format.put("type", "object");

        Map<String, Object> properties = new HashMap<>();

        for(String property : requiredStringProperties) {
            Map<String, Object> propertyMap = new HashMap<>();
            propertyMap.put("type", "string");
            properties.put(property, propertyMap);
        }

        format.put("properties", properties);
        format.put("required", requiredStringProperties);
        return format;
    }

    private static Map<String, Object> getOptions() {
        Map<String, Object> options = new HashMap<>();
        options.put("num_predict", OllamaUserConfig.OLLAMA_MAX_TOKENS.get());
        options.put("temperature", OllamaUserConfig.OLLAMA_TEMPERATURE.get());
        if(OllamaUserConfig.OLLAMA_PREDICTABLE.get()) options.put("seed", 42);
        options.put("top_p", OllamaUserConfig.OLLAMA_TOP_P.get());

        return options;
    }

    private static List<Map<String, String>> getMessages(List<ChatMessage> history, String userMessage, RequestType type) {
        List<Map<String, String>> messages = new ArrayList<>();

        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");

        if (RequestType.TITLE_GENERATION.equals(type)) {
            systemMessage.put("content", OllamaUserConfig.OLLAMA_TITLE_PROMPT.get());
            messages.add(systemMessage);
        } else if (RequestType.SUMMARY.equals(type)) {
            systemMessage.put("content", SummaryMessageConfig.getMessage());
            messages.add(systemMessage);
        } else if (!Objects.equals(SystemMessageConfig.getMessage(), "")) {
            systemMessage.put("content", SystemMessageConfig.getMessage());
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

    private enum RequestType {
        CHAT,
        TITLE_GENERATION,
        SUMMARY
    }
}