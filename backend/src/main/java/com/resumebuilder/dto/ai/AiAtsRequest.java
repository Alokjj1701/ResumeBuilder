package com.resumebuilder.dto.ai;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class AiAtsRequest {

    @NotNull(message = "Resume sections are required")
    private Map<String, Object> sections;
}
