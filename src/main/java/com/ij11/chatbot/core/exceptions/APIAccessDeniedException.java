package com.ij11.chatbot.core.exceptions;

public class APIAccessDeniedException extends Exception{

    public APIAccessDeniedException(String reason) {
        super("[DENIED] " + reason);
    }

}
