package com.ij11.chatbot.core.configurations;

import java.util.Properties;

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
        return parseValue(properties.getProperty(key), getType(), getDefaultValue());
    }
}