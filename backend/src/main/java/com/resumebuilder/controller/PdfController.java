package com.resumebuilder.controller;

import com.resumebuilder.dto.ResumeDto;
import com.resumebuilder.entity.User;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "PDF Export", description = "Export resumes as PDF documents")
public class PdfController {

    private final ResumeService resumeService;
    private final PdfExportService pdfExportService;

    @GetMapping("/{id}/export/pdf")
    @Operation(summary = "Export resume as PDF", description = "Generates and downloads a PDF version of the specified resume")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "PDF generated successfully"),
            @ApiResponse(responseCode = "404", description = "Resume not found"),
            @ApiResponse(responseCode = "500", description = "PDF generation failed")
    })
    public ResponseEntity<byte[]> exportPdf(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        try {
            ResumeDto resume = resumeService.getResumeById(id, user);
            byte[] pdfBytes = pdfExportService.exportToPdf(resume);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "resume-" + id + ".pdf");
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (com.resumebuilder.exception.ResourceNotFoundException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("Failed to generate PDF for resume id={}", id, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
