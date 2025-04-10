package com.ij11.chatbot.api.dto.tickets.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddNoteRequest {
    private Long ticketId;
    private String content;
}