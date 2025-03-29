package com.ij11.chatbot.config.infrastrcuture;

import com.ij11.chatbot.config.infrastrcuture.annotations.ConfigFile;
import com.ij11.chatbot.config.infrastrcuture.annotations.ConfigProperty;
import io.github.classgraph.ClassGraph;
import io.github.classgraph.ClassInfo;
import io.github.classgraph.ScanResult;

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
    private static final String CONFIG_DIR = "config";
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

        // Load properties from the file
        File file = new File(CONFIG_DIR, configFile);
        Properties properties = loadProperties(file);

        // Scan fields for @ConfigProperty
        for (Field field : configClass.getDeclaredFields()) {
            if (!field.isAnnotationPresent(ConfigProperty.class)) continue;
            ConfigProperty propertyAnnotation = field.getAnnotation(ConfigProperty.class);
            String key = propertyAnnotation.value();

            try {
                field.setAccessible(true);
                Object entryObject = field.get(null);
                if (entryObject instanceof ConfigEntry<?>) {
                    ConfigEntry<?> entry = (ConfigEntry<?>) entryObject;
                    String rawValue = properties.getProperty(key);
                    Object value = ConfigEntry.parseValue(rawValue, entry.getType(), entry.getDefaultValue());

                    if (rawValue == null) {
                        MAIN_LOGGER.warn("Config '{}' is missing in '{}'. Writing default value: {}", key, configFile, entry.getDefaultValue());
                        properties.setProperty(key, String.valueOf(entry.getDefaultValue()));
                        saveProperties(properties, file, key, entry.getDescription(), entry.getDefaultValue());
                    } else if (!rawValue.equals(String.valueOf(value))) {
                        MAIN_LOGGER.warn("Invalid value for '{}'. Expected '{}', found '{}'. Using default: {}", key, entry.getType().getSimpleName(), rawValue, entry.getDefaultValue());
                    }

                    // Store loaded properties
                    loadedConfigs.put(configFile, properties);
                }
            } catch (IllegalAccessException e) {
                MAIN_LOGGER.error("Failed to access config field: {}", field.getName(), e);
            }
        }
    }

    public static <T> T get(ConfigEntry<T> config, String key, String configFile) {
        Properties properties = loadedConfigs.get(configFile);
        if (properties == null) return config.getDefaultValue();

        return ConfigEntry.parseValue(properties.getProperty(key), config.getType(), config.getDefaultValue());
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

    private static void saveProperties(Properties properties, File file, String key, String description, Object defaultValue) {
        try (FileWriter writer = new FileWriter(file, true)) {
            writer.write("# " + description + "\n"); // Add description as a comment
            writer.write(key + "=" + defaultValue + "\n\n"); // Add key=value with a blank line after
        } catch (IOException e) {
            MAIN_LOGGER.error("Failed to save config file: {}", file.getPath(), e);
        }
    }
}