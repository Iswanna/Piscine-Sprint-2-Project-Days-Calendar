import daysData from "./days.json" with { type: "json" };

// This file contains shared functions used by both the web page and the iCal generator

/**
 * Calculate which date a commemorative day falls on in a given year
 * @param {number} year - The year (e.g., 2024)
 * @param {string} monthName - Name of the month (e.g., "October")
 * @param {string} dayName - Day of the week (e.g., "Tuesday")
 * @param {string} occurence - Which occurrence (e.g., "first", "second", "third", "fourth", "last")
 * @returns {Date} The calculated date
 */
export function calculateDayDate(year, monthName, dayName, occurence) {
  // Convert month name to month number (0-11 for JavaScript Date)
  const monthNumber = getMonthNumber(monthName);

  // Convert day name to day number (0=Sunday, 1=Monday, etc.)
  const targetDayNumber = getDayNumber(dayName);

  // Start at the first day of the month
  let date = new Date(Date.UTC(year, monthNumber, 1));

  // Find the first occurrence of the target day in the month
  while (date.getUTCDay() !== targetDayNumber) {
    date.setUTCDate(date.getUTCDate() + 1);
  }

  // Now we have the first occurrence of the target day
  // Move forward based on which occurrence we need
  if (occurence === "first") {
    // Already at first occurrence
  } else if (occurence === "second") {
    date.setUTCDate(date.getUTCDate() + 7);
  } else if (occurence === "third") {
    date.setUTCDate(date.getUTCDate() + 14);
  } else if (occurence === "fourth") {
    date.setUTCDate(date.getUTCDate() + 21);
  } else if (occurence === "last") {
    // Keep moving forward by weeks until we'd leave the month
    while (true) {
      let nextWeek = new Date(date);
      nextWeek.setUTCDate(nextWeek.getUTCDate() + 7);
      // If next week would be in a different month, stop
      if (nextWeek.getUTCMonth() !== monthNumber) {
        break;
      }
      date = nextWeek;
    }
  }

  return date;
}

/**
 * Convert month name to month number (0-11)
 */
export function getMonthNumber(monthName) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months.indexOf(monthName);
}

/**
 * Convert day name to day number (0=Sunday, 1=Monday, etc.)
 */
export function getDayNumber(dayName) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days.indexOf(dayName);
}

/**
 * Get the name of a month from its number
 */
export function getMonthName(monthNumber) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNumber];
}

/**
 * Find which commemorative days occur on a specific date
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @param {number} day - The day of the month
 * @returns {Array} Array of commemorative days that occur on this date
 */
export function getCommemorativeDaysForDate(year, month, day) {
  const results = [];
  
  for (const dayInfo of daysData) {
    // Calculate when this day occurs in the given year
    const date = calculateDayDate(year, dayInfo.monthName, dayInfo.dayName, dayInfo.occurrence);
    
    // Check if it matches our target date
    if (date.getUTCFullYear() === year && 
        date.getUTCMonth() === month && 
        date.getUTCDate() === day) {
      results.push(dayInfo);
    }
  }
  
  return results;
}

/**
 * Fetch description text from a URL
 * @param {string} url - The URL to fetch from
 * @returns {Promise<string>} The description text
 */
export async function fetchDescription(url) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error fetching description:", error);
    return "Description not available.";
  }
}
