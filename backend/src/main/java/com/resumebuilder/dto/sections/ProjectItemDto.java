package com.resumebuilder.dto.sections;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectItemDto {

    private String id;
    private String name;
    private String description;
    private List<String> technologies;
    private String url;
    private String startDate;
    private String endDate;
}
