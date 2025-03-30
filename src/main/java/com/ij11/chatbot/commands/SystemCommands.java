package com.ij11.chatbot.commands;

import com.ij11.chatbot.config.commands.CommandManager;
import com.ij11.chatbot.config.ChatbotUserConfig;
import com.ij11.chatbot.config.infrastrcuture.ConfigManager;
import org.springframework.shell.standard.ShellComponent;
import org.springframework.shell.standard.ShellMethod;
import org.springframework.stereotype.Component;

@ShellComponent
@Component
public class SystemCommands {

    @ShellMethod("Returns the port the server is running on")
    public void port() {
        CommandManager.logCommandResult("Port", ChatbotUserConfig.getWebserverPort().toString());
    }

    @ShellMethod("Reloads configuration files. Attention: Some changes may not be applied until the server is restarted.")
    public void reloadConfig() {
        ConfigManager.loadAllConfigs();
        CommandManager.logCommandResult("reloadConfig", "Reloaded all configuration files");
    }

    @ShellMethod("Stops the server")
    public void stop() {
        System.exit(0);
    }
}
