export interface Category {
  id?: number;
  name: string;
  type: 'income' | 'expense';
  color: string; // Hex color code
  icon: string; // Icon name from lucide-react
}