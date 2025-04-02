package com.ij11.chatbot.core.configurations;

import java.io.File;
import java.util.Properties;

import static com.ij11.chatbot.Chatbot.MAIN_LOGGER;
import static com.ij11.chatbot.core.configurations.ConfigManager.CONFIG_DIR;

public class ConfigEntryWithAccess<T> extends ConfigEntry<T> {
    private final String key;
    private final String configFile;

    public ConfigEntryWithAccess(Class<T> type, T defaultValue, String description, String key, String configFile) {
        super(type, defaultValue, description);
        this.key = key;
        this.configFile = configFile;
    }

    public T get() {
        Properties properties = ConfigManager.getLoadedConfigs().get(configFile);
        if (properties == null) return getDefaultValue();

        String rawValue = properties.getProperty(key);
        T value = parseValue(rawValue, getType(), getDefaultValue());

        if (rawValue == null) {
            MAIN_LOGGER.warn("Config '{}' is missing in '{}'. Writing default value: {}", key, configFile, getDefaultValue());
            properties.setProperty(key, String.valueOf(getDefaultValue()));
            ConfigManager.saveProperties(new File(CONFIG_DIR, configFile), key, getDescription(), getDefaultValue());
        } else if (!rawValue.equals(String.valueOf(value))) {
            MAIN_LOGGER.warn("Invalid value for '{}'. Expected '{}', found '{}'. Using default: {}", key, getType().getSimpleName(), rawValue, getDefaultValue());
        }

        return value;
    }
}