package com.resumebuilder.controller;

import com.resumebuilder.dto.CreateResumeRequest;
import com.resumebuilder.dto.ResumeDto;
import com.resumebuilder.dto.UpdateResumeRequest;
import com.resumebuilder.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@Tag(name = "Resumes", description = "Resume CRUD operations")
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping
    @Operation(summary = "Create a new resume", description = "Creates a new resume with the provided title, template, and optional sections data")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Resume created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request body or validation failure"),
            @ApiResponse(responseCode = "404", description = "Template not found")
    })
    public ResponseEntity<ResumeDto> createResume(@Valid @RequestBody CreateResumeRequest request) {
        ResumeDto created = resumeService.createResume(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get resume by ID", description = "Retrieves a single resume by its UUID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resume found"),
            @ApiResponse(responseCode = "404", description = "Resume not found")
    })
    public ResponseEntity<ResumeDto> getResume(@PathVariable UUID id) {
        ResumeDto resume = resumeService.getResumeById(id);
        return ResponseEntity.ok(resume);
    }

    @GetMapping
    @Operation(summary = "Get all resumes", description = "Returns all resumes sorted by last updated (newest first)")
    @ApiResponse(responseCode = "200", description = "List of resumes")
    public ResponseEntity<List<ResumeDto>> getAllResumes() {
        List<ResumeDto> resumes = resumeService.getAllResumes();
        return ResponseEntity.ok(resumes);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a resume", description = "Partially updates resume fields; only non-null fields are applied")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resume updated successfully"),
            @ApiResponse(responseCode = "404", description = "Resume or template not found")
    })
    public ResponseEntity<ResumeDto> updateResume(@PathVariable UUID id,
                                                   @RequestBody UpdateResumeRequest request) {
        ResumeDto updated = resumeService.updateResume(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a resume", description = "Permanently deletes the specified resume")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Resume deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Resume not found")
    })
    public ResponseEntity<Void> deleteResume(@PathVariable UUID id) {
        resumeService.deleteResume(id);
        return ResponseEntity.noContent().build();
    }
}
