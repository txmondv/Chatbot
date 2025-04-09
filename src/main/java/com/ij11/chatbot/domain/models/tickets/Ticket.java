package com.ij11.chatbot.domain.models.tickets;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ij11.chatbot.domain.models.chat.Chat;
import com.ij11.chatbot.domain.models.chat.ChatMessage;
import com.ij11.chatbot.domain.models.users.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "tickets")
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @Column(nullable = false)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToMany
    @JoinTable(
            name = "ticket_supporters",
            joinColumns = @JoinColumn(name = "ticket_id"),
            inverseJoinColumns = @JoinColumn(name = "supporter_id")
    )
    private Set<User> assignedSupporters = new HashSet<>();

    @ManyToOne(optional = true)
    @JoinColumn(name = "chat_id", nullable = true)
    @JsonIgnore
    private Chat chat;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String title;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String category;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status = TicketStatus.OPEN;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("timestamp ASC")
    private List<TicketMessage> messages = new ArrayList<>();

    public void removeChat() {
        this.chat = null;
    }
}
