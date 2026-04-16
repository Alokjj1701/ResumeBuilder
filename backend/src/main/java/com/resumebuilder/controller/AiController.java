package com.resumebuilder.controller;

import com.resumebuilder.dto.ai.AiAtsRequest;
import com.resumebuilder.dto.ai.AiBuildResumeRequest;
import com.resumebuilder.dto.ai.AiChatRequest;
import com.resumebuilder.dto.ai.AiGenerateSummaryRequest;
import com.resumebuilder.dto.ai.AiMatchJobRequest;
import com.resumebuilder.dto.ai.AiRewriteRequest;
import com.resumebuilder.service.AiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
public class AiController {

    private final AiService aiService;

    // ── Rewrite ───────────────────────────────────────────────────────────────
    // POST /api/ai/rewrite
    // Rewrites a single piece of text (bullet, summary, etc.) per the requested action.

    @PostMapping("/rewrite")
    public ResponseEntity<Map<String, String>> rewrite(
            @Valid @RequestBody AiRewriteRequest request) {

        log.info("AI rewrite: action={} section={}", request.getAction(), request.getSectionType());
        String result = aiService.rewrite(
                request.getContent(),
                request.getAction(),
                request.getSectionType(),
                request.getTargetRole());

        return ResponseEntity.ok(Map.of("result", result));
    }

    // ── ATS Score ─────────────────────────────────────────────────────────────
    // POST /api/ai/ats-score
    // Returns a scored ATS audit of the full resume.

    @PostMapping("/ats-score")
    public ResponseEntity<Map<String, Object>> atsScore(
            @Valid @RequestBody AiAtsRequest request) {

        log.info("AI ATS score requested");
        Map<String, Object> result = aiService.scoreAts(request.getSections());
        return ResponseEntity.ok(result);
    }

    // ── Job Description Matcher ───────────────────────────────────────────────
    // POST /api/ai/match-job
    // Compares the resume to a job description; returns match analysis + tailored sections.

    @PostMapping("/match-job")
    public ResponseEntity<Map<String, Object>> matchJob(
            @Valid @RequestBody AiMatchJobRequest request) {

        log.info("AI JD match requested");
        Map<String, Object> result = aiService.matchJob(
                request.getSections(), request.getJobDescription());
        return ResponseEntity.ok(result);
    }

    // ── Summary Generator ─────────────────────────────────────────────────────
    // POST /api/ai/generate-summary
    // Returns 3 distinct professional summary options based on experience + skills.

    @PostMapping("/generate-summary")
    public ResponseEntity<Map<String, Object>> generateSummary(
            @Valid @RequestBody AiGenerateSummaryRequest request) {

        log.info("AI summary generation requested, targetRole={}", request.getTargetRole());
        Map<String, Object> result = aiService.generateSummary(
                request.getExperience(),
                request.getSkills(),
                request.getTargetRole());

        return ResponseEntity.ok(result);
    }

    // ── Build Resume from Scratch ─────────────────────────────────────────────
    // POST /api/ai/build-resume
    // Generates a complete resume JSON from the user's wizard answers.

    @PostMapping("/build-resume")
    public ResponseEntity<Map<String, Object>> buildResume(
            @Valid @RequestBody AiBuildResumeRequest request) {

        log.info("AI build-resume: role='{}' level='{}'", request.getTargetRole(), request.getExperienceLevel());
        Map<String, Object> result = aiService.buildResume(request);
        return ResponseEntity.ok(result);
    }

    // ── Chat ──────────────────────────────────────────────────────────────────
    // POST /api/ai/chat
    // Conversational resume coach — resume context included automatically.

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(
            @Valid @RequestBody AiChatRequest request) {

        log.info("AI chat message received");
        String reply = aiService.chat(
                request.getMessage(),
                request.getHistory(),
                request.getSections());

        return ResponseEntity.ok(Map.of("reply", reply));
    }
}
