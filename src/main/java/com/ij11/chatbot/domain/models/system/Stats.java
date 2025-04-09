package com.ij11.chatbot.domain.models.system;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "stats")
@Data
public class Stats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Long statValue;

}