import { useEffect, useMemo, useState } from "react";
import { DEFAULT_SETTINGS } from "../data/defaults";
import { loadStoredState, saveStoredState } from "../storage/localStorageAdapter";
import type { AppSettings, Expense, ExpenseInput, Pocket, PocketInput } from "../types";

function createId(prefix: string): string {
  if (crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function useLocalAppState() {
  const [initialState] = useState(loadStoredState);
  const [pockets, setPockets] = useState(initialState.pockets);
  const [expenses, setExpenses] = useState(initialState.expenses);
  const [categories, setCategories] = useState(initialState.categories);
  const [quickAddTemplates, setQuickAddTemplates] = useState(initialState.quickAddTemplates);
  const [settings, setSettings] = useState<AppSettings>({
    ...initialState.settings,
    lastOpenedAt: new Date().toISOString(),
  });
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    try {
      saveStoredState({ pockets, expenses, categories, quickAddTemplates, settings });
      setStorageError(null);
    } catch {
      setStorageError("Data tidak bisa disimpan di perangkat ini. Coba cek mode private/incognito atau ruang penyimpanan browser.");
    }
  }, [pockets, expenses, categories, quickAddTemplates, settings]);

  const activePocketId = useMemo(() => {
    if (settings.defaultPocketId && pockets.some((pocket) => pocket.id === settings.defaultPocketId)) {
      return settings.defaultPocketId;
    }

    return pockets[0]?.id ?? null;
  }, [pockets, settings.defaultPocketId]);

  const activePocket = useMemo(() => pockets.find((pocket) => pocket.id === activePocketId) ?? null, [activePocketId, pockets]);

  function createPocket(input: PocketInput): Pocket {
    const now = new Date().toISOString();
    const pocket: Pocket = {
      id: createId("pocket"),
      ...input,
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
    };

    setPockets((current) => [...current, pocket]);
    setSettings((current) => ({
      ...current,
      hasCompletedOnboarding: true,
      defaultPocketId: current.defaultPocketId ?? pocket.id,
    }));

    return pocket;
  }

  function updatePocket(id: string, input: PocketInput): void {
    setPockets((current) =>
      current.map((pocket) =>
        pocket.id === id
          ? {
              ...pocket,
              ...input,
              updatedAt: new Date().toISOString(),
            }
          : pocket
      )
    );
  }

  function deletePocket(id: string): void {
    setPockets((current) => current.filter((pocket) => pocket.id !== id));
    setExpenses((current) => current.filter((expense) => expense.pocketId !== id));
    setSettings((current) => {
      if (current.defaultPocketId !== id) {
        return current;
      }

      const nextPocketId = pockets.find((pocket) => pocket.id !== id)?.id ?? null;
      return {
        ...current,
        defaultPocketId: nextPocketId,
        hasCompletedOnboarding: nextPocketId !== null,
      };
    });
  }

  function setActivePocket(id: string): void {
    setSettings((current) => ({
      ...current,
      defaultPocketId: id,
      hasCompletedOnboarding: true,
    }));
  }

  function createExpense(input: ExpenseInput): Expense {
    const now = new Date().toISOString();
    const expense: Expense = {
      id: createId("expense"),
      ...input,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    setExpenses((current) => [...current, expense]);
    return expense;
  }

  function updateExpense(id: string, input: ExpenseInput): void {
    setExpenses((current) =>
      current.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              ...input,
              updatedAt: new Date().toISOString(),
            }
          : expense
      )
    );
  }

  function deleteExpense(id: string): void {
    setExpenses((current) => current.filter((expense) => expense.id !== id));
  }

  function updateSettings(nextSettings: Partial<AppSettings>): void {
    setSettings((current) => ({
      ...current,
      ...nextSettings,
    }));
  }

  function resetAllData(): void {
    setPockets([]);
    setExpenses([]);
    setCategories(initialState.categories);
    setQuickAddTemplates(initialState.quickAddTemplates);
    setSettings({
      ...DEFAULT_SETTINGS,
      lastOpenedAt: new Date().toISOString(),
    });
  }

  return {
    pockets,
    expenses,
    categories,
    quickAddTemplates,
    settings,
    activePocket,
    activePocketId,
    storageError,
    createPocket,
    updatePocket,
    deletePocket,
    setActivePocket,
    createExpense,
    updateExpense,
    deleteExpense,
    updateSettings,
    resetAllData,
  };
}
