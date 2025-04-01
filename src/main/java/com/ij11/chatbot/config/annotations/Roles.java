package com.ij11.chatbot.config.annotations;

import com.ij11.chatbot.models.users.UserRole;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Roles {
    UserRole[] value();
}