const STORAGE_KEY = 'placement_readiness_history';

/**
 * Get all history entries from localStorage
 * Validates entries and filters out corrupted ones
 * @returns {Array} - Array of valid history entries
 */
export function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    
    // Filter out corrupted entries
    const validEntries = [];
    let corruptedCount = 0;
    
    parsed.forEach(entry => {
      if (isValidEntry(entry)) {
        validEntries.push(entry);
      } else {
        corruptedCount++;
      }
    });
    
    // If we found corrupted entries, update storage to remove them
    if (corruptedCount > 0) {
      console.warn(`Removed ${corruptedCount} corrupted history entries`);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validEntries));
    }
    
    return validEntries;
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
}

/**
 * Validate a history entry
 * @param {Object} entry - Entry to validate
 * @returns {boolean}
 */
function isValidEntry(entry) {
  if (!entry || typeof entry !== 'object') return false;
  
  // Check required fields
  const requiredFields = ['id', 'createdAt', 'jdText', 'extractedSkills', 'questions', 'baseScore'];
  for (const field of requiredFields) {
    if (!(field in entry)) return false;
  }
  
  // Validate types
  if (typeof entry.id !== 'string') return false;
  if (typeof entry.createdAt !== 'string') return false;
  if (typeof entry.jdText !== 'string') return false;
  if (typeof entry.baseScore !== 'number') return false;
  if (!Array.isArray(entry.questions)) return false;
  if (!entry.extractedSkills || typeof entry.extractedSkills !== 'object') return false;
  
  return true;
}

/**
 * Save a new analysis entry to history
 * @param {Object} entry - Analysis entry to save
 * @returns {Object} - Saved entry with ID
 */
export function saveToHistory(entry) {
  try {
    const history = getHistory();
    
    const newEntry = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...entry
    };
    
    // Add to beginning of array (newest first)
    history.unshift(newEntry);
    
    // Keep only last 50 entries to prevent storage issues
    const trimmedHistory = history.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    
    return newEntry;
  } catch (error) {
    console.error('Error saving to history:', error);
    throw new Error('Failed to save analysis to history');
  }
}

/**
 * Get a specific history entry by ID
 * @param {string} id - Entry ID
 * @returns {Object|null} - History entry or null if not found
 */
export function getHistoryEntry(id) {
  try {
    const history = getHistory();
    return history.find(entry => entry.id === id) || null;
  } catch (error) {
    console.error('Error getting history entry:', error);
    return null;
  }
}

/**
 * Update an existing history entry
 * @param {string} id - Entry ID to update
 * @param {Object} updates - Fields to update
 * @returns {Object|null} - Updated entry or null if not found
 */
export function updateHistoryEntry(id, updates) {
  try {
    const history = getHistory();
    const index = history.findIndex(entry => entry.id === id);
    
    if (index === -1) {
      return null;
    }
    
    // Merge updates with existing entry
    history[index] = {
      ...history[index],
      ...updates,
      id, // Ensure ID doesn't change
      createdAt: history[index].createdAt // Preserve original creation date
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return history[index];
  } catch (error) {
    console.error('Error updating history entry:', error);
    return null;
  }
}

/**
 * Delete a history entry by ID
 * @param {string} id - Entry ID to delete
 * @returns {boolean} - Success status
 */
export function deleteHistoryEntry(id) {
  try {
    const history = getHistory();
    const filtered = history.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting history entry:', error);
    return false;
  }
}

/**
 * Clear all history
 * @returns {boolean} - Success status
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
}

/**
 * Generate unique ID
 * @returns {string} - Unique ID
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format date for display
 * @param {string} isoDate - ISO date string
 * @returns {string} - Formatted date
 */
export function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
