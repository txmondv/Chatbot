package com.ij11.chatbot;

import com.ij11.chatbot.config.ChatbotUserConfig;
import com.ij11.chatbot.config.infrastrcuture.ConfigManager;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalDate;
import java.util.Collections;

@SpringBootApplication
public class Chatbot {
	public static final Logger MAIN_LOGGER = LoggerFactory.getLogger(Chatbot.class);

	public static void main(String[] args) {
		String today = LocalDate.now().toString();
		System.setProperty("spring.shell.history.name", "./logs/" + today + ".log");
		System.setProperty("logging.file.name", "./logs/" + today + ".log");
		SpringApplication app = new SpringApplication(Chatbot.class);

		ConfigManager.loadAllConfigs();
		int webServerPort = ChatbotUserConfig.getWebserverPort();
		app.setDefaultProperties(Collections.singletonMap("server.port", webServerPort));

		app.run(args);
	}

	@PostConstruct
	public void finishConstruction() {
		MAIN_LOGGER.info("Chatbot server bound to all interfaces on port {}", ChatbotUserConfig.getWebserverPort());
	}
}
