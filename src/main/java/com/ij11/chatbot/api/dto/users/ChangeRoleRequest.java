package com.ij11.chatbot.api.dto.users;

import com.ij11.chatbot.domain.models.users.UserRole;
import lombok.Data;

@Data
public class ChangeRoleRequest {
    private String username;
    private UserRole role;
}
