package com.ij11.chatbot.commands;

import com.ij11.chatbot.commands.workers.ChatContentGenerationWorker;
import com.ij11.chatbot.commands.workers.UserGenerationWorker;
import com.ij11.chatbot.core.annotations.LoggingCommand;
import com.ij11.chatbot.core.commands.CommandManager;
import com.ij11.chatbot.domain.models.chat.Chat;
import com.ij11.chatbot.domain.models.chat.ChatMessage;
import com.ij11.chatbot.domain.models.chat.ChatMessageOrigin;
import com.ij11.chatbot.domain.models.users.User;
import com.ij11.chatbot.domain.repositories.ChatMessageRepository;
import com.ij11.chatbot.domain.repositories.ChatRepository;
import com.ij11.chatbot.service.users.UserInfoService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.shell.standard.ShellComponent;
import org.springframework.shell.standard.ShellMethod;
import org.springframework.shell.standard.ShellOption;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.Optional;

@AllArgsConstructor
@ShellComponent
public class TestingCommands {

    private final UserGenerationWorker userGenerationWorker;
    private final ChatContentGenerationWorker chatContentGenerationWorker;
    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserInfoService userInfoService;

    @LoggingCommand
    @ShellMethod("Sends some prebuilt chats to the chat service")
    @Transactional
    public void simulateChats(
            @ShellOption(help = "Amount of chats to generate") Integer amount,
            @ShellOption(help = "Name of the user to generate the chats for") String user,
            @ShellOption(defaultValue = "llama3.2:latest", help = "Model to use for the chats") String model
    ) {
        Optional<User> userOpt = userInfoService.getUserByName(user);
        if (userOpt.isEmpty()) {
            CommandManager.logCommandResult("MSGGEN", "User with name \"" + user + "\" not found.");
            return;
        }

        chatContentGenerationWorker.processRequests(
                amount,
                userOpt.get(),
                model
        );
    }

    @LoggingCommand
    @ShellMethod("Let the model talk to itself")
    @Transactional
    public void selfTalk(
            @ShellOption(help = "Amount of messages to exchange") Integer iterations,
            @ShellOption(help = "Name of the user the LLM should imitate") String user,
            @ShellOption(defaultValue = "llama3.2:latest", help = "Model to use for the chat") String model,
            @ShellOption(defaultValue = "I am not quite sure what to talk about. You choose the topic!", help = "Initial Topic the LLM should talk about") String initialPrompt
    ) {
        Optional<User> userOpt = userInfoService.getUserByName(user);
        if (userOpt.isEmpty()) {
            CommandManager.logCommandResult("MSGGEN", "User with name \"" + user + "\" not found.");
            return;
        }

        chatContentGenerationWorker.selfTalk(
                userOpt.get(),
                model,
                initialPrompt,
                iterations
        );
    }


    @LoggingCommand
    @ShellMethod("Generate some users to populate the database")
    @Transactional
    public void insertMessageAt(
            @ShellOption(help = "Chat to insert at, preferably an empty chat.") Long chatId,
            @ShellOption(help = "Content for the message") String message,
            @ShellOption(help = "Time to insert the message at. (ISO_LOCAL_DATE_TIME format)") String timestamp,
            @ShellOption(defaultValue = "USER", help = "USER or LLM") ChatMessageOrigin sender
    ) {
        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        if (chatOpt.isEmpty()) {
            CommandManager.logCommandResult("MSGGEN", "Chat with ID " + chatId + " not found.");
            return;
        }

        Chat chat = chatOpt.get();

        LocalDateTime time = null;
        try {
            time = LocalDateTime.parse(timestamp);
        } catch (DateTimeParseException e) {
            CommandManager.logCommandResult("MSGGEN", "Invalid timestamp format. Use ISO_LOCAL_DATE_TIME format, e.g. 2025-04-05T12:34:56");
        }

        if(time == null) return;
        ChatMessage messageEntity = new ChatMessage(null, chat, sender, message, time);
        chatMessageRepository.save(messageEntity);
        CommandManager.logCommandResult("MSGGEN", "Inserted message \"" + message + "\" at " + time + " into chat with ID " + chatId);
    }

    @LoggingCommand
    @ShellMethod("Generates some users to populate the database")
    public void generateUsers(
            @ShellOption(defaultValue = "10", help = "Amount of users to generate") Integer amount,
            @ShellOption(defaultValue = "hello", help = "Password for the user account") String password
    ) throws IOException {
        int successfulGenerations = userGenerationWorker.generateUsers(
                amount,
                password,
                user -> CommandManager.logCommandResult("Generator",
                        "Generated new user with name \"" + user.getUsername() + "\" and ID " + user.getId()),
                name -> CommandManager.logCommandResult("Generator", "User with name \"" + name + "\" already exists."));


        CommandManager.logCommandResult("Generator",
                "Generated " + successfulGenerations + " users with password \"" + password + "\" (" + (amount - successfulGenerations) + " failed)");
    }

}
