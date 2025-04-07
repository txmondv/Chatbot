package com.ij11.chatbot.commands;

import com.ij11.chatbot.core.annotations.LoggingCommand;
import com.ij11.chatbot.core.commands.CommandManager;
import com.ij11.chatbot.core.configurations.ConfigManager;
import org.springframework.shell.standard.ShellComponent;
import org.springframework.shell.standard.ShellMethod;
import org.springframework.stereotype.Component;

import static com.ij11.chatbot.config.ServerUserConfig.WEBSERVER_PORT;

@ShellComponent
@Component
public class SystemCommands {

    @LoggingCommand
    @ShellMethod("Returns the port the server is running on")
    public void port() {
        CommandManager.logCommandResult("Port", WEBSERVER_PORT.get().toString());
    }

    @LoggingCommand
    @ShellMethod("Reloads configuration files. Attention: Some changes may not be applied until the server is restarted.")
    public void reloadConfig() {
        ConfigManager.loadAllConfigs();
        CommandManager.logCommandResult("reloadConfig", "Reloaded all configuration files");
    }

    @LoggingCommand
    @ShellMethod("Stops the server")
    public void stop() {
        System.exit(0);
    }
}
