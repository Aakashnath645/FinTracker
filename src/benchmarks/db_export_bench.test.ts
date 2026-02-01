import { describe, it, expect, beforeAll } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '../db/db';

describe('Database Export Benchmark', () => {
  beforeAll(async () => {
    // Clear any existing data
    await db.delete();
    await db.open();

    // Populate with data
    const transactionCount = 10000; // Increased to ensure measurable difference
    const categoryCount = 100;
    const budgetCount = 50;

    const transactions = [];
    for (let i = 0; i < transactionCount; i++) {
      transactions.push({
        type: i % 2 === 0 ? 'expense' : 'income',
        category: (i % categoryCount) + 1,
        amount: Math.random() * 1000,
        date: new Date().toISOString(),
        note: `Transaction ${i}`
      });
    }

    const categories = [];
    for (let i = 0; i < categoryCount; i++) {
      categories.push({
        name: `Category ${i}`,
        type: i % 2 === 0 ? 'expense' : 'income',
        color: '#000000',
        icon: 'tag'
      });
    }

    const budgets = [];
    for (let i = 0; i < budgetCount; i++) {
      budgets.push({
        category: (i % categoryCount) + 1,
        amount: 1000,
        period: 'monthly'
      });
    }

    await db.transaction('rw', db.transactions, db.categories, db.budgets, async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await db.transactions.bulkAdd(transactions as any);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await db.categories.bulkAdd(categories as any);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await db.budgets.bulkAdd(budgets as any);
    });

    console.log(`Database populated with ${transactionCount} transactions, ${categoryCount} categories, ${budgetCount} budgets.`);
  });

  it('measures sequential data fetching', async () => {
    const start = performance.now();

    const allTransactions = await db.transactions.toArray();
    const allCategories = await db.categories.toArray();
    const allBudgets = await db.budgets.toArray();

    const end = performance.now();
    const duration = end - start;
    console.log(`Sequential Fetch Duration: ${duration.toFixed(2)}ms`);

    expect(allTransactions.length).toBe(10000);
    expect(allCategories.length).toBe(112); // 100 added + 12 default
    expect(allBudgets.length).toBe(50);
  });

  it('measures parallel data fetching', async () => {
    const start = performance.now();

    const [allTransactions, allCategories, allBudgets] = await Promise.all([
      db.transactions.toArray(),
      db.categories.toArray(),
      db.budgets.toArray()
    ]);

    const end = performance.now();
    const duration = end - start;
    console.log(`Parallel Fetch Duration: ${duration.toFixed(2)}ms`);

    expect(allTransactions.length).toBe(10000);
    expect(allCategories.length).toBe(112); // 100 added + 12 default
    expect(allBudgets.length).toBe(50);
  });
});
