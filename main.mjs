import { getMonthMetadata } from "./calendar-logic.mjs";
import { getMonthName } from "./common.mjs";

let currentViewYear = new Date().getFullYear();
let currentViewMonth = new Date().getMonth();

const grid = document.getElementById("calendar-grid");
const template = document.getElementById("day-template");
const displayTitle = document.getElementById("current-display");

// Navigation buttons - handle month switching
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

function renderCalendar(year, month) {
  // 1. Clear UI
  grid.innerHTML = "";

  // 2a. Get the data "box"
  const data = getMonthMetadata(year, month);

  // 2b. Take the pieces out of the box one by one
  const firstDayIndex = data.firstDayIndex;
  const numberOfDays = data.numberOfDays;

  // 3. Update UI Title
  displayTitle.textContent = `${getMonthName(month)} ${year}`;

  // 4. Draw Padding Boxes
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyBox = document.createElement("div");
    emptyBox.classList.add("day-box");
    grid.appendChild(emptyBox);
  }

  // 5. Draw Actual Day Boxes
  for (let day = 1; day <= numberOfDays; day++) {
    const clone = template.content.cloneNode(true);
    clone.querySelector(".day-number").textContent = day;
    grid.appendChild(clone);
  }

  // 6. ADD PADDING AT THE END:
  // We want the grid to always finish a full row (7 columns)
  // We keep adding empty boxes until the total count is a multiple of 7
  while (grid.children.length % 7 !== 0) {
    const emptyBox = document.createElement("div");
    emptyBox.classList.add("day-box");
    grid.appendChild(emptyBox);
  }
}

// Initial Load
const today = new Date();
renderCalendar(today.getFullYear(), today.getMonth());
