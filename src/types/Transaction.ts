export interface Transaction {
  id?: number;
  type: 'income' | 'expense';
  amount: number;
  category: number; // Category ID
  date: string; // ISO date string
  description: string;
  notes?: string;
  receiptImage?: string; // Base64 encoded image
  labels?: string[];
  paymentMethod?: string;
  location?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}