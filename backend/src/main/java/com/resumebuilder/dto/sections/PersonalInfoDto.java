package com.resumebuilder.dto.sections;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class PersonalInfoDto {

    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String location;
    private String website;
    private String linkedin;
    private String github;
    private String photo;
}
