package com.ij11.chatbot.controller.users;

import com.ij11.chatbot.config.annotations.Authorized;
import com.ij11.chatbot.config.annotations.Roles;
import com.ij11.chatbot.dto.users.UserDto;
import com.ij11.chatbot.models.users.User;
import com.ij11.chatbot.models.users.UserRole;
import com.ij11.chatbot.service.users.UserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users/info")
public class UserInfoController {
    private final UserInfoService userInfoService;

    @Authorized
    @GetMapping("/getUsername")
    public String getUsername(User user) {
        return user.getUsername();
    }

    @Authorized
    @Roles({UserRole.MANAGER, UserRole.SUPPORTER})
    @GetMapping("/getUsers")
    public List<UserDto> getUsers() {
        return userInfoService.getUsers();
    }
}
