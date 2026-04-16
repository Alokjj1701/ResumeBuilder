package com.resumebuilder.dto.ai;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class AiGenerateSummaryRequest {

    /** experience array from the resume sections */
    private List<Map<String, Object>> experience;

    /** skills array from the resume sections */
    private List<Map<String, Object>> skills;

    /** optional target role to tailor summaries toward */
    @Size(max = 200)
    private String targetRole;
}
