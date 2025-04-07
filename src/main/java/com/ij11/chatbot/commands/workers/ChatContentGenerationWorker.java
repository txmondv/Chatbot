package com.ij11.chatbot.commands.workers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ij11.chatbot.core.commands.CommandManager;
import com.ij11.chatbot.domain.models.chat.Chat;
import com.ij11.chatbot.domain.models.chat.ChatMessage;
import com.ij11.chatbot.domain.models.users.User;
import com.ij11.chatbot.service.chat.OllamaChatClient;
import com.ij11.chatbot.service.chat.OllamaChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ChatContentGenerationWorker {    
    private final OllamaChatService ollamaChatService;
    private final ObjectMapper objectMapper;
    private final OllamaChatClient ollamaClient;

    public void processRequests(int amount, User user, String model) {
        List<Map<String, String>> requests = loadRequestsFromJson();
        if (requests == null || requests.isEmpty()) {
            CommandManager.logCommandResult("CHATGEN","Failed to load requests from JSON.");
            return;
        }

        List<Map<String, String>> selectedRequests = getRandomRequests(requests, amount);
        if(selectedRequests.isEmpty()) {
            return;
        }

        for (Map<String, String> request : selectedRequests) {
            processSingleRequest(user, model, request);
        }

        CommandManager.logCommandResult("CHATGEN","Finished generating chats.");
    }

    public void selfTalk(User user, String model, String initialPrompt, int iterations) {
        Chat chat = ollamaChatService.startNewChat(user, model);
        CommandManager.logCommandResult("CHATGEN", "Started self-talk chat with ID: " + chat.getId());

        String currentMessage = initialPrompt;
        for (int i = 0; i < iterations; i++) {
            ChatMessage response = ollamaChatService.sendMessage(chat.getId(), currentMessage);

            if (response != null) {
                CommandManager.logCommandResult("CHATGEN", "Self-talk iteration " + (i + 1) + " successful in chat " + chat.getId());
                String nextPrompt = "Generate the next user message based on the users requests. If you cannot identify a topic, just make one up! Also make sure to imitate being a user in you response, so no starting sentence JUST respond with the message you would think a user would write. Also don't include any formatting like quotation marks at the start/end. Don't repeat yourself and also respect the language.";
                currentMessage = ollamaClient.chat(model, ollamaChatService.getChatMessages(chat.getId()), nextPrompt);
            } else {
                CommandManager.logCommandResult("CHATGEN", "Self-talk iteration " + (i + 1) + " failed in chat " + chat.getId());
                return;
            }
        }
        CommandManager.logCommandResult("CHATGEN", "Self-talk completed in chat " + chat.getId());
    }

    private List<Map<String, String>> loadRequestsFromJson() {
        try {
            ClassPathResource resource = new ClassPathResource("dev/requests.json");
            InputStream inputStream = resource.getInputStream();
            return objectMapper.readValue(inputStream, new TypeReference<>() {});
        } catch (IOException e) {
            CommandManager.logCommandResult("CHATGEN", "Error loading requests from JSON: " + e.getMessage());
            return null;
        }
    }

    private List<Map<String, String>> getRandomRequests(List<Map<String, String>> requests, int amount) {
        if (amount >= requests.size()) {
            return requests;
        }

        Random random = new Random();
        return random.ints(0, requests.size())
                .distinct()
                .limit(amount)
                .mapToObj(requests::get)
                .collect(Collectors.toList());
    }

    private void processSingleRequest(User user, String model, Map<String, String> request) {
        String content = request.get("content");

        Chat chat = ollamaChatService.startNewChat(user, model);
        CommandManager.logCommandResult("CHATGEN", "Started new chat with ID: " + chat.getId());

        ChatMessage response = ollamaChatService.sendMessage(chat.getId(), content);

        if (response != null) {
            CommandManager.logCommandResult("CHATGEN", "Successful response in chat " + chat.getId());
        } else {
            CommandManager.logCommandResult("CHATGEN", "Failed to get response in chat " + chat.getId());
        }
    }
}
