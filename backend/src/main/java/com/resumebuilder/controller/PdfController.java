package com.resumebuilder.controller;

import com.resumebuilder.dto.ResumeDto;
import com.resumebuilder.dto.sections.PersonalInfoDto;
import com.resumebuilder.entity.User;
import com.resumebuilder.service.EmailService;
import com.resumebuilder.service.PdfExportService;
import com.resumebuilder.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "PDF Export", description = "Export resumes as PDF documents")
public class PdfController {

    private final ResumeService resumeService;
    private final PdfExportService pdfExportService;
    private final EmailService emailService;

    // ── Export PDF ────────────────────────────────────────────────────────────

    @GetMapping("/{id}/export/pdf")
    @Operation(summary = "Export resume as PDF")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "PDF generated successfully"),
            @ApiResponse(responseCode = "404", description = "Resume not found"),
            @ApiResponse(responseCode = "500", description = "PDF generation failed")
    })
    public ResponseEntity<byte[]> exportPdf(@PathVariable UUID id,
                                            @AuthenticationPrincipal User user) {
        try {
            ResumeDto resume = resumeService.getResumeById(id, user);
            byte[] pdfBytes = pdfExportService.exportToPdf(resume);
            String fileName = buildFileName(resume);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", fileName);
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (com.resumebuilder.exception.ResourceNotFoundException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("Failed to generate PDF for resume id={}", id, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ── Send PDF by Email ─────────────────────────────────────────────────────
    //
    // Two variants on the same path, dispatched by Content-Type:
    //   multipart/form-data  → frontend passes the client-rendered PDF (correct template)
    //   (anything else)      → fallback: server generates PDF (plain layout, kept for compat)

    @PostMapping(value = "/{id}/send-pdf-email", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Email a client-rendered resume PDF to the authenticated user")
    public ResponseEntity<Map<String, String>> sendPdfEmailRendered(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user,
            @RequestParam("pdf") MultipartFile pdfFile) {
        try {
            // Validate ownership (throws 404 if not found or not owned)
            ResumeDto resume = resumeService.getResumeById(id, user);

            byte[] pdfBytes = pdfFile.getBytes();
            String fileName = (pdfFile.getOriginalFilename() != null && !pdfFile.getOriginalFilename().isBlank())
                    ? pdfFile.getOriginalFilename()
                    : buildFileName(resume);

            emailService.sendResumeEmail(user.getEmail(), user.getFullName(), pdfBytes, fileName);

            log.info("Client-rendered resume PDF emailed to {} for resume id={}", user.getEmail(), id);
            return ResponseEntity.ok(Map.of("message", "Resume sent to " + user.getEmail()));
        } catch (com.resumebuilder.exception.ResourceNotFoundException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("Failed to email rendered PDF for resume id={}", id, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to send email. Please try again."));
        }
    }

    @PostMapping("/{id}/send-pdf-email")
    @Operation(summary = "Email the resume PDF to the authenticated user (server-side fallback)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Email sent"),
            @ApiResponse(responseCode = "404", description = "Resume not found"),
            @ApiResponse(responseCode = "500", description = "Failed to send email")
    })
    public ResponseEntity<Map<String, String>> sendPdfEmailFallback(@PathVariable UUID id,
                                                                     @AuthenticationPrincipal User user) {
        try {
            ResumeDto resume = resumeService.getResumeById(id, user);
            byte[] pdfBytes = pdfExportService.exportToPdf(resume);
            String fileName = buildFileName(resume);

            emailService.sendResumeEmail(user.getEmail(), user.getFullName(), pdfBytes, fileName);

            log.info("Server-generated resume PDF emailed to {} for resume id={}", user.getEmail(), id);
            return ResponseEntity.ok(Map.of("message", "Resume sent to " + user.getEmail()));
        } catch (com.resumebuilder.exception.ResourceNotFoundException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("Failed to email PDF for resume id={}", id, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to send email. Please try again."));
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String buildFileName(ResumeDto resume) {
        PersonalInfoDto info = resume.getSections() != null
                ? resume.getSections().getPersonalInfo()
                : null;
        if (info != null) {
            String first = info.getFirstName() != null ? info.getFirstName().trim() : "";
            String last  = info.getLastName()  != null ? info.getLastName().trim()  : "";
            String name  = (first + " " + last).trim();
            if (!name.isBlank()) {
                return name + " Resume.pdf";
            }
        }
        return "Resume.pdf";
    }
}
