// This file handles the web page calendar display

import { getMonthName, fetchDescription } from "./common.mjs";
import { getCommemorativeDaysForDate } from "./calendar-data.mjs";

// Current month and year being displayed
let currentMonth;
let currentYear;

/**
 * Initialize the calendar when the page loads
 */
window.onload = function() {
    // Start with the current month
    const now = new Date();
    currentMonth = now.getMonth();
    currentYear = now.getFullYear();
    
    // Create the UI
    createUI();
    
    // Display the calendar
    displayCalendar();
};

/**
 * Create the user interface elements
 */
function createUI() {
    const root = document.getElementById("app") || document.querySelector("body");
    root.style.fontFamily = "Arial, sans-serif";
    root.style.padding = "20px";
    
    // Create container
    const container = document.createElement("div");
    
    // Create title
    const title = document.createElement("h1");
    title.id = "monthYearTitle";
    container.appendChild(title);
    
    // Create navigation buttons
    const navDiv = document.createElement("div");
    navDiv.style.marginBottom = "20px";
    
    const prevButton = document.createElement("button");
    prevButton.innerText = "Previous Month";
    prevButton.onclick = previousMonth;
    navDiv.appendChild(prevButton);
    
    const nextButton = document.createElement("button");
    nextButton.innerText = "Next Month";
    nextButton.style.marginLeft = "10px";
    nextButton.onclick = nextMonth;
    navDiv.appendChild(nextButton);
    
    container.appendChild(navDiv);
    
    // Create month/year selector
    const selectorDiv = document.createElement("div");
    selectorDiv.style.marginBottom = "20px";
    
    const monthLabel = document.createElement("label");
    monthLabel.htmlFor = "monthSelect";
    monthLabel.innerText = "Month";
    monthLabel.style.marginRight = "6px";
    selectorDiv.appendChild(monthLabel);

    const monthSelect = document.createElement("select");
    monthSelect.id = "monthSelect";
    for (let i = 0; i < 12; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.innerText = getMonthName(i);
        monthSelect.appendChild(option);
    }
    selectorDiv.appendChild(monthSelect);
    
    const yearLabel = document.createElement("label");
    yearLabel.htmlFor = "yearSelect";
    yearLabel.innerText = "Year";
    yearLabel.style.marginLeft = "10px";
    yearLabel.style.marginRight = "6px";
    selectorDiv.appendChild(yearLabel);

    const yearSelect = document.createElement("select");
    yearSelect.id = "yearSelect";
    // Create year options from 1900 to 2100
    for (let year = 1900; year <= 2100; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.innerText = year;
        yearSelect.appendChild(option);
    }
    yearSelect.style.marginLeft = "10px";
    selectorDiv.appendChild(yearSelect);
    
    const jumpButton = document.createElement("button");
    jumpButton.innerText = "Go to Month";
    jumpButton.style.marginLeft = "10px";
    jumpButton.onclick = jumpToMonth;
    selectorDiv.appendChild(jumpButton);
    
    container.appendChild(selectorDiv);
    
    // Create calendar grid
    const calendarDiv = document.createElement("div");
    calendarDiv.id = "calendar";
    calendarDiv.style.display = "grid";
    calendarDiv.style.gridTemplateColumns = "repeat(7, 1fr)";
    calendarDiv.style.gap = "5px";
    calendarDiv.style.maxWidth = "800px";
    container.appendChild(calendarDiv);
    
    // Create modal for showing descriptions
    const modal = document.createElement("div");
    modal.id = "descriptionModal";
    modal.style.display = "none";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "white";
    modal.style.border = "2px solid black";
    modal.style.padding = "20px";
    modal.style.maxWidth = "500px";
    modal.style.zIndex = "1000";
    
    const modalContent = document.createElement("div");
    modalContent.id = "modalContent";
    modal.appendChild(modalContent);
    
    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.style.marginTop = "10px";
    closeButton.onclick = closeModal;
    modal.appendChild(closeButton);
    
    container.appendChild(modal);
    
    // Add overlay
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.style.display = "none";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "999";
    overlay.onclick = closeModal;
    container.appendChild(overlay);
    
    root.appendChild(container);
}

/**
 * Display the calendar for the current month and year
 */
function displayCalendar() {
    // Update title
    const title = document.getElementById("monthYearTitle");
    title.innerText = `${getMonthName(currentMonth)} ${currentYear}`;
    
    // Update selectors
    document.getElementById("monthSelect").value = currentMonth;
    document.getElementById("yearSelect").value = currentYear;
    
    // Get calendar grid
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = ""; // Clear existing content
    
    // Add day headers (Monday to Sunday)
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    for (const dayName of dayNames) {
        const header = document.createElement("div");
        header.innerText = dayName;
        header.style.fontWeight = "bold";
        header.style.padding = "10px";
        header.style.textAlign = "center";
        header.style.backgroundColor = "#f0f0f0";
        calendar.appendChild(header);
    }
    
    // Get first day of the month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0=Sunday, 1=Monday, etc.
    
    // Convert to Monday-based (0=Monday, 6=Sunday)
    let startOffset = firstDayOfWeek - 1;
    if (startOffset < 0) startOffset = 6; // Sunday becomes 6
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startOffset; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.style.padding = "10px";
        emptyCell.style.border = "1px solid #ddd";
        emptyCell.style.minHeight = "80px";
        calendar.appendChild(emptyCell);
    }
    
    // Get number of days in the month
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.style.padding = "10px";
        dayCell.style.border = "1px solid #ddd";
        dayCell.style.minHeight = "80px";
        dayCell.style.backgroundColor = "white";
        
        // Add day number
        const dayNumber = document.createElement("div");
        dayNumber.innerText = day;
        dayNumber.style.fontWeight = "bold";
        dayCell.appendChild(dayNumber);
        
        // Check if any commemorative days occur on this date
        const commemorativeDays = getCommemorativeDaysForDate(currentYear, currentMonth, day);
        
        for (const commemorativeDay of commemorativeDays) {
            const dayLabel = document.createElement("div");
            dayLabel.innerText = commemorativeDay.name;
            dayLabel.style.marginTop = "5px";
            dayLabel.style.fontSize = "12px";
            dayLabel.style.color = "blue";
            dayLabel.style.cursor = "pointer";
            dayLabel.style.textDecoration = "underline";
            
            // Add click handler to show description
            dayLabel.onclick = function() {
                showDescription(commemorativeDay);
            };
            
            dayCell.appendChild(dayLabel);
        }
        
        calendar.appendChild(dayCell);
    }
}

/**
 * Go to the previous month
 */
function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    displayCalendar();
}

/**
 * Go to the next month
 */
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    displayCalendar();
}

/**
 * Jump to a selected month and year
 */
function jumpToMonth() {
    currentMonth = parseInt(document.getElementById("monthSelect").value);
    currentYear = parseInt(document.getElementById("yearSelect").value);
    displayCalendar();
}

/**
 * Show description modal for a commemorative day
 */
async function showDescription(dayInfo) {
    const modal = document.getElementById("descriptionModal");
    const modalContent = document.getElementById("modalContent");
    const overlay = document.getElementById("overlay");
    
    // Show loading message
    modalContent.innerHTML = `<h2>${dayInfo.name}</h2><p>Loading description...</p>`;
    modal.style.display = "block";
    overlay.style.display = "block";
    
    // Fetch and display description
    const description = await fetchDescription(dayInfo.descriptionURL);
    modalContent.innerHTML = `<h2>${dayInfo.name}</h2><p>${description}</p>`;
}

/**
 * Close the description modal
 */
function closeModal() {
    document.getElementById("descriptionModal").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}
