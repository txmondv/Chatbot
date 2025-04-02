package com.ij11.chatbot.commands;

import com.ij11.chatbot.core.commands.CommandManager;
import com.ij11.chatbot.domain.models.users.UserRole;
import com.ij11.chatbot.service.users.UserInfoService;
import com.ij11.chatbot.service.users.UserRoleService;
import lombok.AllArgsConstructor;
import org.springframework.shell.standard.ShellComponent;
import org.springframework.shell.standard.ShellMethod;
import org.springframework.shell.standard.ShellOption;

@AllArgsConstructor
@ShellComponent
public class ManagementCommands {

    UserRoleService roleService;
    UserInfoService userService;

    @ShellMethod("Adds the manager role to the user")
    public void addManager(@ShellOption(help = "User to add the role to") String userName) {
        if(roleService.getRoles(userName).contains(UserRole.MANAGER)) {
            CommandManager.logCommandResult("Managers", "User \"" + userName + "\" is already a manager");
            return;
        }

        roleService.addRole(userName, UserRole.MANAGER);
        CommandManager.logCommandResult("Managers", "User \"" + userName + "\" is now a manager");
    }

    @ShellMethod("Removes the manager role from the user")
    public void removeManager(@ShellOption(help = "User to remove the role from") String userName) {
        if(!roleService.getRoles(userName).contains(UserRole.MANAGER)) {
            CommandManager.logCommandResult("Managers", "User \"" + userName + "\" is not a manager");
            return;
        }

        roleService.removeRole(userName, UserRole.MANAGER);
        CommandManager.logCommandResult("Managers", "User \"" + userName + "\" is no longer a manager");
    }
}
