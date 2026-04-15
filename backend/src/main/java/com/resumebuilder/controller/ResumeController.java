package com.resumebuilder.controller;

import com.resumebuilder.dto.CreateResumeRequest;
import com.resumebuilder.dto.ResumeDto;
import com.resumebuilder.dto.UpdateResumeRequest;
import com.resumebuilder.entity.User;
import com.resumebuilder.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    @Operation(summary = "Create a new resume")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Resume created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request body or validation failure"),
            @ApiResponse(responseCode = "404", description = "Template not found")
    })
    public ResponseEntity<ResumeDto> createResume(
            @Valid @RequestBody CreateResumeRequest request,
            @AuthenticationPrincipal User user) {
        ResumeDto created = resumeService.createResume(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get resume by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resume found"),
            @ApiResponse(responseCode = "404", description = "Resume not found")
    })
    public ResponseEntity<ResumeDto> getResume(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        ResumeDto resume = resumeService.getResumeById(id, user);
        return ResponseEntity.ok(resume);
    }

    @GetMapping
    @Operation(summary = "Get all resumes for the authenticated user")
    @ApiResponse(responseCode = "200", description = "List of resumes")
    public ResponseEntity<List<ResumeDto>> getAllResumes(@AuthenticationPrincipal User user) {
        List<ResumeDto> resumes = resumeService.getAllResumes(user);
        return ResponseEntity.ok(resumes);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a resume")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resume updated successfully"),
            @ApiResponse(responseCode = "404", description = "Resume or template not found")
    })
    public ResponseEntity<ResumeDto> updateResume(
            @PathVariable UUID id,
            @RequestBody UpdateResumeRequest request,
            @AuthenticationPrincipal User user) {
        ResumeDto updated = resumeService.updateResume(id, request, user);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a resume")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Resume deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Resume not found")
    })
    public ResponseEntity<Void> deleteResume(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        resumeService.deleteResume(id, user);
        return ResponseEntity.noContent().build();
    }
}
