/**
 * Test Checklist Manager
 * Manages the 10-point QA checklist for shipping readiness
 */

const CHECKLIST_KEY = 'placement_readiness_test_checklist';

// Default checklist items
const DEFAULT_CHECKLIST = [
  {
    id: 'jd-required',
    label: 'JD required validation works',
    hint: 'Submit empty JD form. Should block with "Please enter a job description"',
    checked: false
  },
  {
    id: 'jd-short-warning',
    label: 'Short JD warning shows for <200 chars',
    hint: 'Enter "Hiring developer". Warning should appear but allow analysis.',
    checked: false
  },
  {
    id: 'skills-extraction',
    label: 'Skills extraction groups correctly',
    hint: 'Paste JD with React, Java, SQL. Verify categories: web, languages, data.',
    checked: false
  },
  {
    id: 'round-mapping',
    label: 'Round mapping changes based on company + skills',
    hint: 'Compare Amazon (Enterprise) vs StartupX. Rounds should differ.',
    checked: false
  },
  {
    id: 'score-deterministic',
    label: 'Score calculation is deterministic',
    hint: 'Same JD should give same baseScore every time.',
    checked: false
  },
  {
    id: 'skill-toggles',
    label: 'Skill toggles update score live',
    hint: 'Click skill checkboxes. finalScore should update immediately (+2/-2).',
    checked: false
  },
  {
    id: 'persist-refresh',
    label: 'Changes persist after refresh',
    hint: 'Toggle skills, refresh page. finalScore should remain.',
    checked: false
  },
  {
    id: 'history-save-load',
    label: 'History saves and loads correctly',
    hint: 'Create analysis, go to History. Entry should display with all fields.',
    checked: false
  },
  {
    id: 'export-buttons',
    label: 'Export buttons copy the correct content',
    hint: 'Click "Copy Plan". Clipboard should contain the 7-day plan text.',
    checked: false
  },
  {
    id: 'no-console-errors',
    label: 'No console errors on core pages',
    hint: 'Open DevTools, navigate Home/Results/History/Test. Should be clean.',
    checked: false
  }
];

/**
 * Get current checklist state from localStorage
 * @returns {Array} - Array of checklist items
 */
export function getChecklist() {
  try {
    const data = localStorage.getItem(CHECKLIST_KEY);
    if (!data) {
      // Initialize with defaults
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(DEFAULT_CHECKLIST));
      return DEFAULT_CHECKLIST;
    }
    
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(DEFAULT_CHECKLIST));
      return DEFAULT_CHECKLIST;
    }
    
    // Ensure all 10 items exist
    if (parsed.length !== 10) {
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(DEFAULT_CHECKLIST));
      return DEFAULT_CHECKLIST;
    }
    
    return parsed;
  } catch (error) {
    console.error('Error reading checklist:', error);
    return DEFAULT_CHECKLIST;
  }
}

/**
 * Toggle a checklist item
 * @param {string} itemId - ID of item to toggle
 * @returns {Array} - Updated checklist
 */
export function toggleChecklistItem(itemId) {
  const checklist = getChecklist();
  const updated = checklist.map(item =>
    item.id === itemId ? { ...item, checked: !item.checked } : item
  );
  
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Get count of checked items
 * @returns {number}
 */
export function getCheckedCount() {
  const checklist = getChecklist();
  return checklist.filter(item => item.checked).length;
}

/**
 * Check if all items are checked (shipping ready)
 * @returns {boolean}
 */
export function isShippingReady() {
  return getCheckedCount() === 10;
}

/**
 * Reset checklist to all unchecked
 */
export function resetChecklist() {
  const reset = DEFAULT_CHECKLIST.map(item => ({ ...item, checked: false }));
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(reset));
  return reset;
}

/**
 * Get checklist summary
 * @returns {Object} - { checked, total, ready }
 */
export function getChecklistSummary() {
  const checked = getCheckedCount();
  return {
    checked,
    total: 10,
    ready: checked === 10
  };
}
