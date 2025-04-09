package com.ij11.chatbot.api.dto.tickets.request;

import lombok.Data;

@Data
public class AssignSupporterRequest {
    private Long ticketId;
    private Long supporterId;
}
