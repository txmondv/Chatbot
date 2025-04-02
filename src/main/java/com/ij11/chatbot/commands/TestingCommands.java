package com.ij11.chatbot.commands;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ij11.chatbot.core.commands.CommandManager;
import com.ij11.chatbot.service.auth.AuthService;
import com.ij11.chatbot.domain.models.users.User;
import lombok.AllArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.shell.standard.ShellComponent;
import org.springframework.shell.standard.ShellMethod;
import org.springframework.shell.standard.ShellOption;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@AllArgsConstructor
@ShellComponent
public class TestingCommands {

    private final AuthService authService;

    @ShellMethod("Generates some users to populate the database")
    public void generateUsers(
            @ShellOption(defaultValue = "10", help = "Amount of users to generate") String amount,
            @ShellOption(defaultValue = "hello", help = "Password for the user account") String password
    ) throws IOException {
        int usersAmount = Integer.parseInt(amount);
        Set<String> userNames = generateNames(usersAmount);

        AtomicInteger actualGenerations = new AtomicInteger();
        userNames.forEach(name -> {
                Optional<User> userOpt = authService.registerUser(name, password);
                if(userOpt.isEmpty()) {
                    CommandManager.logCommandResult("Generator", "User with name \"" + name + "\" already exists.");
                    return;
                }

                User user = userOpt.get();
                CommandManager.logCommandResult("Generator",
                        "Generated new user with name \"" + name + "\" and ID " + user.getId());
                actualGenerations.getAndIncrement();
        });

        CommandManager.logCommandResult("Generator",
                "Generated " + actualGenerations.get() + " users with password \"" + password + "\" (" + (userNames.size() - actualGenerations.get()) + " failed)");
    }

    private Set<String> generateNames(int count) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        ClassPathResource resource = new ClassPathResource("dev/names.json");
        InputStream inputStream = resource.getInputStream();
        JsonNode root = objectMapper.readTree(inputStream);

        Random random = new Random();
        List<String> adjectives = objectMapper.convertValue(root.get("adjectives"), List.class);
        List<String> nouns = objectMapper.convertValue(root.get("nouns"), List.class);

        Set<String> generatedNames = new HashSet<>();

        while (generatedNames.size() < count) {
            String adjective = adjectives.get(random.nextInt(adjectives.size()));
            String noun = nouns.get(random.nextInt(nouns.size()));
            String name = adjective + noun;

            generatedNames.add(name);
        }
        return generatedNames;
    }
}
