export const monthNames = [
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

/**
 * Calculates the first day of the month and how many days it has.
 */
export function getMonthMetadata(year, month) {
  const firstDayIndex = new Date(year, month, 1).getDay();
  const numberOfDays = new Date(year, month + 1, 0).getDate();

  return {
    firstDayIndex,
    numberOfDays,
  };
}
