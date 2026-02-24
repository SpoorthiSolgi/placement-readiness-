/**
 * KodNest Premium Build System
 * JavaScript for interactive functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initCopyButtons();
    initChecklistItems();
    initStatusBadges();
});

/**
 * Copy to clipboard functionality
 */
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.btn[data-copy]');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            copyToClipboard(textToCopy, this);
        });
    });
    
    // Copy prompt button in secondary panel
    const copyPromptBtn = document.querySelector('.panel-section .btn-secondary');
    if (copyPromptBtn && copyPromptBtn.textContent.includes('Copy Prompt')) {
        copyPromptBtn.addEventListener('click', function() {
            const promptCode = document.querySelector('.prompt-code');
            if (promptCode) {
                copyToClipboard(promptCode.textContent, this);
            }
        });
    }
}

/**
 * Copy text to clipboard with visual feedback
 */
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        button.textContent = 'Failed';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    });
}

/**
 * Checklist item interactions
 */
function initChecklistItems() {
    const checklistItems = document.querySelectorAll('.checklist-item');
    
    checklistItems.forEach(item => {
        const checkbox = item.querySelector('.checklist-checkbox');
        const proofInput = item.querySelector('.proof-input');
        
        // Handle checkbox changes
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                updateChecklistState(item, this.checked);
                updateOverallProgress();
            });
        }
        
        // Handle proof input focus
        if (proofInput) {
            proofInput.addEventListener('focus', function() {
                item.style.borderColor = '#8B0000';
            });
            
            proofInput.addEventListener('blur', function() {
                item.style.borderColor = '';
            });
        }
    });
}

/**
 * Update visual state of checklist item
 */
function updateChecklistState(item, isChecked) {
    if (isChecked) {
        item.style.backgroundColor = '#F0F7F2';
        item.style.borderColor = '#4A7C59';
    } else {
        item.style.backgroundColor = '';
        item.style.borderColor = '';
    }
}

/**
 * Update overall progress based on checked items
 */
function updateOverallProgress() {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    const checkedBoxes = document.querySelectorAll('.checklist-checkbox:checked');
    
    const progress = Math.round((checkedBoxes.length / checkboxes.length) * 100);
    
    // Update status badge based on progress
    const statusBadge = document.querySelector('.status-badge');
    if (statusBadge) {
        if (progress === 0) {
            statusBadge.textContent = 'Not Started';
            statusBadge.className = 'status-badge status-not-started';
        } else if (progress === 100) {
            statusBadge.textContent = 'Shipped';
            statusBadge.className = 'status-badge status-shipped';
        } else {
            statusBadge.textContent = 'In Progress';
            statusBadge.className = 'status-badge status-in-progress';
        }
    }
}

/**
 * Initialize status badge interactions
 */
function initStatusBadges() {
    const statusBadges = document.querySelectorAll('.status-badge');
    
    statusBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            // Cycle through statuses on click
            const statuses = ['status-not-started', 'status-in-progress', 'status-shipped'];
            const labels = ['Not Started', 'In Progress', 'Shipped'];
            
            let currentIndex = statuses.findIndex(status => 
                this.classList.contains(status)
            );
            
            // Remove current status
            this.classList.remove(statuses[currentIndex]);
            
            // Move to next status
            currentIndex = (currentIndex + 1) % statuses.length;
            
            // Apply new status
            this.classList.add(statuses[currentIndex]);
            this.textContent = labels[currentIndex];
        });
    });
}

/**
 * Utility: Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function for scroll events
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
