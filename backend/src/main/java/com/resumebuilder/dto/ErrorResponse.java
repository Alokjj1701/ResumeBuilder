package com.resumebuilder.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class ErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private String email;           // set only for EmailNotVerifiedException (null otherwise → omitted by Jackson)
    private Boolean requiresVerification; // true only for unverified-email errors
}
