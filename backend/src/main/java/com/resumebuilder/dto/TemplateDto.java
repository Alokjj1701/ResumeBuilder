package com.resumebuilder.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TemplateDto {

    private String id;
    private String name;
    private String description;
    private String category;
    private List<String> features;
    private boolean active;
}
