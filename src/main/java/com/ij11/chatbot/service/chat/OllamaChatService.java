package com.ij11.chatbot.service.chat;

import com.ij11.chatbot.api.dto.chat.ChatInfo;
import com.ij11.chatbot.api.dto.chat.ChatSummary;
import com.ij11.chatbot.domain.models.chat.Chat;
import com.ij11.chatbot.domain.models.chat.ChatMessage;
import com.ij11.chatbot.domain.models.chat.ChatMessageOrigin;
import com.ij11.chatbot.domain.models.tickets.Ticket;
import com.ij11.chatbot.domain.models.users.User;
import com.ij11.chatbot.domain.repositories.ChatMessageRepository;
import com.ij11.chatbot.domain.repositories.ChatRepository;
import com.ij11.chatbot.domain.repositories.TicketRepository;
import com.ij11.chatbot.service.tickets.ChatbotTicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OllamaChatService {

    private final String NEW_CHAT_TITLE = "Neuer Chat";

    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatbotTicketService ticketService;
    private final OllamaChatClient ollamaClient;
    private final ChatService chatService;

    @Transactional
    public Chat startNewChat(User user, String model) {
        Chat chat = new Chat();
        Long maxId = chatRepository.findMaxId().orElse(0L);
        chat.setId(maxId + 1);
        chat.setUser(user);
        chat.setModel(model);
        chat.setTitle(NEW_CHAT_TITLE);
        chat.setCreatedAt(LocalDateTime.now());
        return chatRepository.save(chat);
    }

    @Transactional
    public ChatMessage sendMessage(Long chatId, String messageContent) {
        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        if (chatOpt.isEmpty()) {
            throw new IllegalArgumentException("Chat session not found");
        }
        Chat chat = chatOpt.get();

        if(chat.getMessages().isEmpty() && chat.getTitle().equals(NEW_CHAT_TITLE)) {
            chat.setTitle(ollamaClient.generateTitle(chat.getModel(), messageContent));
        }

        ChatMessage userMessage = new ChatMessage(null, chat, ChatMessageOrigin.USER, messageContent, LocalDateTime.now());

        String llmResponse = ollamaClient.chat(
                chat.getModel(),
                chatMessageRepository.findByChatOrderByTimestampAsc(chat),
                messageContent
        );

        chatMessageRepository.save(userMessage);
        ChatMessage llmMessage = new ChatMessage(null, chat, ChatMessageOrigin.LLM, llmResponse, LocalDateTime.now());
        return chatMessageRepository.save(llmMessage);
    }

    public void setTitle(Long chatId, String title) {
        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        if (chatOpt.isPresent()) {
            Chat chat = chatOpt.get();
            chat.setTitle(title);
            chatRepository.save(chat);
        } else {
            throw new IllegalArgumentException("Chat session not found");
        }
    }

    public Optional<ChatInfo> getChatInfo(Long chatId) {
        Optional<Chat> chatOpt = getChatById(chatId);
        if (chatOpt.isEmpty()) return Optional.empty();

        Chat chat = chatOpt.get();
        return Optional.of(new ChatInfo(
                chat.getId(),
                chat.getModel(),
                chat.getTitle(),
                chat.getUser().getUsername(),
                chat.getCreatedAt(),
                chat.getMessages().size(),
                chat.getMessages().isEmpty() ? null : chat.getMessages().get(chat.getMessages().size() - 1).getTimestamp()
        ));
    }

    public void deleteChat(Long chatId) {
        ticketService.removeChatFromTickets(chatId);
        chatService.deleteChat(chatId);
    }

    public void deleteAllChats(User user) {
        for(Chat chat : chatService.getChatsByUser(user)) {
            deleteChat(chat.getId());
        }
    }

    public Optional<Chat> getChatById(Long chatId) {
        return chatRepository.findById(chatId);
    }

    public List<Chat> getChatsByUser(User user) {
        return chatService.getChatsByUser(user);
    }

    public List<ChatMessage> getChatMessages(Long chatId) {
        return chatService.getChatMessages(chatId);
    }

    public Optional<ChatSummary> generateSummary(Long chatId) {
        Optional<Chat> chatOpt = getChatById(chatId);
        if (chatOpt.isEmpty()) return Optional.empty();
        Chat chat = chatOpt.get();
        return Optional.of(ollamaClient.summarize(chat.getModel(), chatService.getChatMessages(chat.getId())));
    }

}
