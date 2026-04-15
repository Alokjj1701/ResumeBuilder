package com.resumebuilder.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateResumeRequest {

    private String title;
    private String templateId;
    private ResumeSectionsDto sections;
}
