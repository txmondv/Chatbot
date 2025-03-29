package com.ij11.chatbot.config;

import com.ij11.chatbot.config.infrastrcuture.ConfigEntry;
import com.ij11.chatbot.config.infrastrcuture.ConfigManager;
import com.ij11.chatbot.config.infrastrcuture.annotations.ConfigFile;
import com.ij11.chatbot.config.infrastrcuture.annotations.ConfigProperty;

@ConfigFile("webserver.properties")
public class WebServerConfig {
    private static final String CONFIG_FILE_NAME = "webserver.properties";

    @ConfigProperty("webserver.port")
    public static final ConfigEntry<Integer> WEBSERVER_PORT =
            new ConfigEntry<>(
                    Integer.class,
                    8080,
                    "The port the webserver should be served on") {};

    @ConfigProperty("ollama.address")
    public static final ConfigEntry<String> OLLAMA_ADDRESS =
            new ConfigEntry<>(
                    String.class,
                    "http://localhost",
                    "The address where ollama is hosted. Usually you want to run it on the same sever as the webserver. Make sure to also include the protocol!") {};

    @ConfigProperty("ollama.port")
    public static final ConfigEntry<Integer> OLLAMA_PORT =
            new ConfigEntry<>(
                    Integer.class,
                    11434,
                    "Your Ollama port. Default is 11434.") {};




    public static Integer getWebserverPort() {
        return ConfigManager.get(WEBSERVER_PORT, "webserver.port", CONFIG_FILE_NAME);
    }

    public static String getOllamaAddress() {
        return ConfigManager.get(OLLAMA_ADDRESS, "ollama.address", CONFIG_FILE_NAME);
    }

    public static Integer getOllamaPort() {
        return ConfigManager.get(OLLAMA_PORT, "ollama.port", CONFIG_FILE_NAME);
    }
}
