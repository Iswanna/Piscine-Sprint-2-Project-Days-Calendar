// This script generates an iCal file with all commemorative days from 2020-2030

import { calculateDayDate, fetchDescription } from "./common.mjs";
import daysData from "./days.json" with { type: "json" };
import { writeFileSync } from "fs";

/**
 * Generate the iCal file
 */
async function generateICalFile() {
  console.log("Generating iCal file...");

  // Start building the iCal content
  let icalContent = "";

  // Add iCal header
  icalContent += "BEGIN:VCALENDAR\n";
  icalContent += "VERSION:2.0\n";
  icalContent += "PRODID:-//Days Calendar//EN\n";
  icalContent += "CALSCALE:GREGORIAN\n";

  // Generate events for each year from 2020 to 2030
  for (let year = 2020; year <= 2030; year++) {
    console.log(`Processing year ${year}...`);

    // For each commemorative day
    for (const dayInfo of daysData) {
      // Calculate the date this day occurs in this year
      const date = calculateDayDate(
        year,
        dayInfo.monthName,
        dayInfo.dayName,
        dayInfo.occurrence,
      );

      // Fetch the description
      console.log(`  Fetching description for ${dayInfo.name}...`);
      const description = await fetchDescription(dayInfo.descriptionURL);

      // Format date as YYYYMMDD
      const dateStr = formatDateForICal(date);

      // Add event to iCal
      icalContent += "BEGIN:VEVENT\n";
      icalContent += `UID:${dayInfo.name.replace(/ /g, "-")}-${year}@dayscalendar.com\n`;
      icalContent += `DTSTAMP:${dateStr}\n`;
      icalContent += `DTSTART;VALUE=DATE:${dateStr}\n`;
      icalContent += `SUMMARY:${dayInfo.name}\n`;
      icalContent += `DESCRIPTION:${escapeICalText(description)}\n`;
      icalContent += "END:VEVENT\n";
    }
  }

  // Add iCal footer
  icalContent += "END:VCALENDAR\n";

  // Write to file
  writeFileSync("days.ics", icalContent, "utf-8");

  console.log("iCal file generated successfully: days.ics");
}

/**
 * Format a date for iCal (YYYYMMDD)
 */
function formatDateForICal(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * Escape special characters for iCal text fields
 */
function escapeICalText(text) {
  // Replace newlines with \n and escape commas and semicolons
  return text.replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

// Run the generator
generateICalFile();
