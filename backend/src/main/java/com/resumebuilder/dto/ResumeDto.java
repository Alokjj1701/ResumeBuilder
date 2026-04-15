package com.resumebuilder.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResumeDto {

    private UUID id;
    private String title;
    private String templateId;
    private ResumeSectionsDto sections;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
