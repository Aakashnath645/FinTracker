import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { Transaction } from '../types/Transaction';
import { Category } from '../types/Category';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

interface TransactionCardProps {
  transaction: Transaction;
  category: Category;
  onDelete: (id: number) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ 
  transaction, 
  category,
  onDelete
}) => {
  const navigate = useNavigate();
  
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(transaction.amount);
  
  const timeAgo = formatDistanceToNow(new Date(transaction.date), { addSuffix: true });
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md">
      <div className="p-4">
        <div className="flex items-start justify-between">
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
              <h3 className="font-medium">{transaction.description}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {category.name} • {timeAgo}
              </p>
            </div>
          </div>
          
          <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {transaction.type === 'income' ? '+' : '-'}{formattedAmount}
          </p>
        </div>
        
        {transaction.notes && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {transaction.notes}
          </p>
        )}
        
        <div className="flex items-center justify-end gap-2 mt-3">
          <button
            onClick={() => navigate(`/transactions/edit/${transaction.id}`)}
            className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Edit transaction"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => transaction.id && onDelete(transaction.id)}
            className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Delete transaction"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {transaction.receiptImage && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <img 
              src={transaction.receiptImage} 
              alt="Receipt" 
              className="h-20 object-contain rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;