package com.ij11.chatbot.api.dto.tickets.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TicketNoteResponse {
    private Long id;
    private Long ticketId;
    private String authorName;
    private Long authorId;
    private String content;
    private LocalDateTime timestamp;
}