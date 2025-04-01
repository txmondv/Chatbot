package com.ij11.chatbot.config;

import com.ij11.chatbot.config.infrastrcuture.ConfigEntry;
import com.ij11.chatbot.config.infrastrcuture.ConfigManager;
import com.ij11.chatbot.config.annotations.ConfigFile;
import com.ij11.chatbot.config.annotations.ConfigProperty;

@ConfigFile("chatbot.properties")
public class ChatbotUserConfig {
    private static final String CONFIG_FILE_NAME = "chatbot.properties";

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
                    "Your Ollama port. (Default: 11434).") {};

    @ConfigProperty("ollama.prompt.maxtokens")
    public static final ConfigEntry<Integer> OLLAMA_MAX_TOKENS =
            new ConfigEntry<>(
                    Integer.class,
                    -1,
                    "Maximum amount of tokens for a response. Set to -1 for infinite.") {};

    @ConfigProperty("ollama.prompt.temperature")
    public static final ConfigEntry<Double> OLLAMA_TEMPERATURE =
            new ConfigEntry<>(
                    Double.class,
                    0.5,
                    "The temperature of the model. Increasing the temperature will make the model answer more creatively. (Default: 0.5)") {};

    @ConfigProperty("ollama.prompt.bePredictable")
    public static final ConfigEntry<Boolean> OLLAMA_PREDICTABLE =
            new ConfigEntry<>(
                    Boolean.class,
                    false,
                    "Defines whether the LLM should always give the same answer for the same question.") {};

    @ConfigProperty("ollama.prompt.top_p")
    public static final ConfigEntry<Double> OLLAMA_TOP_P =
            new ConfigEntry<>(
                    Double.class,
                    0.7,
                    "A higher value (e.g., 0.95) will lead to more diverse text, while a lower value (e.g., 0.5) will generate more focused and conservative text.") {};



    public static Integer getWebserverPort() {
        return ConfigManager.get(WEBSERVER_PORT, "webserver.port", CONFIG_FILE_NAME);
    }

    public static String getOllamaAddress() {
        return ConfigManager.get(OLLAMA_ADDRESS, "ollama.address", CONFIG_FILE_NAME);
    }

    public static Integer getOllamaPort() {
        return ConfigManager.get(OLLAMA_PORT, "ollama.port", CONFIG_FILE_NAME);
    }

    public static Integer getOllamaMaxTokens() {
        return ConfigManager.get(OLLAMA_MAX_TOKENS, "ollama.prompt.maxtokens", CONFIG_FILE_NAME);
    }

    public static Double getOllamaTemperature() {
        return ConfigManager.get(OLLAMA_TEMPERATURE, "ollama.prompt.temperature", CONFIG_FILE_NAME);
    }

    public static Boolean getOllamaBePredictable() {
        return ConfigManager.get(OLLAMA_PREDICTABLE, "ollama.prompt.bePredictable", CONFIG_FILE_NAME);
    }

    public static Double getOllamaTopP() {
        return ConfigManager.get(OLLAMA_TOP_P, "ollama.prompt.top_p", CONFIG_FILE_NAME);
    }
}
