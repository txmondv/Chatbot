package com.ij11.chatbot.commands.containers;

import com.ij11.chatbot.commands.CommandManager;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.shell.standard.ShellComponent;
import org.springframework.shell.standard.ShellMethod;
import org.springframework.shell.standard.ShellOption;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@ShellComponent
public class APICommands {

    private RequestMappingHandlerMapping requestMappingHandlerMapping;

    @ShellMethod("Prints registered API routes, sorted by path")
    public void routes(@ShellOption(defaultValue = ShellOption.NULL, help = "Path under which the routes are registered") String path) {
        List<RouteInfo> routes = new ArrayList<>();

        requestMappingHandlerMapping.getHandlerMethods().keySet()
                .forEach(info -> {
                    Set<String> paths = info.getDirectPaths();
                    if (!paths.isEmpty() && !paths.stream().sorted().findFirst().orElse("").equals("/error")) {
                        String firstPath = paths.stream().sorted().findFirst().orElse(null);
                        if (path != null && !firstPath.startsWith(path)) return;
                        routes.add(new RouteInfo(info.getMethodsCondition().toString(), firstPath));
                    }
                });

        routes.sort(Comparator.comparing(RouteInfo::getPath));
        routes.forEach(route -> CommandManager.logCommandResult("Route", route.toString()));
    }

    @AllArgsConstructor
    @Getter
    private static class RouteInfo {
        private static final int minLength = 9;

        private String method;
        private String path;

        private String minLengthMethod(String method) {
            StringBuilder formattedMethod = new StringBuilder(method);
            while (formattedMethod.length() < minLength) formattedMethod.append(' ');
            return formattedMethod.toString();
        }

        @Override
        public String toString() {
            return String.format("%s %s", minLengthMethod(method), path);
        }
    }
}