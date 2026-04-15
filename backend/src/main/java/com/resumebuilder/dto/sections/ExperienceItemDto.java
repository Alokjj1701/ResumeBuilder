package com.resumebuilder.dto.sections;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExperienceItemDto {

    private String id;
    private String company;
    private String title;
    private String location;
    private String startDate;
    private String endDate;
    private boolean current;
    private String description;
}
