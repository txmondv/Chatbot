package com.ij11.chatbot.config.infrastrcuture;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ConfigEntry<T> {
    private final Class<T> type;
    private final T defaultValue;
    private final String description;

    @SuppressWarnings("unchecked")
    public static <T> T parseValue(String rawValue, Class<?> type, Object defaultValue) {
        if (rawValue == null) return (T) defaultValue;
        try {
            if (type == Integer.class) return (T) Integer.valueOf(rawValue);
            if (type == Boolean.class) return (T) Boolean.valueOf(rawValue);
            if (type == Double.class) return (T) Double.valueOf(rawValue);
            return (T) rawValue;
        } catch (Exception e) {
            return (T) defaultValue;
        }
    }
}

