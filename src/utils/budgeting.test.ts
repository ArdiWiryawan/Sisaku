import { describe, expect, it } from "vitest";
import type { Expense, Income, Pocket } from "../types";
import { calculatePocketSummary } from "./budgeting";

const pocket: Pocket = {
  id: "pocket_1",
  name: "Uang Minggu Ini",
  totalBudget: 300000,
  startDate: "2026-06-21",
  endDate: "2026-06-27",
  type: "general",
  note: "",
  createdAt: "2026-06-21T00:00:00.000Z",
  updatedAt: "2026-06-21T00:00:00.000Z",
  archivedAt: null,
};

function expense(amount: number, date = "2026-06-21"): Expense {
  return {
    id: `expense_${amount}`,
    pocketId: "pocket_1",
    amount,
    categoryId: "cat_food",
    title: "Makan",
    date,
    note: "",
    createdAt: "2026-06-21T00:00:00.000Z",
    updatedAt: "2026-06-21T00:00:00.000Z",
    deletedAt: null,
  };
}

function income(amount: number, date = "2026-06-21"): Income {
  return {
    id: `income_${amount}`,
    pocketId: "pocket_1",
    amount,
    title: "Kiriman",
    date,
    note: "",
    createdAt: "2026-06-21T00:00:00.000Z",
    updatedAt: "2026-06-21T00:00:00.000Z",
    deletedAt: null,
  };
}

describe("calculatePocketSummary", () => {
  it("calculates initial safe-to-spend for 300000 over 7 days", () => {
    const summary = calculatePocketSummary(pocket, [], "2026-06-21");

    expect(summary.totalDays).toBe(7);
    expect(Math.round(summary.safePerDay)).toBe(42857);
    expect(summary.status).toBe("Aman");
  });

  it("updates remaining money and safe-to-spend after expense", () => {
    const summary = calculatePocketSummary(pocket, [expense(60000)], "2026-06-22");

    expect(summary.remainingMoney).toBe(240000);
    expect(summary.remainingDays).toBe(6);
    expect(summary.safePerDay).toBe(40000);
    expect(summary.todayAllowance).toBe(40000);
  });

  it("adds income to total available money and safe-to-spend", () => {
    const summary = calculatePocketSummary(pocket, [expense(60000)], [income(100000)], "2026-06-22");

    expect(summary.totalIncome).toBe(100000);
    expect(summary.totalAvailable).toBe(400000);
    expect(summary.remainingMoney).toBe(340000);
    expect(summary.remainingDays).toBe(6);
    expect(Math.round(summary.safePerDay)).toBe(56667);
  });

  it("decreases safePerDay when spending today while keeping todayAllowance constant", () => {
    const summary = calculatePocketSummary(pocket, [expense(18000, "2026-06-21")], "2026-06-21");

    expect(summary.remainingMoney).toBe(282000);
    expect(summary.remainingDays).toBe(7);
    expect(Math.round(summary.todayAllowance)).toBe(42857);
    expect(Math.round(summary.safePerDay)).toBe(24857);
  });

  it("marks budget as dangerous when remaining money is gone", () => {
    const summary = calculatePocketSummary(pocket, [expense(320000)], "2026-06-22");

    expect(summary.remainingMoney).toBe(-20000);
    expect(summary.status).toBe("Bahaya");
  });

  it("handles a one day budget as one full day", () => {
    const oneDayPocket = {
      ...pocket,
      totalBudget: 50000,
      startDate: "2026-06-21",
      endDate: "2026-06-21",
    };
    const summary = calculatePocketSummary(oneDayPocket, [], "2026-06-21");

    expect(summary.totalDays).toBe(1);
    expect(summary.remainingDays).toBe(1);
    expect(summary.safePerDay).toBe(50000);
  });
});
