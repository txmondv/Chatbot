package com.ij11.chatbot.config;

import com.ij11.chatbot.core.annotations.ConfigFile;
import com.ij11.chatbot.core.annotations.ConfigProperty;
import com.ij11.chatbot.core.configurations.ConfigEntry;

@ConfigFile("request.properties")
public class RequestUserConfig {

    @ConfigProperty("request.prompt.variables.categories")
    public static ConfigEntry<String> PROMPTVAR_CATEGORIES =
            new ConfigEntry<>(
                    String.class,
                    "general, system",
                    "${categories} Variable in system-message.\n" +
                    "Separated by comma.");
}
