package com.ij11.chatbot.config;

import com.ij11.chatbot.core.annotations.ConfigFile;
import com.ij11.chatbot.core.annotations.ConfigProperty;
import com.ij11.chatbot.core.configurations.ConfigEntry;

@ConfigFile("chatbot.properties")
public class ChatbotUserConfig {

    @ConfigProperty("webserver.port")
    public static ConfigEntry<Integer> WEBSERVER_PORT =
            new ConfigEntry<>(
                    Integer.class,
                    8080,
                    "The port the webserver should be served on");

    @ConfigProperty("ollama.address")
    public static ConfigEntry<String> OLLAMA_ADDRESS =
            new ConfigEntry<>(
                    String.class,
                    "http://localhost",
                    "The address where ollama is hosted. Usually you want to run it on the same sever as the webserver. Make sure to also include the protocol!");

    @ConfigProperty("ollama.port")
    public static ConfigEntry<Integer> OLLAMA_PORT =
            new ConfigEntry<>(
                    Integer.class,
                    11434,
                    "Your Ollama port. (Default: 11434).");

    @ConfigProperty("ollama.prompt.maxtokens")
    public static ConfigEntry<Integer> OLLAMA_MAX_TOKENS =
            new ConfigEntry<>(
                    Integer.class,
                    -1,
                    "Maximum amount of tokens for a response. Set to -1 for infinite.");

    @ConfigProperty("ollama.prompt.temperature")
    public static ConfigEntry<Double> OLLAMA_TEMPERATURE =
            new ConfigEntry<>(
                    Double.class,
                    0.5,
                    "The temperature of the model. Increasing the temperature will make the model answer more creatively. (Default: 0.5)");

    @ConfigProperty("ollama.prompt.bePredictable")
    public static ConfigEntry<Boolean> OLLAMA_PREDICTABLE =
            new ConfigEntry<>(
                    Boolean.class,
                    false,
                    "Defines whether the LLM should always give the same answer for the same question.");

    @ConfigProperty("ollama.prompt.top_p")
    public static ConfigEntry<Double> OLLAMA_TOP_P =
            new ConfigEntry<>(
                    Double.class,
                    0.7,
                    "A higher value (e.g., 0.95) will lead to more diverse text, while a lower value (e.g., 0.5) will generate more focused and conservative text.");
}
