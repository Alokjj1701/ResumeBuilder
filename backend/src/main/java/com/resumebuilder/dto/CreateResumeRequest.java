package com.resumebuilder.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateResumeRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Template ID is required")
    private String templateId;

    private ResumeSectionsDto sections;

    public ResumeSectionsDto getSections() {
        if (sections == null) {
            return ResumeSectionsDto.builder()
                    .experience(new java.util.ArrayList<>())
                    .education(new java.util.ArrayList<>())
                    .skills(new java.util.ArrayList<>())
                    .projects(new java.util.ArrayList<>())
                    .build();
        }
        return sections;
    }
}
