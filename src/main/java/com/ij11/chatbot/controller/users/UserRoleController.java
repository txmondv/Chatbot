package com.ij11.chatbot.controller.users;

import com.ij11.chatbot.config.annotations.Authorized;
import com.ij11.chatbot.config.annotations.Roles;
import com.ij11.chatbot.dto.users.ChangeRoleRequest;
import com.ij11.chatbot.models.users.User;
import com.ij11.chatbot.models.users.UserRole;
import com.ij11.chatbot.service.users.UserRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/users/roles")
@RequiredArgsConstructor
public class UserRoleController {

    private final UserRoleService userRoleService;

    @Authorized
    @Roles(UserRole.MANAGER)
    @PostMapping("/add")
    public void addRole(User user, @RequestBody ChangeRoleRequest roleRequest) {
        userRoleService.addRole(roleRequest.getUsername(), roleRequest.getRole());
    }

    @Authorized
    @Roles(UserRole.MANAGER)
    @PostMapping("/remove")
    public void removeRole(User user, @RequestBody ChangeRoleRequest roleRequest) {
        userRoleService.removeRole(roleRequest.getUsername(), roleRequest.getRole());
    }

    @Authorized
    @GetMapping
    public Set<UserRole> getRoles(User user) {
        return userRoleService.getRoles(user.getUsername());
    }
}