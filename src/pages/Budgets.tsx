import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, addBudget, deleteBudget } from '../db/db';
import { Plus, X } from 'lucide-react';
import BudgetCard from '../components/BudgetCard';
import Icon from '../components/Icon';

const Budgets: React.FC = () => {
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'weekly' | 'daily' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  
  // Fetch all budgets
  const budgets = useLiveQuery(
    () => db.budgets.toArray(),
    []
  );
  
  // Fetch all expense categories
  const categories = useLiveQuery(
    () => db.categories.where('type').equals('expense').toArray(),
    []
  );
  
  // Fetch all transactions to calculate spent amounts
  const transactions = useLiveQuery(
    () => db.transactions.where('type').equals('expense').toArray(),
    []
  );
  
  // Calculate how much spent for each budget
  const calculateSpentAmount = (budgetId: number | undefined) => {
    if (!budgetId || !transactions || !budgets) return 0;
    
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) return 0;
    
    const now = new Date();
    const startDate = new Date(budget.startDate);
    
    let endDate;
    if (budget.endDate) {
      endDate = new Date(budget.endDate);
    } else {
      // If no end date, calculate based on period
      endDate = new Date(startDate);
      switch (budget.period) {
        case 'daily':
          endDate.setDate(endDate.getDate() + 1);
          break;
        case 'weekly':
          endDate.setDate(endDate.getDate() + 7);
          break;
        case 'monthly':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'yearly':
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }
    }
    
    // If budget is in the past, use the end date
    // If budget is current, use current date
    const effectiveEndDate = now < endDate ? now : endDate;
    
    return transactions
      .filter(t => 
        t.category === budget.category && 
        new Date(t.date) >= startDate && 
        new Date(t.date) <= effectiveEndDate
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryId) {
      alert('Please select a category');
      return;
    }
    
    setLoading(true);
    
    try {
      const now = new Date();
      let endDate;
      
      switch (period) {
        case 'daily':
          endDate = new Date(now);
          endDate.setDate(endDate.getDate() + 1);
          break;
        case 'weekly':
          endDate = new Date(now);
          endDate.setDate(endDate.getDate() + 7);
          break;
        case 'monthly':
          endDate = new Date(now);
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'yearly':
          endDate = new Date(now);
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }
      
      const budgetData = {
        category: categoryId,
        amount: parseFloat(amount),
        period,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        isRecurring: true
      };
      
      await addBudget(budgetData);
      
      // Reset form
      setCategoryId(undefined);
      setAmount('');
      setShowAddBudget(false);
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Error saving budget. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle budget deletion
  const handleDeleteBudget = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      await deleteBudget(id);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <button 
          onClick={() => setShowAddBudget(true)}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Budget</span>
        </button>
      </div>
      
      {showAddBudget && (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Add New Budget</h2>
            <button
              onClick={() => setShowAddBudget(false)}
              className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {categories?.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setCategoryId(category.id)}
                    className={`flex flex-col items-center p-3 rounded-lg border ${
                      categoryId === category.id
                        ? 'border-2 border-blue-500'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <Icon 
                        name={category.icon} 
                        className="h-5 w-5" 
                        color={category.color} 
                      />
                    </div>
                    <span className="text-xs text-center">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Period</label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPeriod('daily')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium ${
                    period === 'daily'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  Daily
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('weekly')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium ${
                    period === 'weekly'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  Weekly
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('monthly')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium ${
                    period === 'monthly'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('yearly')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium ${
                    period === 'yearly'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Saving...' : 'Create Budget'}
            </button>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets && budgets.length > 0 ? (
          budgets.map(budget => {
            const category = categories?.find(c => c.id === budget.category);
            if (!category) return null;
            
            const spentAmount = calculateSpentAmount(budget.id);
            
            return (
              <BudgetCard 
                key={budget.id}
                budget={budget}
                category={category}
                spent={spentAmount}
                onDelete={handleDeleteBudget}
              />
            );
          })
        ) : (
          <div className="md:col-span-2 text-center py-10 text-gray-500 dark:text-gray-400">
            No budgets yet. Create your first one!
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;