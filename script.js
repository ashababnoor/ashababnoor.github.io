// Calculate total duration at Pathao
function calculateDuration(startDate, endDate = null) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    
    // If we've started the next month (even by 1 day), count it as a full month
    if (end.getDate() >= 1) {
        months++;
    }
    
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
    
    const positionDescriptions = document.querySelectorAll('.position-description');
    
    positionDescriptions.forEach(description => {
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
    // Update Pathao total duration
    const pathaoStartDate = '2022-10-01'; // Oct 2022 when internship started
    const totalDuration = calculateDuration(pathaoStartDate);
    const pathaoDurationElement = document.getElementById('pathao-duration');
    
    if (pathaoDurationElement) {
        pathaoDurationElement.textContent = `Oct 2022 - Present · ${totalDuration}`;
    }
    
    // Update current position duration (Data Engineer II)
    const currentPositionStartDate = '2024-07-01'; // Jul 2024
    const currentPositionDuration = calculateDuration(currentPositionStartDate);
    const currentPositionElement = document.getElementById('current-position-duration');
    
    if (currentPositionElement) {
        currentPositionElement.textContent = `Jul 2024 - Present · ${currentPositionDuration}`;
    }
    
    // Update copyright year
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize expandable content
    initializeExpandableContent();
});
