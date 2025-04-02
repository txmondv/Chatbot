package com.ij11.chatbot.api.controller.chat;

import com.ij11.chatbot.core.annotations.Authorized;
import com.ij11.chatbot.api.dto.chat.ChatInfo;
import com.ij11.chatbot.domain.models.chat.Chat;
import com.ij11.chatbot.domain.models.chat.ChatMessage;
import com.ij11.chatbot.domain.models.users.User;
import com.ij11.chatbot.service.chat.OllamaChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final OllamaChatService chatService;

    private boolean isUserOwnerOfChat(User user, Long chatId) {
        return chatService.getChatsByUser(user).stream().noneMatch(chat -> chat.getId().equals(chatId));
    }

    @Authorized
    @PostMapping("/start")
    public ResponseEntity<Chat> startChat(User user, @RequestBody Map<String, String> body) {
        String model = body.get("model");
        Chat chat = chatService.startNewChat(user, model);
        return ResponseEntity.ok(chat);
    }

    @Authorized
    @PostMapping("/{chatId}/message")
    public ResponseEntity<ChatMessage> sendMessage(User user, @PathVariable Long chatId, @RequestBody Map<String, String> body) {
        if(isUserOwnerOfChat(user, chatId)) return ResponseEntity.status(401).build();
        String messageContent = body.get("message");
        ChatMessage response = chatService.sendMessage(chatId, messageContent);
        return ResponseEntity.ok(response);
    }

    @Authorized
    @GetMapping("/{chatId}/history")
    public ResponseEntity<List<ChatMessage>> getChatHistory(User user, @PathVariable Long chatId) {
        if(isUserOwnerOfChat(user, chatId)) return ResponseEntity.status(401).build();
        List<ChatMessage> messages = chatService.getChatMessages(chatId);
        return ResponseEntity.ok(messages);
    }

    @Authorized
    @PatchMapping("/{chatId}/setTitle")
    public ResponseEntity<ChatInfo> setTitle(User user, @PathVariable Long chatId, @RequestBody Map<String, String> body) {
        if(isUserOwnerOfChat(user, chatId)) return ResponseEntity.status(401).build();
        String title = body.get("title");
        chatService.setTitle(chatId, title);
        Optional<ChatInfo> chatInfo = chatService.getChatInfo(chatId);
        return chatInfo.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(404).build());
    }

    @Authorized
    @DeleteMapping("/{chatId}/delete")
    public ResponseEntity<Object> deleteChat(User user, @PathVariable Long chatId) {
        if(isUserOwnerOfChat(user, chatId)) return ResponseEntity.status(401).build();
        chatService.deleteChat(chatId);
        return ResponseEntity.status(200).build();
    }

    @Authorized
    @GetMapping("/{chatId}")
    public ResponseEntity<ChatInfo> getChatInfo(User user,
                                                @PathVariable Long chatId) {
        if (isUserOwnerOfChat(user, chatId)) return ResponseEntity.status(401).build();
        Optional<ChatInfo> chatInfo = chatService.getChatInfo(chatId);
        return chatInfo.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(404).build());
    }

    @Authorized
    @GetMapping
    public ResponseEntity<List<ChatInfo>> getUserChats(User user) {
        List<ChatInfo> chatDTOs = chatService.getChatsByUser(user).stream()
                .map(chat -> new ChatInfo(
                        chat.getId(),
                        chat.getModel(),
                        chat.getTitle(),
                        chat.getUser().getUsername(),
                        chat.getCreatedAt(),
                        chat.getMessages().size(),
                        chat.getMessages().isEmpty() ? null : chat.getMessages().get(chat.getMessages().size() - 1).getTimestamp()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(chatDTOs);
    }
}
