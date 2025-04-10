package com.ij11.chatbot.api.dto.tickets.response;

import com.ij11.chatbot.domain.models.tickets.TicketStatus;
import lombok.Data;

import java.util.Set;

@Data
public class TicketResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private Long userId;
    private String userName;
    private Set<Long> supporterIds;
    private Set<String> supporterNames;
    private Long chatId;
    private TicketStatus status;
}
