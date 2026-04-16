package com.resumebuilder.dto.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AiRewriteRequest {

    @NotBlank(message = "Content is required")
    @Size(max = 3000, message = "Content must be under 3000 characters")
    private String content;

    /** improve | stronger-verbs | concise | professional | tailor */
    @NotBlank(message = "Action is required")
    private String action;

    /** experience | summary | skills | projects */
    private String sectionType;

    /** Optional — only used when action is "tailor" */
    private String targetRole;
}
