package com.ij11.chatbot.core.configurations;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ij11.chatbot.core.annotations.ConfigFile;
import com.ij11.chatbot.core.annotations.ConfigProperty;
import io.github.classgraph.ClassGraph;
import io.github.classgraph.ClassInfo;
import io.github.classgraph.ScanResult;
import lombok.Getter;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import static com.ij11.chatbot.Chatbot.MAIN_LOGGER;

public class ConfigManager {
    public static final String CONFIG_DIR = "config";
    @Getter
    private static Map<String, Properties> loadedConfigs = new HashMap<>();

    public static void loadAllConfigs() {
        loadedConfigs = new HashMap<>();
        try (ScanResult scanResult = new ClassGraph().enableAnnotationInfo().scan()) {
            for (ClassInfo classInfo : scanResult.getClassesWithAnnotation(ConfigFile.class.getName())) {
                Class<?> configClass = Class.forName(classInfo.getName());
                registerConfigClass(configClass);
            }
        } catch (Exception e) {
            MAIN_LOGGER.error("Failed to scan for config classes", e);
        }
    }

    private static void registerConfigClass(Class<?> configClass) {
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

    private static <T> ConfigEntryWithAccess<T> createConfigEntryWithAccess(ConfigEntry<T> entry, String key, String configFile) {
        return new ConfigEntryWithAccess<>(
                entry.getType(),
                entry.getDefaultValue(),
                entry.getDescription(),
                key,
                configFile
        );
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

    private static Properties loadProperties(File file) {
        Properties properties = new Properties();
        if (!file.exists()) {
            file.getParentFile().mkdirs();
            try {
                file.createNewFile();
            } catch (IOException e) {
                MAIN_LOGGER.error("Failed to create config file: {}", file.getPath(), e);
            }
        }

        try (FileInputStream input = new FileInputStream(file)) {
            properties.load(input);
        } catch (IOException e) {
            MAIN_LOGGER.error("Failed to load config file: {}", file.getPath(), e);
        }

        return properties;
    }
}