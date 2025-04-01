package com.ij11.chatbot.dto.users;

import com.ij11.chatbot.models.users.UserRole;
import lombok.Data;

@Data
public class ChangeRoleRequest {
    private String username;
    private UserRole role;
}
