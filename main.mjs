import { getMonthMetadata } from "./calendar-logic.mjs";
import { getMonthName } from "./common.mjs";
import { getCommemorativeDaysForDate, fetchDescription } from './common.mjs';

let currentViewYear = new Date().getFullYear();
let currentViewMonth = new Date().getMonth();

const grid = document.getElementById("calendar-grid");
const template = document.getElementById("day-template");
const displayTitle = document.getElementById("current-display");

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

nextBtn.addEventListener('click', () => {
    currentViewMonth++;
    if (currentViewMonth > 11) {
        currentViewMonth = 0;
        currentViewYear++;
    }
    renderCalendar(currentViewYear, currentViewMonth);
});

prevBtn.addEventListener('click', () => {
    currentViewMonth--;
    if (currentViewMonth < 0) {
        currentViewMonth = 11;
        currentViewYear--;
    }
    renderCalendar(currentViewYear, currentViewMonth);
});

const monthSelect = document.getElementById('month-select');
const yearInput = document.getElementById('year-input');
const goBtn = document.getElementById('go-btn');

goBtn.addEventListener('click', () => {
    currentViewMonth = parseInt(monthSelect.value);
    currentViewYear = parseInt(yearInput.value);
    renderCalendar(currentViewYear, currentViewMonth);
});

function renderCalendar(year, month) {
  grid.innerHTML = "";
  const data = getMonthMetadata(year, month);
  const firstDayIndex = data.firstDayIndex;
  const numberOfDays = data.numberOfDays;

  displayTitle.textContent = `${getMonthName(month)} ${year}`;
  monthSelect.value = month;
  yearInput.value = year;

  // 1. Draw Padding Boxes
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyBox = document.createElement("div");
    emptyBox.classList.add("day-box");
    grid.appendChild(emptyBox);
  }

  // 2. Draw Actual Day Boxes
  for (let day = 1; day <= numberOfDays; day++) {
    const clone = template.content.cloneNode(true);
    clone.querySelector(".day-number").textContent = day;
    
    const commemorativeDays = getCommemorativeDaysForDate(year, month, day);
    const eventsDiv = clone.querySelector(".day-events");
    
    commemorativeDays.forEach(dayInfo => {
      const eventSpan = document.createElement('span');
      eventSpan.textContent = dayInfo.name;
      eventSpan.style.display = 'block';
      eventSpan.style.cursor = 'pointer';
      eventSpan.style.textDecoration = 'underline';
      eventSpan.style.color = 'blue';
      
      eventSpan.addEventListener('click', async () => {
        const description = await fetchDescription(dayInfo.descriptionURL);
        alert(`${dayInfo.name}\n\n${description}`);
      });
      
      eventsDiv.appendChild(eventSpan);
    });
    
    grid.appendChild(clone);
  }

  while (grid.children.length % 7 !== 0) {
    const emptyBox = document.createElement("div");
    emptyBox.classList.add("day-box");
    grid.appendChild(emptyBox);
  }
}

const today = new Date();
renderCalendar(today.getFullYear(), today.getMonth());