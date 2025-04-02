package com.ij11.chatbot.api.dto.users;

import com.ij11.chatbot.domain.models.users.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class UserDto {
    private Long userId;
    private String username;
    private Set<UserRole> roles;
}