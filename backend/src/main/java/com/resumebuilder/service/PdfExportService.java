package com.resumebuilder.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.resumebuilder.dto.ResumeDto;
import com.resumebuilder.dto.ResumeSectionsDto;
import com.resumebuilder.dto.sections.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@Slf4j
public class PdfExportService {

    private static final Color COLOR_HEADING = new Color(30, 30, 30);
    private static final Color COLOR_SECTION = new Color(44, 62, 80);
    private static final Color COLOR_BODY = new Color(60, 60, 60);
    private static final Color COLOR_ITALIC = new Color(90, 90, 90);
    private static final Color COLOR_SMALL = new Color(100, 100, 100);
    private static final Color COLOR_SEPARATOR = new Color(200, 200, 200);
    private static final Color COLOR_ACCENT = new Color(52, 152, 219);

    public byte[] exportToPdf(ResumeDto resume) throws DocumentException, IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 54, 36);
        PdfWriter.getInstance(document, out);
        document.open();

        ResumeSectionsDto sections = resume.getSections();
        PersonalInfoDto info = (sections != null) ? sections.getPersonalInfo() : null;

        // Fonts
        Font nameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, COLOR_HEADING);
        Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, COLOR_SECTION);
        Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10, COLOR_BODY);
        Font boldBodyFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, COLOR_BODY);
        Font italicFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, COLOR_ITALIC);
        Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 9, COLOR_SMALL);
        Font contactFont = FontFactory.getFont(FontFactory.HELVETICA, 10, COLOR_SMALL);

        // ---- NAME HEADER ----
        if (info != null) {
            String fullName = buildFullName(info);
            if (!fullName.isBlank()) {
                Paragraph nameParagraph = new Paragraph(fullName, nameFont);
                nameParagraph.setAlignment(Element.ALIGN_CENTER);
                nameParagraph.setSpacingAfter(4);
                document.add(nameParagraph);
            }

            // Contact line
            String contactLine = buildContactLine(info);
            if (!contactLine.isBlank()) {
                Paragraph contactParagraph = new Paragraph(contactLine, contactFont);
                contactParagraph.setAlignment(Element.ALIGN_CENTER);
                contactParagraph.setSpacingAfter(2);
                document.add(contactParagraph);
            }

            // Links line (website, linkedin, github)
            String linksLine = buildLinksLine(info);
            if (!linksLine.isBlank()) {
                Paragraph linksParagraph = new Paragraph(linksLine, contactFont);
                linksParagraph.setAlignment(Element.ALIGN_CENTER);
                linksParagraph.setSpacingAfter(8);
                document.add(linksParagraph);
            }
        } else {
            // Fallback: use resume title as heading
            Paragraph titleParagraph = new Paragraph(resume.getTitle(), nameFont);
            titleParagraph.setAlignment(Element.ALIGN_CENTER);
            titleParagraph.setSpacingAfter(8);
            document.add(titleParagraph);
        }

        // Horizontal rule under header
        LineSeparator headerRule = new LineSeparator(1.5f, 100, COLOR_ACCENT, Element.ALIGN_CENTER, -2);
        document.add(new Chunk(headerRule));
        document.add(Chunk.NEWLINE);

        if (sections == null) {
            document.close();
            return out.toByteArray();
        }

        // ---- SUMMARY ----
        if (sections.getSummary() != null && !sections.getSummary().isBlank()) {
            addSectionHeader(document, "Summary", sectionFont);
            Paragraph summaryParagraph = new Paragraph(sections.getSummary(), bodyFont);
            summaryParagraph.setSpacingAfter(6);
            summaryParagraph.setLeading(14);
            document.add(summaryParagraph);
        }

        // ---- EXPERIENCE ----
        List<ExperienceItemDto> experience = sections.getExperience();
        if (experience != null && !experience.isEmpty()) {
            addSectionHeader(document, "Experience", sectionFont);
            for (ExperienceItemDto exp : experience) {
                addExperienceEntry(document, exp, boldBodyFont, italicFont, bodyFont, smallFont);
            }
        }

        // ---- EDUCATION ----
        List<EducationItemDto> education = sections.getEducation();
        if (education != null && !education.isEmpty()) {
            addSectionHeader(document, "Education", sectionFont);
            for (EducationItemDto edu : education) {
                addEducationEntry(document, edu, boldBodyFont, italicFont, bodyFont, smallFont);
            }
        }

        // ---- SKILLS ----
        List<SkillGroupDto> skills = sections.getSkills();
        if (skills != null && !skills.isEmpty()) {
            addSectionHeader(document, "Skills", sectionFont);
            for (SkillGroupDto skillGroup : skills) {
                addSkillGroupEntry(document, skillGroup, boldBodyFont, bodyFont);
            }
        }

        // ---- PROJECTS ----
        List<ProjectItemDto> projects = sections.getProjects();
        if (projects != null && !projects.isEmpty()) {
            addSectionHeader(document, "Projects", sectionFont);
            for (ProjectItemDto project : projects) {
                addProjectEntry(document, project, boldBodyFont, italicFont, bodyFont, smallFont);
            }
        }

        document.close();
        log.info("Generated PDF for resume id={}", resume.getId());
        return out.toByteArray();
    }

    // --- Section header with separator line ---

    private void addSectionHeader(Document document, String title, Font sectionFont) throws DocumentException {
        Paragraph header = new Paragraph(title.toUpperCase(), sectionFont);
        header.setSpacingBefore(14);
        header.setSpacingAfter(4);
        document.add(header);
        LineSeparator separator = new LineSeparator(0.75f, 100, COLOR_SEPARATOR, Element.ALIGN_CENTER, -2);
        document.add(new Chunk(separator));
        document.add(Chunk.NEWLINE);
    }

    // --- Experience entry ---

    private void addExperienceEntry(Document document, ExperienceItemDto exp,
                                    Font boldBodyFont, Font italicFont, Font bodyFont, Font smallFont)
            throws DocumentException {

        if (exp == null) return;

        // Title and company on one line
        String jobTitle = nullToEmpty(exp.getTitle());
        String company = nullToEmpty(exp.getCompany());
        String location = nullToEmpty(exp.getLocation());

        Paragraph titleLine = new Paragraph();
        titleLine.setSpacingBefore(6);
        if (!jobTitle.isBlank()) {
            titleLine.add(new Chunk(jobTitle, boldBodyFont));
        }
        if (!company.isBlank()) {
            titleLine.add(new Chunk(jobTitle.isBlank() ? company : " — " + company, italicFont));
        }
        if (!location.isBlank()) {
            titleLine.add(new Chunk("  |  " + location, smallFont));
        }
        document.add(titleLine);

        // Date range
        String dateRange = buildDateRange(exp.getStartDate(), exp.isCurrent() ? "Present" : exp.getEndDate());
        if (!dateRange.isBlank()) {
            Paragraph dateParagraph = new Paragraph(dateRange, smallFont);
            dateParagraph.setSpacingAfter(2);
            document.add(dateParagraph);
        }

        // Description
        if (exp.getDescription() != null && !exp.getDescription().isBlank()) {
            Paragraph descParagraph = new Paragraph(exp.getDescription(), bodyFont);
            descParagraph.setLeading(13);
            descParagraph.setSpacingAfter(4);
            document.add(descParagraph);
        }
    }

    // --- Education entry ---

    private void addEducationEntry(Document document, EducationItemDto edu,
                                   Font boldBodyFont, Font italicFont, Font bodyFont, Font smallFont)
            throws DocumentException {

        if (edu == null) return;

        String institution = nullToEmpty(edu.getInstitution());
        String degree = nullToEmpty(edu.getDegree());
        String field = nullToEmpty(edu.getFieldOfStudy());
        String location = nullToEmpty(edu.getLocation());

        Paragraph titleLine = new Paragraph();
        titleLine.setSpacingBefore(6);
        if (!institution.isBlank()) {
            titleLine.add(new Chunk(institution, boldBodyFont));
        }
        if (!location.isBlank()) {
            titleLine.add(new Chunk("  |  " + location, smallFont));
        }
        document.add(titleLine);

        // Degree and field
        String degreeField = buildDegreeField(degree, field);
        if (!degreeField.isBlank()) {
            Paragraph degreeParagraph = new Paragraph(degreeField, italicFont);
            degreeParagraph.setSpacingAfter(2);
            document.add(degreeParagraph);
        }

        // Date range + GPA
        String dateRange = buildDateRange(edu.getStartDate(), edu.getEndDate());
        String gpa = nullToEmpty(edu.getGpa());
        String dateLine = dateRange + ((!dateRange.isBlank() && !gpa.isBlank()) ? "   GPA: " + gpa : (!gpa.isBlank() ? "GPA: " + gpa : ""));
        if (!dateLine.isBlank()) {
            Paragraph dateParagraph = new Paragraph(dateLine, smallFont);
            dateParagraph.setSpacingAfter(2);
            document.add(dateParagraph);
        }

        // Description
        if (edu.getDescription() != null && !edu.getDescription().isBlank()) {
            Paragraph descParagraph = new Paragraph(edu.getDescription(), bodyFont);
            descParagraph.setLeading(13);
            descParagraph.setSpacingAfter(4);
            document.add(descParagraph);
        }
    }

    // --- Skill group entry ---

    private void addSkillGroupEntry(Document document, SkillGroupDto skillGroup,
                                    Font boldBodyFont, Font bodyFont) throws DocumentException {

        if (skillGroup == null) return;

        String category = nullToEmpty(skillGroup.getCategory());
        List<String> items = skillGroup.getItems();

        if (items == null || items.isEmpty()) return;

        String itemsText = String.join(", ", items);

        Paragraph skillParagraph = new Paragraph();
        skillParagraph.setSpacingBefore(4);
        skillParagraph.setSpacingAfter(2);
        if (!category.isBlank()) {
            skillParagraph.add(new Chunk(category + ": ", boldBodyFont));
        }
        skillParagraph.add(new Chunk(itemsText, bodyFont));
        document.add(skillParagraph);
    }

    // --- Project entry ---

    private void addProjectEntry(Document document, ProjectItemDto project,
                                 Font boldBodyFont, Font italicFont, Font bodyFont, Font smallFont)
            throws DocumentException {

        if (project == null) return;

        String name = nullToEmpty(project.getName());
        String url = nullToEmpty(project.getUrl());

        Paragraph titleLine = new Paragraph();
        titleLine.setSpacingBefore(6);
        if (!name.isBlank()) {
            titleLine.add(new Chunk(name, boldBodyFont));
        }
        if (!url.isBlank()) {
            titleLine.add(new Chunk("  " + url, smallFont));
        }
        document.add(titleLine);

        // Technologies
        List<String> technologies = project.getTechnologies();
        if (technologies != null && !technologies.isEmpty()) {
            Paragraph techParagraph = new Paragraph("Technologies: " + String.join(", ", technologies), italicFont);
            techParagraph.setSpacingAfter(2);
            document.add(techParagraph);
        }

        // Date range
        String dateRange = buildDateRange(project.getStartDate(), project.getEndDate());
        if (!dateRange.isBlank()) {
            Paragraph dateParagraph = new Paragraph(dateRange, smallFont);
            dateParagraph.setSpacingAfter(2);
            document.add(dateParagraph);
        }

        // Description
        if (project.getDescription() != null && !project.getDescription().isBlank()) {
            Paragraph descParagraph = new Paragraph(project.getDescription(), bodyFont);
            descParagraph.setLeading(13);
            descParagraph.setSpacingAfter(4);
            document.add(descParagraph);
        }
    }

    // --- Utility methods ---

    private String buildFullName(PersonalInfoDto info) {
        String first = nullToEmpty(info.getFirstName());
        String last = nullToEmpty(info.getLastName());
        if (!first.isBlank() && !last.isBlank()) return first + " " + last;
        if (!first.isBlank()) return first;
        return last;
    }

    private String buildContactLine(PersonalInfoDto info) {
        StringBuilder sb = new StringBuilder();
        appendIfNotBlank(sb, info.getEmail(), " | ");
        appendIfNotBlank(sb, info.getPhone(), " | ");
        appendIfNotBlank(sb, info.getLocation(), " | ");
        return sb.toString().replaceAll("^\\s*\\|\\s*", "").replaceAll("\\s*\\|\\s*$", "");
    }

    private String buildLinksLine(PersonalInfoDto info) {
        StringBuilder sb = new StringBuilder();
        appendIfNotBlank(sb, info.getWebsite(), " | ");
        appendIfNotBlank(sb, info.getLinkedin(), " | ");
        appendIfNotBlank(sb, info.getGithub(), " | ");
        return sb.toString().replaceAll("^\\s*\\|\\s*", "").replaceAll("\\s*\\|\\s*$", "");
    }

    private void appendIfNotBlank(StringBuilder sb, String value, String separator) {
        if (value != null && !value.isBlank()) {
            if (sb.length() > 0) sb.append(separator);
            sb.append(value.trim());
        }
    }

    private String buildDateRange(String start, String end) {
        String s = nullToEmpty(start);
        String e = nullToEmpty(end);
        if (!s.isBlank() && !e.isBlank()) return s + " – " + e;
        if (!s.isBlank()) return s;
        if (!e.isBlank()) return e;
        return "";
    }

    private String buildDegreeField(String degree, String field) {
        if (!degree.isBlank() && !field.isBlank()) return degree + " in " + field;
        if (!degree.isBlank()) return degree;
        return field;
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value.trim();
    }
}
