package com.ij11.chatbot.service;

import com.ij11.chatbot.config.APIPrefixController;
import org.springframework.web.bind.annotation.*;

@RestController
@APIPrefixController
public class UserController {

    @RequestMapping("/users")
    public String getUsers() {
        return "List of users";
    }
}
