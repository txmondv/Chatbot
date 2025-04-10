package com.ij11.chatbot.domain.models.tickets;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ij11.chatbot.domain.models.users.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "ticket_notes")
@NoArgsConstructor
@AllArgsConstructor
public class TicketNote {

    @Id
    @Column(nullable = false)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "ticket_id", nullable = false)
    @JsonIgnore
    private Ticket ticket;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User author;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}
