// Rubric Verification Tests
import {
  calculateDayDate,
  getMonthNumber,
  getDayNumber,
  getCommemorativeDaysForDate,
} from "./common.mjs";
import assert from "node:assert";
import test from "node:test";

// --- 1. CALENDAR GRID LOGIC ---
test("February 2026 starts on a Sunday", () => {
  const date = new Date(Date.UTC(2026, 1, 1));
  assert.equal(date.getUTCDay(), 0);
});

test("February 2026 ends on a Saturday", () => {
  const date = new Date(Date.UTC(2026, 1, 28));
  assert.strictEqual(date.getUTCDay(), 6);
});

// --- 2. HOLIDAY CALCULATION LOGIC (calculateDayDate) ---
test("Ada Lovelace Day 2024 is Oct 8", () => {
  const date = calculateDayDate(2024, "October", "Tuesday", "second");
  assert.equal(date.getUTCDate(), 8);
});

test("Ada Lovelace Day 2020 is Oct 13", () => {
  const date = calculateDayDate(2020, "October", "Tuesday", "second");
  assert.equal(date.getUTCDate(), 13);
});

test("World Lemur Day 2024 is Oct 25 (last Friday)", () => {
  const date = calculateDayDate(2024, "October", "Friday", "last");
  assert.equal(date.getUTCDate(), 25);
});

test("World Lemur Day 2020 is Oct 30 (last Friday)", () => {
  const date = calculateDayDate(2020, "October", "Friday", "last");
  assert.strictEqual(date.getUTCDate(), 30);
});

test("Calculate first Saturday of September 2024", () => {
  const date = calculateDayDate(2024, "September", "Saturday", "first");
  assert.equal(date.getUTCDate(), 7);
});

// --- 3. DATA INTEGRATION (getCommemorativeDaysForDate) ---
test("getCommemorativeDaysForDate finds Binturong Day on May 11, 2030", () => {
  const days = getCommemorativeDaysForDate(2030, 4, 11);
  assert.ok(days.some((d) => d.name === "International Binturong Day"));
});

test("getCommemorativeDaysForDate finds Ada Lovelace Day on Oct 8, 2024", () => {
  const days = getCommemorativeDaysForDate(2024, 9, 8);
  assert.equal(days.length, 1);
  assert.equal(days[0].name, "Ada Lovelace Day");
});

// --- 4. HELPER FUNCTIONS ---
test("getMonthNumber converts month names correctly", () => {
  assert.equal(getMonthNumber("January"), 0);
  assert.equal(getMonthNumber("October"), 9);
  assert.equal(getMonthNumber("December"), 11);
});

test("getDayNumber converts day names correctly", () => {
  assert.equal(getDayNumber("Sunday"), 0);
  assert.equal(getDayNumber("Monday"), 1);
  assert.equal(getDayNumber("Tuesday"), 2);
});
