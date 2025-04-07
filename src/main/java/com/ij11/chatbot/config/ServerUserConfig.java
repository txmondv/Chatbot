package com.ij11.chatbot.config;

import com.ij11.chatbot.core.annotations.ConfigFile;
import com.ij11.chatbot.core.annotations.ConfigProperty;
import com.ij11.chatbot.core.configurations.ConfigEntry;

@ConfigFile("server.properties")
public class ServerUserConfig {

    @ConfigProperty("webserver.port")
    public static ConfigEntry<Integer> WEBSERVER_PORT =
            new ConfigEntry<>(
                    Integer.class,
                    8080,
                    "The port the webserver should be served on");

    @ConfigProperty("webserver.logChatRequests")
    public static ConfigEntry<Boolean> LOG_CHAT_REQUESTS =
            new ConfigEntry<>(
                    Boolean.class,
                    false,
                    "Defines whether outgoing chat requests should be logged or not. This is useful for debugging purposes but can also leak sensitive information.");
}
