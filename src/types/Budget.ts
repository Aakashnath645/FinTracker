export interface Budget {
  id?: number;
  category: number; // Category ID
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  name?: string;
  isRecurring?: boolean;
}