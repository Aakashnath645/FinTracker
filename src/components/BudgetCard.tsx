import React from 'react';
import { Budget } from '../types/Budget';
import { Category } from '../types/Category';
import { Edit, Trash } from 'lucide-react';
import Icon from './Icon';
import { useNavigate } from 'react-router-dom';

interface BudgetCardProps {
  budget: Budget;
  category: Category;
  spent: number;
  onDelete: (id: number) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ 
  budget, 
  category, 
  spent, 
  onDelete 
}) => {
  const navigate = useNavigate();
  
  // Calculate progress as a percentage
  const progress = Math.min(Math.round((spent / budget.amount) * 100), 100);
  const remaining = Math.max(budget.amount - spent, 0);
  
  // Format currency
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  
  const getProgressColor = () => {
    if (progress < 70) return 'bg-green-500';
    if (progress < 90) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: category.color + '20' }}
          >
            <Icon 
              name={category.icon} 
              className="h-5 w-5" 
              color={category.color} 
            />
          </div>
          
          <div>
            <h3 className="font-medium">
              {budget.name || category.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} budget
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/budgets/edit/${budget.id}`)}
            className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Edit budget"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => budget.id && onDelete(budget.id)}
            className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Delete budget"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>
            Spent: <span className="font-medium">{formatter.format(spent)}</span>
          </span>
          <span>
            Budget: <span className="font-medium">{formatter.format(budget.amount)}</span>
          </span>
        </div>
        
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${getProgressColor()}`} 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="font-medium">
            {formatter.format(remaining)} remaining
          </span>
          <span className={`font-medium ${
            progress < 70 ? 'text-green-600 dark:text-green-400' : 
            progress < 90 ? 'text-amber-600 dark:text-amber-400' : 
            'text-red-600 dark:text-red-400'
          }`}>
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;