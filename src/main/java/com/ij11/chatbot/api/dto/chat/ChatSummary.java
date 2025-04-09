package com.ij11.chatbot.api.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatSummary {
    private String category;
    private String title;
    private String summary;
}