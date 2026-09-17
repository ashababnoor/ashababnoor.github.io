// Theme toggle
(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();

function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    function syncLabel() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        toggle.setAttribute('aria-label', label);
        toggle.setAttribute('title', label);
    }

    toggle.addEventListener('mousedown', function(e) {
        e.preventDefault();
    });

    toggle.addEventListener('click', function() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        syncLabel();
    });

    // The theme is resolved before this runs, so the markup default may be stale.
    syncLabel();
}

// BibTeX copy buttons
function readBibtex(el) {
    // The entries are indented to sit nicely in the markup; strip the common
    // leading whitespace so what lands on the clipboard is flush-left.
    const raw = el.textContent.replace(/^\n/, '').replace(/\s+$/, '');
    const lines = raw.split('\n');
    const indents = lines.filter(function(l) { return l.trim(); })
                         .map(function(l) { return l.match(/^ */)[0].length; });
    const pad = indents.length ? Math.min.apply(null, indents) : 0;
    return lines.map(function(l) { return l.slice(pad); }).join('\n');
}

function legacyCopy(text) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-9999px';
    document.body.appendChild(area);
    area.select();
    let copied = false;
    try {
        copied = document.execCommand('copy');
    } catch (e) {
        copied = false;
    }
    document.body.removeChild(area);
    return copied;
}

function copyText(text) {
    // The async API needs a secure context, which rules out opening the file
    // straight off disk; fall back rather than fail silently.
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).then(function() {
            return true;
        }, function() {
            return legacyCopy(text);
        });
    }
    return Promise.resolve(legacyCopy(text));
}

const COPY_ICONS = {
    copy: 'far fa-copy',
    done: 'fas fa-check',
    fail: 'fas fa-xmark'
};

function initBibtexCopy() {
    document.querySelectorAll('.publication-copy').forEach(function(button) {
        const label = button.querySelector('.publication-copy-label');
        const icon = button.querySelector('[data-copy-icon]');
        const source = document.getElementById(button.dataset.bibtex);
        if (!label || !icon || !source) return;

        const restingLabel = label.textContent;
        let revert;

        button.addEventListener('click', function() {
            // Pin the resting width before the label changes, so the shorter
            // "Copied" cannot shrink the button and shift View Paper.
            if (!button.style.width) {
                button.style.width = button.getBoundingClientRect().width + 'px';
            }

            copyText(readBibtex(source)).then(function(copied) {
                clearTimeout(revert);
                button.classList.toggle('is-copied', copied);
                button.classList.toggle('is-failed', !copied);
                icon.className = copied ? COPY_ICONS.done : COPY_ICONS.fail;
                label.textContent = copied ? 'Copied' : 'Failed';

                revert = setTimeout(function() {
                    button.classList.remove('is-copied', 'is-failed');
                    icon.className = COPY_ICONS.copy;
                    label.textContent = restingLabel;
                    button.style.width = '';
                }, 2000);
            });
        });
    });
}

// Calculate total duration at Pathao
function calculateDuration(startDate, endDate = null) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    
    // Count inclusively, like LinkedIn: any day in a month counts the whole month.
    months++;
    
    if (months < 0) {
        years--;
        months += 12;
    } else if (months >= 12) {
        years += Math.floor(months / 12);
        months = months % 12;
    }
    
    let duration = '';
    if (years > 0) {
        duration += years === 1 ? '1 yr' : `${years} yrs`;
        if (months > 0) {
            duration += months === 1 ? ' 1 mo' : ` ${months} mos`;
        }
    } else if (months > 0) {
        duration = months === 1 ? '1 mo' : `${months} mos`;
    } else {
        duration = 'Less than 1 mo';
    }
    
    return duration;
}

// Smart expandable content functionality
function initializeExpandableContent() {
    // ============ CONFIGURATION VARIABLES ============
    // Adjust these values to control when "Show more" appears
    
    // Minimum total items (main + nested) before showing expand/collapse
    const MIN_TOTAL_ITEMS = 5; // Increase to show "Show more" less often
    
    // Minimum main items before considering expand/collapse
    const MIN_MAIN_ITEMS = 1; // Must have at least this many main items
    
    // Cutoff for items with heavy nested content
    const NESTED_ITEM_THRESHOLD = 4; // If first item has this many nested items, cut after 2 main items
    const MAIN_ITEMS_WITH_NESTED = 2; // Show this many main items when first has heavy nested content
    
    // Default cutoff for normal content
    const DEFAULT_MAIN_ITEMS_CUTOFF = 3; // Show this many main items normally
    
    // ================================================
    
    const descriptions = document.querySelectorAll('.position-description, .education-description');
    
    descriptions.forEach(description => {
        const mainList = description.querySelector('ul');
        if (!mainList) return;
        
        const allItems = Array.from(mainList.children);
        
        // Smart cutoff logic with nested list counting
        // Count total content including nested lists
        function countTotalItems(items) {
            let total = 0;
            items.forEach(item => {
                total += 1; // Count the main item
                const nestedList = item.querySelector('ul');
                if (nestedList) {
                    total += nestedList.children.length; // Count nested items
                }
            });
            return total;
        }
        
        // Find smart cutoff point using configuration variables
        function findCutoffPoint(items) {
            for (let i = 0; i < items.length; i++) {
                const visibleMainItems = i + 1;
                
                // Check if first item has heavy nested content
                const firstItemNested = items[0].querySelector('ul');
                const firstItemNestedCount = firstItemNested ? firstItemNested.children.length : 0;
                
                if (firstItemNestedCount >= NESTED_ITEM_THRESHOLD && visibleMainItems >= MAIN_ITEMS_WITH_NESTED) {
                    return MAIN_ITEMS_WITH_NESTED;
                }
                
                // Default cutoff
                if (visibleMainItems >= DEFAULT_MAIN_ITEMS_CUTOFF) {
                    return DEFAULT_MAIN_ITEMS_CUTOFF;
                }
            }
            
            return items.length; // Show all if we never hit cutoff
        }
        
        const totalItems = countTotalItems(allItems);
        
        // Don't add expand/collapse for short content (uses MIN_TOTAL_ITEMS and MIN_MAIN_ITEMS)
        if (totalItems <= MIN_TOTAL_ITEMS || allItems.length < MIN_MAIN_ITEMS) {
            return;
        }
        
        const cutoffIndex = findCutoffPoint(allItems);
        
        if (cutoffIndex === 0 || cutoffIndex >= allItems.length) {
            return; // No need to cut
        }
        
        // Create containers for visible and expandable content
        const visibleItems = allItems.slice(0, cutoffIndex);
        const expandableItems = allItems.slice(cutoffIndex);
        
        if (expandableItems.length === 0) return;
        
        // Create expandable container
        const expandableContainer = document.createElement('div');
        expandableContainer.className = 'expandable-content collapsed';
        
        const expandableList = document.createElement('ul');
        expandableList.className = 'expandable-list';
        
        // Move expandable items to the new list
        expandableItems.forEach(item => {
            expandableList.appendChild(item);
        });
        
        expandableContainer.appendChild(expandableList);
        
        // Create show more toggle button
        const showMoreButton = document.createElement('button');
        showMoreButton.className = 'expand-toggle'; // Removed 'with-lines' class
        showMoreButton.setAttribute('aria-expanded', 'false');
        
        const showMoreIcon = document.createElement('i');
        showMoreIcon.className = 'fas fa-chevron-down'; // v icon
        
        const showMoreText = document.createElement('span');
        showMoreText.className = 'expand-toggle-text';
        showMoreText.textContent = 'Show more';
        
        showMoreButton.appendChild(showMoreIcon);
        showMoreButton.appendChild(showMoreText);
        
        // Create show less toggle button
        const showLessButton = document.createElement('button');
        showLessButton.className = 'expand-toggle expand-toggle-end'; // Removed 'with-lines' class
        showLessButton.setAttribute('aria-expanded', 'true');
        showLessButton.style.display = 'none';
        
        const showLessIcon = document.createElement('i');
        showLessIcon.className = 'fas fa-chevron-up'; // ^ icon
        
        const showLessText = document.createElement('span');
        showLessText.className = 'expand-toggle-text';
        showLessText.textContent = 'Show less';
        
        showLessButton.appendChild(showLessIcon);
        showLessButton.appendChild(showLessText);
        
        // Add click handlers
        showMoreButton.addEventListener('click', function() {
            expandableContainer.classList.remove('collapsed');
            expandableContainer.classList.add('expanded');
            showMoreButton.style.display = 'none';
            showLessButton.style.display = 'flex';
        });
        
        showLessButton.addEventListener('click', function() {
            expandableContainer.classList.remove('expanded');
            expandableContainer.classList.add('collapsed');
            showMoreButton.style.display = 'flex';
            showLessButton.style.display = 'none';

            // Scroll to show more button position
            showMoreButton.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center'
            });
        });
        
        // Add show less button to expandable content
        expandableContainer.appendChild(showLessButton);
        
        // Insert after the main list
        mainList.parentNode.insertBefore(showMoreButton, mainList.nextSibling);
        mainList.parentNode.insertBefore(expandableContainer, showMoreButton.nextSibling);
    });
}

// Update durations when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update Fin.com total duration
    const finStartDate = '2025-12-18';
    const totalDuration = calculateDuration(finStartDate);
    const companyDurationSpan = document.querySelector('#current-company-duration .dynamic-duration');
    if (companyDurationSpan) {
        companyDurationSpan.textContent = ' · ' + totalDuration;
    }

    // Update current position duration (Software Engineer III)
    const currentPositionStartDate = '2025-12-18';
    const currentPositionDuration = calculateDuration(currentPositionStartDate);
    const positionDurationSpan = document.querySelector('#current-position-duration .dynamic-duration');
    if (positionDurationSpan) {
        positionDurationSpan.textContent = ' · ' + currentPositionDuration;
    }
    
    // Update copyright year
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize theme toggle
    initThemeToggle();
    initBibtexCopy();

    // Initialize expandable content
    initializeExpandableContent();
});
