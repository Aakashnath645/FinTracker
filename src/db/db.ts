import Dexie, { Table } from 'dexie';
import { Transaction } from '../types/Transaction';
import { Category } from '../types/Category';
import { Budget } from '../types/Budget';
import { defaultCategories } from './defaultData';

class FinanceDatabase extends Dexie {
  transactions!: Table<Transaction, number>;
  categories!: Table<Category, number>;
  budgets!: Table<Budget, number>;

  constructor() {
    super('financeTracker');
    
    this.version(1).stores({
      transactions: '++id, type, category, amount, date, [date+category]',
      categories: '++id, name, type, color, icon',
      budgets: '++id, category, amount, period, [period+category]'
    });
    
    this.on('populate', async () => {
      // Add default categories when the database is first created
      await this.categories.bulkAdd(defaultCategories);
    });
  }
}

export const db = new FinanceDatabase();

// Helper functions for common database operations

// Transactions
export async function addTransaction(transaction: Omit<Transaction, 'id'>) {
  return db.transactions.add(transaction as Transaction);
}

export async function updateTransaction(id: number, changes: Partial<Transaction>) {
  return db.transactions.update(id, changes);
}

export async function deleteTransaction(id: number) {
  return db.transactions.delete(id);
}

// Categories
export async function addCategory(category: Omit<Category, 'id'>) {
  return db.categories.add(category as Category);
}

export async function updateCategory(id: number, changes: Partial<Category>) {
  return db.categories.update(id, changes);
}

export async function deleteCategory(id: number) {
  return db.categories.delete(id);
}

// Budgets
export async function addBudget(budget: Omit<Budget, 'id'>) {
  return db.budgets.add(budget as Budget);
}

export async function updateBudget(id: number, changes: Partial<Budget>) {
  return db.budgets.update(id, changes);
}

export async function deleteBudget(id: number) {
  return db.budgets.delete(id);
}