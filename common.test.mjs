// Unit tests for the common functions

import { calculateDayDate, getMonthNumber, getDayNumber } from "./common.mjs";
import assert from "node:assert";
import test from "node:test";

test("Calculate Ada Lovelace Day 2024 (second Tuesday of October)", () => {
    const date = calculateDayDate(2024, "October", "Tuesday", "second");
    assert.equal(date.getUTCFullYear(), 2024);
    assert.equal(date.getUTCMonth(), 9); // October is month 9 (0-indexed)
    assert.equal(date.getUTCDate(), 8);
});

test("Calculate Ada Lovelace Day 2020 (second Tuesday of October)", () => {
    const date = calculateDayDate(2020, "October", "Tuesday", "second");
    assert.equal(date.getUTCFullYear(), 2020);
    assert.equal(date.getUTCMonth(), 9);
    assert.equal(date.getUTCDate(), 13);
});


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

