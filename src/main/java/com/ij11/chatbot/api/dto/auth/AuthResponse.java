package com.ij11.chatbot.api.dto.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {
    private boolean success;
    private String token;
    private String error;

    public AuthResponse(boolean success, String token) {
        this.token = token;
        this.success = success;
    }

    public AuthResponse(String error) {
        this.error = error;
        this.success = false;
    }
}