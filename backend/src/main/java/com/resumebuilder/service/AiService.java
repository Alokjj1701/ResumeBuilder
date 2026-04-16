package com.resumebuilder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumebuilder.dto.ai.AiBuildResumeRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${anthropic.api-key}")
    private String apiKey;

    @Value("${anthropic.model.fast}")
    private String fastModel;

    @Value("${anthropic.model.smart}")
    private String smartModel;

    private static final String API_URL       = "https://api.anthropic.com/v1/messages";
    private static final String API_VERSION   = "2023-06-01";
    private static final String BETA_HEADER   = "prompt-caching-2024-07-31";

    // ── System prompts ────────────────────────────────────────────────────────

    private static final String REWRITE_SYSTEM = """
            You are a professional resume writer with deep expertise in ATS optimization and recruiter psychology.
            Rewrite the provided resume text according to the requested action.
            Return ONLY the rewritten text — no explanation, no quotes, no markdown fences, no preamble.
            Rules:
            - Preserve bullet-point formatting if present (keep • or - characters and line breaks).
            - Keep facts accurate; never invent companies, metrics, or titles.
            - Use strong action verbs and industry-standard keywords.
            - Quantify achievements where the original provides data to work with.
            - For "experience": lead each bullet with a past-tense action verb, end with measurable impact.
            - For "summary": 2–3 concise sentences, role-specific keywords, no first-person pronouns.
            - For "projects": highlight technical stack, problem solved, and measurable outcome.
            - For "education": highlight academic achievements, relevant coursework, honors, or activities concisely.
            - For "skills": ensure keywords are ATS-friendly and listed in order of relevance.
            """;

    private static final String ATS_SYSTEM = """
            You are an ATS (Applicant Tracking System) expert and resume coach.
            Analyze the provided resume JSON and return a detailed ATS audit.
            Return ONLY valid JSON — no markdown fences, no explanation, no text before or after the JSON.
            Use exactly this structure:
            {
              "score": <integer 0-100>,
              "breakdown": {
                "keywords": <integer 0-100>,
                "formatting": <integer 0-100>,
                "completeness": <integer 0-100>,
                "impact": <integer 0-100>
              },
              "weakPhrases": [{"original": "...", "suggestion": "..."}],
              "missingKeywords": ["..."],
              "suggestions": ["..."]
            }
            Scoring guide — keywords: industry terms, action verbs, technical skills present.
            formatting: consistent dates, no tables/graphics, clean structure.
            completeness: all key sections present, achievements quantified.
            impact: measurable results, strong verbs, concrete accomplishments.
            """;

    private static final String JD_MATCH_SYSTEM = """
            You are an expert career coach and resume optimizer.
            Compare the resume against the job description. Return a match analysis AND a fully tailored resume.
            Return ONLY valid JSON — no markdown fences, no explanation, no text before or after the JSON.
            Use exactly this structure:
            {
              "matchScore": <integer 0-100>,
              "matchedKeywords": ["..."],
              "missingKeywords": ["..."],
              "skillsToAdd": ["..."],
              "experienceGaps": ["..."],
              "tailoredSections": {
                "summary": "<rewritten summary targeting this specific job>",
                "experience": [ <SAME array structure as input — same IDs, all fields, improved descriptions> ],
                "skills":     [ <SAME array structure as input — same IDs, reordered/expanded to match job> ],
                "projects":   [ <SAME array structure as input — same IDs, highlight relevant projects> ]
              }
            }
            Rules:
            - Never invent experience, companies, or degrees.
            - Weave missing keywords into descriptions only where truthful.
            - Keep every object's "id" field identical to the input.
            - All other fields must be present even if unchanged.
            """;

    private static final String SUMMARY_SYSTEM = """
            You are an expert resume writer specializing in ATS-optimized professional summaries.
            Generate exactly 3 distinct professional summary options based on the provided experience and skills.
            Return ONLY valid JSON — no markdown fences, no explanation, no text before or after.
            Use exactly this structure:
            {
              "summaries": [
                {"label": "Brief & Punchy",          "text": "..."},
                {"label": "Detailed & Comprehensive", "text": "..."},
                {"label": "Achievement-Focused",      "text": "..."}
              ]
            }
            Writing rules (apply to ALL three):
            - No first-person pronouns (I, me, my, we).
            - Use strong action verbs and industry-specific keywords.
            - Weave in measurable impact where the experience data provides numbers.
            - Tailor to the target role if one is provided.
            - Never invent experience, titles, or companies not present in the input.
            Individual style rules:
            - "Brief & Punchy": 1–2 tight sentences, max 180 characters, punchy opener.
            - "Detailed & Comprehensive": 3–4 sentences, covers background + skills + goals.
            - "Achievement-Focused": leads with the single strongest quantified achievement, then role context.
            """;

    private static final String BUILD_RESUME_SYSTEM = """
            You are a world-class resume writer with deep expertise in ATS optimization, recruiter psychology, and industry-specific content.
            Build a complete, professional resume from the user's inputs. Make it sound human, specific, and compelling — not generic.

            Return ONLY valid JSON — no markdown fences, no explanation, no text outside the JSON.
            Use EXACTLY this structure (all fields required; use empty string "" for unknown/optional values):
            {
              "personalInfo": {
                "firstName": "",
                "lastName": "",
                "email": "",
                "phone": "",
                "location": "",
                "linkedin": "",
                "github": "",
                "website": ""
              },
              "summary": "2–3 sentences. No first-person pronouns. Role keyword + years of experience + core expertise + value proposition.",
              "experience": [
                {
                  "id": "exp-1",
                  "title": "Job Title",
                  "company": "Company Name",
                  "location": "City, Country",
                  "startDate": "YYYY-MM",
                  "endDate": "YYYY-MM",
                  "current": false,
                  "description": "• Past-tense action verb + context + quantified impact.\\n• Action verb + result."
                }
              ],
              "education": [
                {
                  "id": "edu-1",
                  "degree": "Degree Name",
                  "fieldOfStudy": "Field of Study",
                  "institution": "Institution Name",
                  "location": "City, Country",
                  "startDate": "YYYY-MM",
                  "endDate": "YYYY-MM",
                  "gpa": "",
                  "description": ""
                }
              ],
              "skills": [
                {
                  "id": "sk-1",
                  "category": "Category Name",
                  "items": ["Skill A", "Skill B", "Skill C"]
                }
              ],
              "projects": [
                {
                  "id": "proj-1",
                  "name": "Project Name",
                  "description": "What it does, technical approach, measurable impact.",
                  "url": "",
                  "technologies": ["Tech1", "Tech2"],
                  "startDate": "YYYY-MM",
                  "endDate": "YYYY-MM"
                }
              ]
            }

            Critical rules:
            - Dates: "YYYY-MM" format only (e.g. "2021-06") or "" — NEVER use "Present", "current", or other non-date strings.
            - Set "current": true ONLY for the most recent ongoing role; false for all others.
            - Experience bullets: strong past-tense action verb → specific context → quantified impact. 3–5 bullets per role, each on its own line prefixed with "• ".
            - Summary: 2–3 sentences, no "I"/"me"/"my", includes target role title + experience years + top 2 skill areas.
            - Skills: 2–4 logical categories (e.g. "Frontend", "Backend", "Cloud & DevOps", "Tools"). 4–8 items per category. All user-provided skills must appear plus relevant adjacent ones.
            - NEVER invent employers, degrees, or certifications the user did not mention.
            - Freshers/entry-level: emphasize education, coursework, personal projects, internships; include 1–2 well-crafted personal projects even if not mentioned.
            - Senior/Executive: emphasize team scale, revenue/cost impact, strategic ownership, and leadership.
            - When a job description is provided: weave its exact keywords naturally into experience bullets and summary.
            - Tone modes — professional: polished formal; technical: metrics-heavy precise stack details; creative: dynamic distinctive verbs; executive: strategic board-level vocabulary.
            - Projects array must always have at least 1 entry; infer from work experience if the user listed none.
            - Skills items should each be 1–3 words, ATS-friendly exact terms.
            """;

    private static final String CHAT_SYSTEM = """
            You are an expert AI resume coach embedded in a resume builder app.
            You have the user's full resume as context. Help them land their dream job.

            Response rules:
            - Be concise and specific — no filler, no preamble.
            - Focus on ATS optimization, recruiter appeal, and quantified achievements.
            - Use industry-standard action verbs and keywords relevant to the user's field.

            When you suggest rewritten text (a bullet point, summary, description, etc.):
            - Wrap the ENTIRE suggested block in a fenced code block with the language "suggestion", like this:
              ```suggestion
              • Engineered a distributed caching layer using Redis, reducing p99 API latency by 43% across 12M daily requests.
              ```
            - After the block, briefly explain in 1–2 sentences WHY this is stronger (keywords added, metric added, verb improved, etc.).
            - Only wrap the final polished copy in a suggestion block — not drafts or partial thoughts.
            - If you are improving multiple bullets, wrap the entire set in one suggestion block.

            When asked for general advice, give a tight bullet list — no paragraphs.
            Never invent experience, companies, or metrics the user hasn't mentioned.
            """;


    // ── Public API ────────────────────────────────────────────────────────────

    public String rewrite(String content, String action, String sectionType, String targetRole) {
        String userMsg = buildRewriteUserMessage(content, action, sectionType, targetRole);
        return callClaude(fastModel, REWRITE_SYSTEM, userMsg, 1024);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> scoreAts(Map<String, Object> sections) {
        String resumeJson = serializeResume(sections);
        String raw = callClaude(fastModel, ATS_SYSTEM, resumeJson, 1024);
        return parseJson(raw);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> matchJob(Map<String, Object> sections, String jobDescription) {
        String resumeJson = serializeResume(sections);
        String userMsg    = "Resume JSON:\n" + resumeJson + "\n\nJob Description:\n" + jobDescription;
        String raw        = callClaude(smartModel, JD_MATCH_SYSTEM, userMsg, 4096);
        return parseJson(raw);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> generateSummary(List<Map<String, Object>> experience,
                                               List<Map<String, Object>> skills,
                                               String targetRole) {
        String userMsg = buildSummaryUserMessage(experience, skills, targetRole);
        String raw = callClaude(fastModel, SUMMARY_SYSTEM, userMsg, 1024);
        return parseJson(raw);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> buildResume(AiBuildResumeRequest request) {
        String userMsg = buildResumeUserMessage(request);
        String raw = callClaude(smartModel, BUILD_RESUME_SYSTEM, userMsg, 4096);
        return parseJson(raw);
    }

    public String chat(String message, List<Map<String, String>> history, Map<String, Object> sections) {
        String resumeJson  = serializeResume(sections);
        String systemPrompt = CHAT_SYSTEM + "\n\nUser's current resume:\n" + resumeJson;
        List<Map<String, String>> messages = new ArrayList<>(history == null ? List.of() : history);
        messages.add(Map.of("role", "user", "content", message));
        return callClaudeWithHistory(smartModel, systemPrompt, messages, 1024);
    }

    // ── Core HTTP helpers ─────────────────────────────────────────────────────

    @SuppressWarnings("unchecked")
    private String callClaude(String model, String systemPrompt, String userMessage, int maxTokens) {
        HttpHeaders headers = buildHeaders();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", model);
        body.put("max_tokens", maxTokens);
        // System prompt with prompt-caching for cost reduction
        body.put("system", List.of(Map.of(
                "type", "text",
                "text", systemPrompt,
                "cache_control", Map.of("type", "ephemeral")
        )));
        body.put("messages", List.of(Map.of("role", "user", "content", userMessage)));

        ResponseEntity<Map> resp = restTemplate.exchange(
                API_URL, HttpMethod.POST, new HttpEntity<>(body, headers), Map.class);

        return extractText(resp.getBody());
    }

    @SuppressWarnings("unchecked")
    private String callClaudeWithHistory(String model, String systemPrompt,
                                          List<Map<String, String>> messages, int maxTokens) {
        HttpHeaders headers = buildHeaders();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", model);
        body.put("max_tokens", maxTokens);
        body.put("system", List.of(Map.of(
                "type", "text",
                "text", systemPrompt,
                "cache_control", Map.of("type", "ephemeral")
        )));
        body.put("messages", messages);

        ResponseEntity<Map> resp = restTemplate.exchange(
                API_URL, HttpMethod.POST, new HttpEntity<>(body, headers), Map.class);

        return extractText(resp.getBody());
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders h = new HttpHeaders();
        h.set("x-api-key", apiKey);
        h.set("anthropic-version", API_VERSION);
        h.set("anthropic-beta", BETA_HEADER);
        h.setContentType(MediaType.APPLICATION_JSON);
        return h;
    }

    @SuppressWarnings("unchecked")
    private String extractText(Map<?, ?> responseBody) {
        List<Map<String, Object>> content = (List<Map<String, Object>>) responseBody.get("content");
        return (String) content.get(0).get("text");
    }

    // ── Prompt builders ───────────────────────────────────────────────────────

    private String buildRewriteUserMessage(String content, String action,
                                            String sectionType, String targetRole) {
        String instruction = switch (action) {
            case "stronger-verbs"  -> "Rewrite using stronger, more impactful action verbs.";
            case "concise"         -> "Make this more concise while keeping all key information.";
            case "professional"    -> "Make this sound more professional and polished.";
            case "tailor"          -> "Tailor this for the role: " + (targetRole != null ? targetRole : "a relevant professional role") + ".";
            default                -> "Improve this resume content to be more impactful and ATS-friendly.";
        };
        return instruction + "\n\nSection type: " + (sectionType != null ? sectionType : "general")
                + "\n\nContent to rewrite:\n" + content;
    }

    private String buildSummaryUserMessage(List<Map<String, Object>> experience,
                                           List<Map<String, Object>> skills,
                                           String targetRole) {
        StringBuilder sb = new StringBuilder();
        if (targetRole != null && !targetRole.isBlank()) {
            sb.append("Target role: ").append(targetRole).append("\n\n");
        }
        try {
            if (experience != null && !experience.isEmpty()) {
                sb.append("Experience:\n").append(objectMapper.writeValueAsString(experience)).append("\n\n");
            }
            if (skills != null && !skills.isEmpty()) {
                sb.append("Skills:\n").append(objectMapper.writeValueAsString(skills)).append("\n\n");
            }
        } catch (Exception e) {
            log.warn("Failed to serialize experience/skills for summary generation", e);
        }
        sb.append("Generate 3 professional summary options for this candidate.");
        return sb.toString();
    }

    private String buildResumeUserMessage(AiBuildResumeRequest req) {
        StringBuilder sb = new StringBuilder();
        sb.append("Name: ").append(req.getFirstName()).append(" ").append(req.getLastName()).append("\n");
        sb.append("Experience level: ").append(req.getExperienceLevel() != null ? req.getExperienceLevel() : "mid").append("\n");
        sb.append("Tone: ").append(req.getTone() != null ? req.getTone() : "professional").append("\n");
        if (req.getTargetRole() != null && !req.getTargetRole().isBlank()) {
            sb.append("Target role: ").append(req.getTargetRole()).append("\n");
        }
        sb.append("\n");

        if (req.getSkills() != null && !req.getSkills().isEmpty()) {
            sb.append("Skills: ").append(String.join(", ", req.getSkills())).append("\n\n");
        }

        if (req.getWorkHistory() != null && !req.getWorkHistory().isEmpty()) {
            sb.append("Work History:\n");
            for (AiBuildResumeRequest.WorkHistoryInput wh : req.getWorkHistory()) {
                if (wh.getCompany() == null || wh.getCompany().isBlank()) continue;
                sb.append("- ").append(wh.getTitle() != null ? wh.getTitle() : "Role")
                  .append(" at ").append(wh.getCompany());
                if (wh.getDuration() != null && !wh.getDuration().isBlank()) {
                    sb.append(" (").append(wh.getDuration()).append(")");
                }
                sb.append("\n");
                if (wh.getDescription() != null && !wh.getDescription().isBlank()) {
                    sb.append("  Key wins / responsibilities: ").append(wh.getDescription()).append("\n");
                }
            }
            sb.append("\n");
        }

        if (req.getEducation() != null && !req.getEducation().isEmpty()) {
            sb.append("Education:\n");
            for (AiBuildResumeRequest.EducationInput edu : req.getEducation()) {
                if (edu.getInstitution() == null || edu.getInstitution().isBlank()) continue;
                sb.append("- ").append(edu.getDegree() != null ? edu.getDegree() : "Degree")
                  .append(" from ").append(edu.getInstitution());
                if (edu.getYear() != null && !edu.getYear().isBlank()) {
                    sb.append(" (").append(edu.getYear()).append(")");
                }
                if (edu.getGpa() != null && !edu.getGpa().isBlank()) {
                    sb.append(" | GPA: ").append(edu.getGpa());
                }
                sb.append("\n");
            }
            sb.append("\n");
        }

        if (req.getAchievements() != null && !req.getAchievements().isBlank()) {
            sb.append("Key achievements / highlights:\n").append(req.getAchievements()).append("\n\n");
        }

        if (req.getJobDescription() != null && !req.getJobDescription().isBlank()) {
            sb.append("Job Description to tailor for:\n").append(req.getJobDescription()).append("\n");
        }

        sb.append("\nGenerate a complete, ATS-optimized resume for this candidate.");
        return sb.toString();
    }

    // ── Utilities ─────────────────────────────────────────────────────────────

    private String serializeResume(Map<String, Object> sections) {
        if (sections == null) return "{}";
        // Strip photo — base64 is huge and useless for AI
        Map<String, Object> cleaned = new LinkedHashMap<>(sections);
        if (cleaned.get("personalInfo") instanceof Map<?, ?> pi) {
            Map<String, Object> info = new LinkedHashMap<>((Map<String, Object>) pi);
            info.remove("photo");
            cleaned.put("personalInfo", info);
        }
        try {
            return objectMapper.writeValueAsString(cleaned);
        } catch (Exception e) {
            log.warn("Failed to serialize resume for AI call", e);
            return "{}";
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseJson(String raw) {
        // Strip any accidental markdown fences Claude might add
        String cleaned = raw.strip();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceFirst("```[a-z]*\\n?", "").replaceAll("```$", "").strip();
        }
        try {
            return objectMapper.readValue(cleaned, Map.class);
        } catch (Exception e) {
            log.error("AI returned unparseable JSON: {}", raw, e);
            // Throw so the controller returns HTTP 500 — never swallow as a 200 success payload
            throw new RuntimeException("AI returned an invalid response. Please try again.");
        }
    }
}
