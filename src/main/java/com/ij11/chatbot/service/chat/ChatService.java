package com.ij11.chatbot.service.chat;

import com.ij11.chatbot.models.Chat;
import com.ij11.chatbot.models.ChatMessage;
import com.ij11.chatbot.models.User;
import com.ij11.chatbot.repositories.ChatMessageRepository;
import com.ij11.chatbot.repositories.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;

    public List<Chat> getChatsByUser(User user) {
        return chatRepository.findByUser(user);
    }

    public void deleteChat(Long chatId) {
        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        if (chatOpt.isEmpty()) throw new Error("Chat not found");
        chatRepository.delete(chatOpt.get());
    }

    public List<ChatMessage> getChatMessages(Long chatId) {
        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        if (chatOpt.isEmpty()) {
            return List.of();
        }
        return chatMessageRepository.findByChatOrderByTimestampAsc(chatOpt.get());
    }

}
