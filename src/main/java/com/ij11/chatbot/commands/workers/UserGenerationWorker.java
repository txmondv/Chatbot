package com.ij11.chatbot.commands.workers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ij11.chatbot.domain.models.users.User;
import com.ij11.chatbot.service.auth.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;

@Component
@AllArgsConstructor
public class UserGenerationWorker {
    private final AuthService authService;

    public int generateUsers(int amount, String password, Consumer<User> onSuccessfulGeneration, Consumer<String> onDuplicateName) throws IOException {
        return generateUsers(generateNames(amount), password, onSuccessfulGeneration, onDuplicateName);
    }

    public int generateUsers(Set<String> names, String password,Consumer<User> onSuccessfulGeneration, Consumer<String> onDuplicateName) throws IOException {
        AtomicInteger actualGenerations = new AtomicInteger();
        names.forEach(name -> {
            Optional<User> userOpt = authService.registerUser(name, password);
            if(userOpt.isEmpty()) {
                onDuplicateName.accept(name);
                return;
            }

            onSuccessfulGeneration.accept(userOpt.get());
            actualGenerations.getAndIncrement();
        });
        return actualGenerations.get();
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
