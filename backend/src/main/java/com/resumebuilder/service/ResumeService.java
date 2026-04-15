package com.resumebuilder.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumebuilder.dto.CreateResumeRequest;
import com.resumebuilder.dto.ResumeDto;
import com.resumebuilder.dto.ResumeSectionsDto;
import com.resumebuilder.dto.UpdateResumeRequest;
import com.resumebuilder.entity.Resume;
import com.resumebuilder.entity.User;
import com.resumebuilder.exception.ResourceNotFoundException;
import com.resumebuilder.repository.ResumeRepository;
import com.resumebuilder.repository.TemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final TemplateRepository templateRepository;
    private final ObjectMapper objectMapper;

    public ResumeDto createResume(CreateResumeRequest request, User user) {
        templateRepository.findById(request.getTemplateId())
                .orElseThrow(() -> new ResourceNotFoundException("Template", "id", request.getTemplateId()));

        String sectionsJson = serializeSections(request.getSections());

        Resume resume = Resume.builder()
                .user(user)
                .title(request.getTitle())
                .templateId(request.getTemplateId())
                .sectionsData(sectionsJson)
                .build();

        Resume saved = resumeRepository.save(resume);
        log.info("Created resume id={} for user={}", saved.getId(), user.getEmail());
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public ResumeDto getResumeById(UUID id, User user) {
        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "id", id));
        return toDto(resume);
    }

    @Transactional(readOnly = true)
    public List<ResumeDto> getAllResumes(User user) {
        return resumeRepository.findByUserOrderByUpdatedAtDesc(user).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ResumeDto updateResume(UUID id, UpdateResumeRequest request, User user) {
        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "id", id));

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            resume.setTitle(request.getTitle());
        }

        if (request.getTemplateId() != null && !request.getTemplateId().isBlank()) {
            templateRepository.findById(request.getTemplateId())
                    .orElseThrow(() -> new ResourceNotFoundException("Template", "id", request.getTemplateId()));
            resume.setTemplateId(request.getTemplateId());
        }

        if (request.getSections() != null) {
            resume.setSectionsData(serializeSections(request.getSections()));
        }

        Resume saved = resumeRepository.save(resume);
        log.info("Updated resume id={} for user={}", saved.getId(), user.getEmail());
        return toDto(saved);
    }

    public void deleteResume(UUID id, User user) {
        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "id", id));
        resumeRepository.delete(resume);
        log.info("Deleted resume id={} for user={}", id, user.getEmail());
    }

    // --- Private helpers ---

    private ResumeDto toDto(Resume resume) {
        ResumeSectionsDto sections = deserializeSections(resume.getSectionsData());
        return ResumeDto.builder()
                .id(resume.getId())
                .title(resume.getTitle())
                .templateId(resume.getTemplateId())
                .sections(sections)
                .createdAt(resume.getCreatedAt())
                .updatedAt(resume.getUpdatedAt())
                .build();
    }

    private String serializeSections(ResumeSectionsDto sections) {
        if (sections == null) {
            sections = ResumeSectionsDto.builder()
                    .experience(new ArrayList<>())
                    .education(new ArrayList<>())
                    .skills(new ArrayList<>())
                    .projects(new ArrayList<>())
                    .build();
        }
        try {
            return objectMapper.writeValueAsString(sections);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize sections data", e);
            throw new RuntimeException("Failed to serialize resume sections", e);
        }
    }

    private ResumeSectionsDto deserializeSections(String json) {
        if (json == null || json.isBlank()) {
            return ResumeSectionsDto.builder()
                    .experience(new ArrayList<>())
                    .education(new ArrayList<>())
                    .skills(new ArrayList<>())
                    .projects(new ArrayList<>())
                    .build();
        }
        try {
            return objectMapper.readValue(json, ResumeSectionsDto.class);
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize sections data: {}", json, e);
            throw new RuntimeException("Failed to deserialize resume sections", e);
        }
    }
}
