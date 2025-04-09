package com.ij11.chatbot.api.dto.tickets.response;

import com.ij11.chatbot.domain.models.tickets.TicketMessageSenderRole;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TicketMessageResponse {
    private Long id;
    private Long senderId;
    private TicketMessageSenderRole senderRole;
    private String content;
    private LocalDateTime timestamp;
}