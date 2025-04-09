package com.ij11.chatbot.api.dto.tickets.request;

import com.ij11.chatbot.domain.models.tickets.TicketStatus;
import lombok.Data;

@Data
public class UpdateTicketRequest {
    private Long ticketId;
    private String title;
    private String description;
    private String category;
    private TicketStatus status;
}
