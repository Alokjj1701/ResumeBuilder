package com.resumebuilder.dto.ai;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class AiBuildResumeRequest {

    private String firstName;
    private String lastName;

    /** fresher | junior | mid | senior | executive */
    @Size(max = 50)
    private String experienceLevel;

    @Size(max = 200)
    private String targetRole;

    private List<String> skills;

    private List<WorkHistoryInput> workHistory;

    private List<EducationInput> education;

    @Size(max = 3000)
    private String achievements;

    @Size(max = 12000)
    private String jobDescription;

    /** professional | technical | creative | executive */
    @Size(max = 50)
    private String tone;

    // ── Nested types ──────────────────────────────────────────────────────────

    @Data
    public static class WorkHistoryInput {
        private String company;
        private String title;
        /** Free-form duration, e.g. "Jan 2021 – Mar 2023" or "2 years" */
        private String duration;
        @Size(max = 1500)
        private String description;
    }

    @Data
    public static class EducationInput {
        private String institution;
        private String degree;
        /** Free-form year/range, e.g. "2018–2022" */
        private String year;
        private String gpa;
    }
}
