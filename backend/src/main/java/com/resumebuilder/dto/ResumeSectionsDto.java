package com.resumebuilder.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.resumebuilder.dto.sections.*;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResumeSectionsDto {

    private PersonalInfoDto personalInfo;
    private String summary;
    private List<ExperienceItemDto> experience;
    private List<EducationItemDto> education;
    private List<SkillGroupDto> skills;
    private List<ProjectItemDto> projects;
}
