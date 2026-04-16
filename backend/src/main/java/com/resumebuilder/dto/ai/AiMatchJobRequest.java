package com.resumebuilder.dto.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Map;

@Data
public class AiMatchJobRequest {

    @NotNull(message = "Resume sections are required")
    private Map<String, Object> sections;

    @NotBlank(message = "Job description is required")
    @Size(max = 8000, message = "Job description must be under 8000 characters")
    private String jobDescription;
}
