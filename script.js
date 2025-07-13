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
});
