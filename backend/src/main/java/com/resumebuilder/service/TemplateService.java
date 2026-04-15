package com.resumebuilder.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumebuilder.dto.TemplateDto;
import com.resumebuilder.entity.Template;
import com.resumebuilder.exception.ResourceNotFoundException;
import com.resumebuilder.repository.TemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TemplateService {

    private final TemplateRepository templateRepository;
    private final ObjectMapper objectMapper;

    public List<TemplateDto> getAllActiveTemplates() {
        return templateRepository.findByActiveTrue().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public TemplateDto getTemplateById(String id) {
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template", "id", id));
        return toDto(template);
    }

    // --- Private helpers ---

    private TemplateDto toDto(Template template) {
        List<String> featureList = parseFeatures(template.getFeatures());
        return TemplateDto.builder()
                .id(template.getId())
                .name(template.getName())
                .description(template.getDescription())
                .category(template.getCategory())
                .features(featureList)
                .active(template.isActive())
                .build();
    }

    private List<String> parseFeatures(String featuresJson) {
        if (featuresJson == null || featuresJson.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(featuresJson, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            log.warn("Failed to parse template features JSON: {}", featuresJson, e);
            return Collections.emptyList();
        }
    }
}
