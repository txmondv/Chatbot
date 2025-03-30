package com.ij11.chatbot.controller.chat;

import com.ij11.chatbot.dto.chat.ChatInfo;
import com.ij11.chatbot.models.Chat;
import com.ij11.chatbot.models.ChatMessage;
import com.ij11.chatbot.models.User;
import com.ij11.chatbot.service.chat.OllamaChatService;
import com.ij11.chatbot.service.users.UserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
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
    private final UserInfoService userInfoService;

    private boolean isUserOwnerOfChat(String authHeader, Long chatId) {
        Optional<User> userOpt = userInfoService.getUserByAuthHeader(authHeader);
        if (userOpt.isEmpty()) return true;
        User user = userOpt.get();
        return chatService.getChatsByUser(user).stream().noneMatch(chat -> chat.getId().equals(chatId));
    }

    @PostMapping("/start")
    public ResponseEntity<Chat> startChat(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader,
                                          @RequestBody Map<String, String> body) {
        Optional<User> userOpt = userInfoService.getUserByAuthHeader(authHeader);
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();
        User user = userOpt.get();

        String model = body.get("model");
        Chat chat = chatService.startNewChat(user, model);
        return ResponseEntity.ok(chat);
    }

    @PostMapping("/{chatId}/message")
    public ResponseEntity<ChatMessage> sendMessage(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader, @PathVariable Long chatId, @RequestBody Map<String, String> body) {
        if(isUserOwnerOfChat(authHeader, chatId)) return ResponseEntity.status(401).build();
        String messageContent = body.get("message");
        ChatMessage response = chatService.sendMessage(chatId, messageContent);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{chatId}/history")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader, @PathVariable Long chatId) {
        if(isUserOwnerOfChat(authHeader, chatId)) return ResponseEntity.status(401).build();
        List<ChatMessage> messages = chatService.getChatMessages(chatId);
        return ResponseEntity.ok(messages);
    }

    @PatchMapping("/{chatId}/setTitle")
    public ResponseEntity<ChatInfo> setTitle(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader, @PathVariable Long chatId, @RequestBody Map<String, String> body) {
        if(isUserOwnerOfChat(authHeader, chatId)) return ResponseEntity.status(401).build();
        String title = body.get("title");
        chatService.setTitle(chatId, title);
        Optional<ChatInfo> chatInfo = chatService.getChatInfo(chatId);
        return chatInfo.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(404).build());
    }

    @DeleteMapping("/{chatId}/delete")
    public ResponseEntity<Object> deleteChat(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader, @PathVariable Long chatId) {
        if(isUserOwnerOfChat(authHeader, chatId)) return ResponseEntity.status(401).build();
        chatService.deleteChat(chatId);
        return null;
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<ChatInfo> getChatInfo(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader,
                                                @PathVariable Long chatId) {
        if (isUserOwnerOfChat(authHeader, chatId)) return ResponseEntity.status(401).build();
        Optional<ChatInfo> chatInfo = chatService.getChatInfo(chatId);
        return chatInfo.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(404).build());
    }

    @GetMapping
    public ResponseEntity<List<ChatInfo>> getUserChats(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        Optional<User> userOpt = userInfoService.getUserByAuthHeader(authHeader);
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();

        User user = userOpt.get();
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
