import api from './api';

/**
 * Rewrite a piece of resume text.
 * @param {string} content - text to rewrite
 * @param {string} action  - improve | stronger-verbs | concise | professional | tailor
 * @param {string} sectionType - experience | summary | skills | projects
 * @param {string} [targetRole] - only used when action === 'tailor'
 * @returns {Promise<string>} rewritten text
 */
export async function rewriteContent(content, action, sectionType, targetRole) {
  const { data } = await api.post('/api/ai/rewrite', {
    content,
    action,
    sectionType,
    targetRole: targetRole || null,
  });
  return data.result;
}

/**
 * Score the resume against ATS criteria.
 * @param {object} sections - resume sections object (photo will be stripped server-side)
 * @returns {Promise<object>} { score, breakdown, weakPhrases, missingKeywords, suggestions }
 */
export async function getAtsScore(sections) {
  const { data } = await api.post('/api/ai/ats-score', { sections });
  return data;
}

/**
 * Match the resume against a job description and return a tailored version.
 * @param {object} sections - resume sections object
 * @param {string} jobDescription - pasted job description text
 * @returns {Promise<object>} { matchScore, matchedKeywords, missingKeywords,
 *                              skillsToAdd, experienceGaps, tailoredSections }
 */
export async function matchJob(sections, jobDescription) {
  const { data } = await api.post('/api/ai/match-job', { sections, jobDescription });
  return data;
}

/**
 * Generate 3 professional summary options from experience + skills.
 * @param {Array}  experience - sections.experience array
 * @param {Array}  skills     - sections.skills array
 * @param {string} [targetRole] - optional target role
 * @returns {Promise<{summaries: Array<{label: string, text: string}>}>}
 */
export async function generateSummary(experience, skills, targetRole) {
  const { data } = await api.post('/api/ai/generate-summary', {
    experience: experience || [],
    skills: skills || [],
    targetRole: targetRole || null,
  });
  return data;
}

/**
 * Build a complete resume from scratch using AI.
 * @param {object} answers - wizard answers (name, experienceLevel, targetRole, skills, workHistory, education, achievements, jobDescription, tone)
 * @returns {Promise<object>} generated resume sections matching the app's schema
 */
export async function buildResume(answers) {
  const { data } = await api.post('/api/ai/build-resume', {
    firstName:       answers.firstName       || '',
    lastName:        answers.lastName        || '',
    experienceLevel: answers.experienceLevel || 'mid',
    targetRole:      answers.targetRole      || '',
    skills:          answers.skills          || [],
    workHistory:     answers.workHistory     || [],
    education:       answers.education       || [],
    achievements:    answers.achievements    || '',
    jobDescription:  answers.jobDescription  || '',
    tone:            answers.tone            || 'professional',
  }, {
    timeout: 90000, // 90 s — full resume generation can take up to ~30 s on Claude Sonnet
  });
  return data;
}

/**
 * Send a chat message to the AI resume coach.
 * @param {string} message - user message
 * @param {Array}  history - [{role, content}] previous turns
 * @param {object} sections - current resume sections (context)
 * @returns {Promise<string>} assistant reply
 */
export async function sendChatMessage(message, history, sections) {
  const { data } = await api.post('/api/ai/chat', { message, history, sections });
  return data.reply;
}
