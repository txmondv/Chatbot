package com.ij11.chatbot.core.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@RegisteredConfigFile
public @interface JsonConfigFile {
    String value();
    String description() default "";
}