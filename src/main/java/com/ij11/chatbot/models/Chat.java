package com.ij11.chatbot.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "chats")
@NoArgsConstructor
@AllArgsConstructor
public class Chat {

    @Id
    @Column(nullable = false)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String model;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String title;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("timestamp ASC")
    private List<ChatMessage> messages;
}
