package com.ij11.chatbot.api.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ChatInfo {
    private Long id;
    private String model;
    private String title;
    private String username;
    private LocalDateTime creationDate;
    private int messageCount;
    private LocalDateTime lastMessageAt;
}
