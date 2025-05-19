import { Category } from '../types/Category';

export const defaultCategories: Omit<Category, 'id'>[] = [
  // Income categories
  {
    name: 'Salary',
    type: 'income',
    color: '#22C55E', // green
    icon: 'briefcase'
  },
  {
    name: 'Freelance',
    type: 'income',
    color: '#0EA5E9', // sky
    icon: 'laptop'
  },
  {
    name: 'Investments',
    type: 'income',
    color: '#6366F1', // indigo
    icon: 'trending-up'
  },
  {
    name: 'Gifts',
    type: 'income',
    color: '#EC4899', // pink
    icon: 'gift'
  },
  
  // Expense categories
  {
    name: 'Food & Dining',
    type: 'expense',
    color: '#F97316', // orange
    icon: 'utensils'
  },
  {
    name: 'Housing',
    type: 'expense',
    color: '#8B5CF6', // violet
    icon: 'home'
  },
  {
    name: 'Transportation',
    type: 'expense',
    color: '#EF4444', // red
    icon: 'car'
  },
  {
    name: 'Entertainment',
    type: 'expense',
    color: '#EC4899', // pink
    icon: 'film'
  },
  {
    name: 'Shopping',
    type: 'expense',
    color: '#06B6D4', // cyan
    icon: 'shopping-bag'
  },
  {
    name: 'Healthcare',
    type: 'expense',
    color: '#10B981', // emerald
    icon: 'activity'
  },
  {
    name: 'Education',
    type: 'expense',
    color: '#0EA5E9', // sky blue
    icon: 'book-open'
  },
  {
    name: 'Bills & Utilities',
    type: 'expense',
    color: '#6366F1', // indigo
    icon: 'file-text'
  }
];