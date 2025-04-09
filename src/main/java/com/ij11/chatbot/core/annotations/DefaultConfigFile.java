package com.ij11.chatbot.core.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to specify the default configuration file for a data config (e.g. TXT/JSON).
 * Must be located under /resources/config/.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface DefaultConfigFile {
    String value();
}
