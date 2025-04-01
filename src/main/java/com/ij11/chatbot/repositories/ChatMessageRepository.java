package com.ij11.chatbot.repositories;

import com.ij11.chatbot.models.chat.Chat;
import com.ij11.chatbot.models.chat.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatOrderByTimestampAsc(Chat chat);
}
