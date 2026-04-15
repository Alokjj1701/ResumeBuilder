package com.resumebuilder.exception;

import lombok.Getter;

@Getter
public class EmailNotVerifiedException extends RuntimeException {

    private final String email;

    public EmailNotVerifiedException(String email) {
        super("Please verify your email before signing in");
        this.email = email;
    }
}
