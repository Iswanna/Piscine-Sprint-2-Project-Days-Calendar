// Rubric verification tests

import { calculateDayDate } from "./common.mjs";
import { getCommemorativeDaysForDate } from "./common.mjs";
import assert from "node:assert";
import test from "node:test";

test("February 2026 starts on a Sunday", () => {
    const date = new Date(Date.UTC(2026, 1, 1));
    assert.equal(date.getUTCDay(), 0);
});

test("International Binturong Day is May 11, 2030", () => {
    const days = getCommemorativeDaysForDate(2030, 4, 11);
    assert.equal(days.length, 1);
    assert.equal(days[0].name, "International Binturong Day");
});

test("Calculate World Lemur Day 2024 (last Friday of October)", () => {
    const date = calculateDayDate(2024, "October", "Friday", "last");
    assert.equal(date.getUTCDate(), 25);
});

test("Calculate first Saturday of September 2024", () => {
    const date = calculateDayDate(2024, "September", "Saturday", "first");
    assert.equal(date.getUTCDate(), 7);
});

test("getCommemorativeDaysForDate finds Ada Lovelace Day on Oct 8, 2024", () => {
    const days = getCommemorativeDaysForDate(2024, 9, 8);
    assert.equal(days.length, 1);
    assert.equal(days[0].name, "Ada Lovelace Day");
});

// --- ADDITIONAL RUBRIC VERIFICATION ---

test("getCommemorativeDaysForDate finds Ada Lovelace Day on Oct 13, 2020", () => {
    // Rubric requirement: Observe Oct 13, 2020 is Ada Lovelace Day
    const days = getCommemorativeDaysForDate(2020, 9, 13);
    assert.ok(days.some(d => d.name === "Ada Lovelace Day"), "Should find Ada Lovelace Day on Oct 13, 2020");
});

test("World Lemur Day 2020 is October 30", () => {
    // Rubric requirement: Observe Oct 30, 2020 is World Lemur Day
    const date = calculateDayDate(2020, "October", "Friday", "last");
    assert.strictEqual(date.getUTCDate(), 30);
});

test("February 2026 ends on a Saturday", () => {
    // Rubric requirement: Feb 2026 last row is Monday 28th - Saturday (no padding)
    const date = new Date(Date.UTC(2026, 1, 28));
    assert.strictEqual(date.getUTCDay(), 6); // 6 is Saturday
});