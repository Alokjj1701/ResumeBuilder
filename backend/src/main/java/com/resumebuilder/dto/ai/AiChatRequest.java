package com.resumebuilder.dto.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class AiChatRequest {

    @NotBlank(message = "Message is required")
    @Size(max = 2000, message = "Message must be under 2000 characters")
    private String message;

    /** Previous turns: [{role: "user"|"assistant", content: "..."}] */
    private List<Map<String, String>> history;

    /** Current resume sections — sent as context with every message */
    private Map<String, Object> sections;
}
