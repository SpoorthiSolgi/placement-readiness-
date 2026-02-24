const STORAGE_KEY = 'placement_readiness_history';

/**
 * Get all history entries from localStorage
 * @returns {Array} - Array of history entries
 */
export function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
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
