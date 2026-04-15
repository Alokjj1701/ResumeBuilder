package com.resumebuilder.dto.sections;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class EducationItemDto {

    private String id;
    private String institution;
    private String degree;
    private String fieldOfStudy;
    private String location;
    private String startDate;
    private String endDate;
    private String gpa;
    private String description;
}
