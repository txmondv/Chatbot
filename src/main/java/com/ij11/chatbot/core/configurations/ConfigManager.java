package com.ij11.chatbot.core.configurations;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ij11.chatbot.core.annotations.*;
import io.github.classgraph.ClassGraph;
import io.github.classgraph.ClassInfo;
import io.github.classgraph.ScanResult;
import lombok.Getter;
import org.springframework.core.io.ClassPathResource;

import java.io.*;
import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;

import static com.ij11.chatbot.Chatbot.MAIN_LOGGER;

public class ConfigManager {
    public static final String CONFIG_DIR = "config";
    @Getter
    private static Map<String, Properties> loadedConfigs = new HashMap<>();

    public static void loadAllConfigs() {
        loadedConfigs = new HashMap<>();
        try (ScanResult scanResult = new ClassGraph().enableAnnotationInfo().scan()) {
            for (ClassInfo classInfo : scanResult.getClassesWithAnnotation(RegisteredConfigFile.class.getName())) {
                loadConfigs(Class.forName(classInfo.getName()));
            }
        } catch (Exception e) {
            MAIN_LOGGER.error("Failed to scan for config classes", e);
        }
    }

    public static void loadConfigs(Class<?>... configClasses) {
        for (Class<?> configClass : configClasses) {
            if (configClass.isAnnotationPresent(ConfigFile.class)) {
                loadPropertiesConfig(configClass);
            } else if (configClass.isAnnotationPresent(TextConfigFile.class)) {
                loadTextConfig(configClass);
            } else if (configClass.isAnnotationPresent(JsonConfigFile.class)) {
                loadJsonConfig(configClass);
            }
        }
    }

    private static void loadPropertiesConfig(Class<?> configClass) {
        ConfigFile configFileAnnotation = configClass.getAnnotation(ConfigFile.class);
        if (configFileAnnotation == null) return;
        String configFile = configFileAnnotation.value();

        File file = new File(CONFIG_DIR, configFile);
        Properties properties = loadProperties(file);

        for (Field field : configClass.getDeclaredFields()) {
            if (!field.isAnnotationPresent(ConfigProperty.class)) continue;
            ConfigProperty propertyAnnotation = field.getAnnotation(ConfigProperty.class);
            String key = propertyAnnotation.value();

            try {
                field.setAccessible(true);
                Object entryObject = field.get(null);
                if (entryObject instanceof ConfigEntry<?> entry) {
                    String rawValue = properties.getProperty(key);
                    Object value = ConfigEntry.parseValue(rawValue, entry.getType(), entry.getDefaultValue());

                    if (rawValue == null) {
                        MAIN_LOGGER.warn("Config '{}' is missing in '{}'. Writing default value: {}", key, configFile, entry.getDefaultValue());
                        properties.setProperty(key, String.valueOf(entry.getDefaultValue()));
                        saveProperties(new File(CONFIG_DIR, configFile), key, entry.getDescription(), entry.getDefaultValue());
                    } else if (!rawValue.equals(String.valueOf(value))) {
                        MAIN_LOGGER.warn("Invalid value for '{}'. Expected '{}', found '{}'. Using default: {}", key, entry.getType().getSimpleName(), rawValue, entry.getDefaultValue());
                    }

                    field.set(null, createConfigEntryWithAccess(entry, key, configFile));
                    loadedConfigs.put(configFile, properties);
                }
            } catch (IllegalAccessException e) {
                MAIN_LOGGER.error("Failed to access config field: {}", field.getName(), e);
            }
        }
    }

    private static String getDefaultFile(Class<?> configClass) {
        DefaultConfigFile defaultConfigFileAnnotation = configClass.getAnnotation(DefaultConfigFile.class);
        if (defaultConfigFileAnnotation != null) {
            return defaultConfigFileAnnotation.value();
        }
        return "";
    }

    private static void loadTextConfig(Class<?> configClass) {
        TextConfigFile configFileAnnotation = configClass.getAnnotation(TextConfigFile.class);
        String configFile = configFileAnnotation.value();
        try {
            String fileContent = loadFileContent(
                    configFile,
                    getDefaultFile(configClass)
            );
            for (Field field : configClass.getDeclaredFields()) {
                if (field.isAnnotationPresent(DataConfigContent.class)) {
                    field.setAccessible(true);
                    field.set(null, fileContent);
                }
            }
        } catch (IllegalAccessException e) {
            MAIN_LOGGER.error("Failed to load text config file: {}", configFile, e);
        }
    }

    private static void loadJsonConfig(Class<?> configClass) {
        JsonConfigFile configFileAnnotation = configClass.getAnnotation(JsonConfigFile.class);
        String configFile = configFileAnnotation.value();
        try {
            String fileContent = loadFileContent(
                    configFile,
                    getDefaultFile(configClass)
            );
            if(Objects.equals(fileContent, "")) fileContent = "{}";
            ObjectMapper objectMapper = new ObjectMapper();
            Object jsonContent = objectMapper.readValue(fileContent, Object.class);
            for (Field field : configClass.getDeclaredFields()) {
                if (field.isAnnotationPresent(DataConfigContent.class)) {
                    field.setAccessible(true);
                    field.set(null, jsonContent);
                }
            }
        } catch (IOException | IllegalAccessException e) {
            MAIN_LOGGER.error("Failed to load JSON config file: {}", configFile, e);
        }
    }

    private static File ensureFileExists(File file, String defaultFilePath) {
        if (!file.exists()) {
            file.getParentFile().mkdirs();
            try {
                if (defaultFilePath != null && !defaultFilePath.isEmpty()) {
                    ClassPathResource resource = new ClassPathResource("config/" + defaultFilePath);
                    if (resource.exists()) {
                        try (InputStream in = resource.getInputStream()) {
                            Files.copy(in, file.toPath(), StandardCopyOption.REPLACE_EXISTING);
                        }
                    } else {
                        MAIN_LOGGER.warn("Default classpath resource does not exist: {}", defaultFilePath);
                        file.createNewFile();
                    }
                } else {
                    file.createNewFile();
                }
            } catch (IOException e) {
                MAIN_LOGGER.error("Failed to create file: {}", file.getPath(), e);
            }
        }
        return file;
    }


    private static String loadFileContent(String filePath, String defaultFilePath) {
        File file = ensureFileExists(new File(CONFIG_DIR, filePath), defaultFilePath);

        String content = "";
        try {
            content = Files.readString(file.toPath(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            MAIN_LOGGER.error("Failed to read data config file: {}", file.getPath(), e);
        }

        return content;
    }

    private static Properties loadProperties(File file) {
        Properties properties = new Properties();
        ensureFileExists(file, "");

        try (FileInputStream input = new FileInputStream(file)) {
            properties.load(input);
        } catch (IOException e) {
            MAIN_LOGGER.error("Failed to load config file: {}", file.getPath(), e);
        }

        return properties;
    }

    public static void saveProperties(File file, String key, String description, Object defaultValue) {
        try (FileWriter writer = new FileWriter(file, true)) {
            for (String line : description.split("\n")) writer.write("# " + line + "\n");

            String valueString;
            if (!(defaultValue instanceof String)) {
                ObjectMapper objectMapper = new ObjectMapper();
                valueString = objectMapper.writeValueAsString(defaultValue);
            } else {
                valueString = String.valueOf(defaultValue);
            }

            writer.write(key + "=" + valueString + "\n\n");
        } catch (IOException e) {
            MAIN_LOGGER.error("Failed to save config file: {}", file.getPath(), e);
        }
    }

    private static <T> ConfigEntryWithAccess<T> createConfigEntryWithAccess(ConfigEntry<T> entry, String key, String configFile) {
        return new ConfigEntryWithAccess<>(
                entry.getType(),
                entry.getDefaultValue(),
                entry.getDescription(),
                key,
                configFile
        );
    }
}