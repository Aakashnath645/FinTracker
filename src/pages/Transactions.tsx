import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, deleteTransaction } from '../db/db';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search } from 'lucide-react';
import TransactionCard from '../components/TransactionCard';
import { format } from 'date-fns';

const Transactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  
  // Fetch all transactions
  const transactions = useLiveQuery(
    () => db.transactions.orderBy('date').reverse().toArray(),
    []
  );
  
  // Fetch all categories
  const categories = useLiveQuery(
    () => db.categories.toArray(),
    []
  );
  
  // Filter transactions based on search and filters
  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    
    const matchesCategory = selectedCategoryId === null || transaction.category === selectedCategoryId;
    
    return matchesSearch && matchesType && matchesCategory;
  });
  
  // Handle transaction deletion
  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };
  
  // Group transactions by date
  const groupTransactionsByDate = () => {
    if (!filteredTransactions) return {};
    
    const grouped: Record<string, typeof filteredTransactions> = {};
    
    filteredTransactions.forEach(transaction => {
      const date = transaction.date.split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });
    
    return grouped;
  };
  
  const groupedTransactions = groupTransactionsByDate();
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Link 
          to="/transactions/add" 
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Transaction</span>
        </Link>
      </div>
      
      <div className="mb-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedType === 'all'
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedType('income')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedType === 'income'
                ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setSelectedType('expense')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedType === 'expense'
                ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
            }`}
          >
            Expense
          </button>
          
          {categories && categories.length > 0 && (
            <div className="relative ml-auto">
              <select
                value={selectedCategoryId === null ? '' : selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
                className="appearance-none pl-8 pr-10 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-none focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-6">
        {filteredTransactions && filteredTransactions.length > 0 ? (
          Object.entries(groupedTransactions)
            .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
            .map(([date, transactions]) => (
              <div key={date}>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                </h2>
                <div className="space-y-3">
                  {transactions.map(transaction => {
                    const category = categories?.find(c => c.id === transaction.category);
                    if (!category) return null;
                    
                    return (
                      <TransactionCard
                        key={transaction.id}
                        transaction={transaction}
                        category={category}
                        onDelete={handleDeleteTransaction}
                      />
                    );
                  })}
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            {searchTerm || selectedType !== 'all' || selectedCategoryId !== null
              ? 'No transactions match your filters'
              : 'No transactions yet. Add your first one!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;