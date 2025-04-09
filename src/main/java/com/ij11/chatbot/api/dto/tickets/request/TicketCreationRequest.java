package com.ij11.chatbot.api.dto.tickets.request;

import lombok.Data;

@Data
public class TicketCreationRequest {
    private String title;
    private String description;
    private String category;
    private Long chatId;
}
