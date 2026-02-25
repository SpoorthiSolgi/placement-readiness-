/**
 * Standardized Analysis Entry Schema
 * All history entries must conform to this structure
 */

/**
 * Create a new standardized analysis entry
 * @param {Object} data - Input data
 * @returns {Object} - Standardized entry
 */
export function createAnalysisEntry({
  id,
  createdAt,
  company = '',
  role = '',
  jdText,
  extractedSkills,
  companyIntel,
  roundMapping,
  checklist,
  plan7Days,
  questions,
  baseScore,
  skillConfidenceMap = {},
  finalScore,
  updatedAt
}) {
  // Normalize extracted skills to standard format
  const normalizedSkills = normalizeExtractedSkills(extractedSkills);

  return {
    id: id || generateId(),
    createdAt: createdAt || new Date().toISOString(),
    company: sanitizeString(company),
    role: sanitizeString(role),
    jdText: sanitizeString(jdText) || '',
    extractedSkills: normalizedSkills,
    companyIntel: normalizeCompanyIntel(companyIntel),
    roundMapping: normalizeRoundMapping(roundMapping),
    checklist: normalizeChecklist(checklist),
    plan7Days: normalizePlan(plan7Days),
    questions: Array.isArray(questions) ? questions : [],
    baseScore: clampNumber(baseScore, 0, 100),
    skillConfidenceMap: normalizeConfidenceMap(skillConfidenceMap, normalizedSkills),
    finalScore: clampNumber(finalScore ?? baseScore, 0, 100),
    updatedAt: updatedAt || createdAt || new Date().toISOString()
  };
}

/**
 * Normalize extracted skills to standard format
 */
function normalizeExtractedSkills(skills) {
  const defaultSkills = {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloud: [],
    testing: [],
    other: []
  };

  if (!skills || typeof skills !== 'object') {
    return defaultSkills;
  }

  // Handle old format with 'general' fallback
  if (skills.general) {
    return {
      ...defaultSkills,
      other: ['Communication', 'Problem solving', 'Basic coding', 'Projects']
    };
  }

  // Normalize each category
  return {
    coreCS: normalizeArray(skills.coreCS?.skills || skills.coreCS),
    languages: normalizeArray(skills.languages?.skills || skills.languages),
    web: normalizeArray(skills.web?.skills || skills.web),
    data: normalizeArray(skills.data?.skills || skills.data),
    cloud: normalizeArray(skills.cloudDevOps?.skills || skills.cloud || skills.cloudDevOps),
    testing: normalizeArray(skills.testing?.skills || skills.testing),
    other: normalizeArray(skills.other)
  };
}

/**
 * Normalize company intel
 */
function normalizeCompanyIntel(companyIntel) {
  if (!companyIntel || typeof companyIntel !== 'object') {
    return null;
  }
  
  return {
    companyName: sanitizeString(companyIntel.companyName),
    industry: sanitizeString(companyIntel.industry),
    size: sanitizeString(companyIntel.size),
    hiringFocus: companyIntel.hiringFocus || {},
    isDemo: !!companyIntel.isDemo
  };
}

/**
 * Normalize round mapping
 */
function normalizeRoundMapping(roundMapping) {
  if (!Array.isArray(roundMapping)) {
    return [];
  }
  return roundMapping.map(round => ({
    roundNumber: Number(round.roundNumber) || 1,
    title: sanitizeString(round.title),
    focus: normalizeArray(round.focus),
    description: sanitizeString(round.description),
    whyItMatters: sanitizeString(round.whyItMatters),
    duration: sanitizeString(round.duration),
    difficulty: sanitizeString(round.difficulty),
    tips: normalizeArray(round.tips)
  }));
}

/**
 * Normalize checklist
 */
function normalizeChecklist(checklist) {
  if (!checklist || typeof checklist !== 'object') {
    return [];
  }

  // Handle object format (round1, round2, etc.)
  if (!Array.isArray(checklist)) {
    return Object.values(checklist).map(round => ({
      roundTitle: sanitizeString(round.title || round.roundTitle),
      items: normalizeArray(round.items)
    }));
  }

  return checklist.map(round => ({
    roundTitle: sanitizeString(round.roundTitle || round.title),
    items: normalizeArray(round.items)
  }));
}

/**
 * Normalize 7-day plan
 */
function normalizePlan(plan) {
  if (!Array.isArray(plan)) {
    return [];
  }
  return plan.map(day => ({
    day: Number(day.day) || 1,
    focus: sanitizeString(day.focus || day.title),
    tasks: normalizeArray(day.tasks)
  }));
}

/**
 * Normalize confidence map
 */
function normalizeConfidenceMap(confidenceMap, skills) {
  const map = {};
  
  // Get all skills from normalized structure
  const allSkills = [
    ...skills.coreCS,
    ...skills.languages,
    ...skills.web,
    ...skills.data,
    ...skills.cloud,
    ...skills.testing,
    ...skills.other
  ];

  // Default all to 'practice'
  allSkills.forEach(skill => {
    map[skill] = 'practice';
  });

  // Merge with existing confidence map
  if (confidenceMap && typeof confidenceMap === 'object') {
    Object.entries(confidenceMap).forEach(([skill, confidence]) => {
      if (allSkills.includes(skill) && ['know', 'practice'].includes(confidence)) {
        map[skill] = confidence;
      }
    });
  }

  return map;
}

/**
 * Validate an analysis entry
 * @param {Object} entry - Entry to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export function validateAnalysisEntry(entry) {
  const errors = [];

  if (!entry || typeof entry !== 'object') {
    return { isValid: false, errors: ['Entry is not an object'] };
  }

  // Required fields
  const requiredFields = ['id', 'createdAt', 'jdText', 'extractedSkills', 'questions', 'baseScore'];
  requiredFields.forEach(field => {
    if (!(field in entry)) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Type checks
  if (entry.baseScore !== undefined && (typeof entry.baseScore !== 'number' || entry.baseScore < 0 || entry.baseScore > 100)) {
    errors.push('baseScore must be a number between 0 and 100');
  }

  if (entry.finalScore !== undefined && (typeof entry.finalScore !== 'number' || entry.finalScore < 0 || entry.finalScore > 100)) {
    errors.push('finalScore must be a number between 0 and 100');
  }

  if (entry.questions && !Array.isArray(entry.questions)) {
    errors.push('questions must be an array');
  }

  if (entry.extractedSkills && typeof entry.extractedSkills !== 'object') {
    errors.push('extractedSkills must be an object');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Calculate final score based on base score and confidence map
 * @param {number} baseScore - Original base score
 * @param {Object} skillConfidenceMap - Skill confidence map
 * @returns {number} - Final score (0-100)
 */
export function calculateFinalScore(baseScore, skillConfidenceMap) {
  if (!skillConfidenceMap || typeof skillConfidenceMap !== 'object') {
    return clampNumber(baseScore, 0, 100);
  }

  let adjustment = 0;
  Object.values(skillConfidenceMap).forEach(confidence => {
    if (confidence === 'know') {
      adjustment += 2;
    } else if (confidence === 'practice') {
      adjustment -= 2;
    }
  });

  return clampNumber(baseScore + adjustment, 0, 100);
}

/**
 * Get all skills from normalized structure
 * @param {Object} extractedSkills - Normalized skills object
 * @returns {string[]} - Flat array of all skills
 */
export function getAllSkillsFromStructure(extractedSkills) {
  if (!extractedSkills) return [];
  
  return [
    ...(extractedSkills.coreCS || []),
    ...(extractedSkills.languages || []),
    ...(extractedSkills.web || []),
    ...(extractedSkills.data || []),
    ...(extractedSkills.cloud || []),
    ...(extractedSkills.testing || []),
    ...(extractedSkills.other || [])
  ];
}

// Helper functions
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim();
}

function normalizeArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(item => typeof item === 'string').map(sanitizeString).filter(Boolean);
}

function clampNumber(num, min, max) {
  const n = Number(num) || 0;
  return Math.max(min, Math.min(max, n));
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
