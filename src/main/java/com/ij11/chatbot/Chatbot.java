package com.ij11.chatbot;

import com.ij11.chatbot.core.configurations.ConfigManager;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

import java.time.LocalDate;
import java.util.Collections;

import static com.ij11.chatbot.config.ServerUserConfig.WEBSERVER_PORT;

@SpringBootApplication
@EnableAspectJAutoProxy
public class Chatbot {
	public static final Logger MAIN_LOGGER = LoggerFactory.getLogger(Chatbot.class);

	public static void main(String[] args) {
		String today = LocalDate.now().toString();
		System.setProperty("logging.file.name", "./logs/" + today + ".log");

		SpringApplication app = new SpringApplication(Chatbot.class);
		ConfigManager.loadAllConfigs();

		int webServerPort = WEBSERVER_PORT.get();
		app.setDefaultProperties(Collections.singletonMap("server.port", webServerPort));

		app.run(args);
	}

	@PostConstruct
	public void finishConstruction() {
		MAIN_LOGGER.info("Chatbot server bound to all interfaces on port {}", WEBSERVER_PORT.get());
	}
}
