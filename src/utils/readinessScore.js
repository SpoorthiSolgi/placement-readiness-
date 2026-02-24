/**
 * Calculate readiness score based on JD analysis
 * @param {Object} params - Analysis parameters
 * @param {string} params.company - Company name
 * @param {string} params.role - Job role
 * @param {string} params.jdText - Job description text
 * @param {string[]} params.categories - Detected skill categories
 * @returns {number} - Readiness score (0-100)
 */
export function calculateReadinessScore({ company, role, jdText, categories }) {
  let score = 35; // Base score

  // +5 per detected category (max 30)
  const categoryBonus = Math.min(categories.length * 5, 30);
  score += categoryBonus;

  // +10 if company name provided
  if (company && company.trim().length > 0) {
    score += 10;
  }

  // +10 if role provided
  if (role && role.trim().length > 0) {
    score += 10;
  }

  // +10 if JD length > 800 chars
  if (jdText && jdText.length > 800) {
    score += 10;
  }

  // Cap at 100
  return Math.min(score, 100);
}

/**
 * Get score breakdown for display
 */
export function getScoreBreakdown({ company, role, jdText, categories }) {
  const breakdown = [
    { label: 'Base Score', value: 35 },
    { label: `Categories (${categories.length})`, value: Math.min(categories.length * 5, 30) },
  ];

  if (company && company.trim().length > 0) {
    breakdown.push({ label: 'Company Provided', value: 10 });
  }

  if (role && role.trim().length > 0) {
    breakdown.push({ label: 'Role Provided', value: 10 });
  }

  if (jdText && jdText.length > 800) {
    breakdown.push({ label: 'Detailed JD', value: 10 });
  }

  const total = breakdown.reduce((sum, item) => sum + item.value, 0);
  
  return {
    breakdown,
    total: Math.min(total, 100)
  };
}
