import { monthNames, getMonthMetadata } from './calendar-logic.js';

const grid = document.getElementById('calendar-grid');
const template = document.getElementById('day-template');
const displayTitle = document.getElementById('current-display');

function renderCalendar(year, month) {
    // 1. Clear UI
    grid.innerHTML = '';

    // 2. Use Logic Module to get data
    const { firstDayIndex, numberOfDays } = getMonthMetadata(year, month);
    
    // 3. Update UI Title
    displayTitle.textContent = `${monthNames[month]} ${year}`;

    // 4. Draw Padding Boxes
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyBox = document.createElement('div');
        emptyBox.classList.add('day-box');
        grid.appendChild(emptyBox);
    }

    // 5. Draw Actual Day Boxes
    for (let day = 1; day <= numberOfDays; day++) {
        const clone = template.content.cloneNode(true);
        clone.querySelector('.day-number').textContent = day;
        grid.appendChild(clone);
    }
}

// Initial Load
const today = new Date();
renderCalendar(today.getFullYear(), today.getMonth());