package com.ij11.chatbot.domain.models.system;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum StatName {
    ASSISTANT_REQUESTS("assistant_requests");

    private final String name;
}