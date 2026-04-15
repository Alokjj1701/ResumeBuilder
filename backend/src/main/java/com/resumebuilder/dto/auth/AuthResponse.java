package com.resumebuilder.dto.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private UserInfo user;

    @JsonIgnore  // Never serialized to client — controller puts this in an HttpOnly cookie
    private String refreshTokenValue;

    @Data
    @Builder
    public static class UserInfo {
        private UUID id;
        private String email;
        private String fullName;
        private boolean verified;
    }
}
