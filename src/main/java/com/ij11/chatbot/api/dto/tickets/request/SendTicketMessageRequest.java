package com.ij11.chatbot.api.dto.tickets.request;

import lombok.Data;

@Data
public class SendTicketMessageRequest {
    private Long ticketId;
    private String content;
}
