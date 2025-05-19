import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import TransactionCard from '../components/TransactionCard';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  
  // Get dates for filtering
  const startDate = startOfMonth(currentMonth).toISOString();
  const endDate = endOfMonth(currentMonth).toISOString();
  
  // Fetch transactions for the current month
  const transactions = useLiveQuery(
    () => db.transactions
      .where('date')
      .between(startDate, endDate)
      .reverse()
      .toArray(),
    [startDate, endDate]
  );
  
  // Fetch categories
  const categories = useLiveQuery(
    () => db.categories.toArray()
  );
  
  // Fetch recent transactions
  const recentTransactions = useLiveQuery(
    () => db.transactions
      .orderBy('date')
      .reverse()
      .limit(5)
      .toArray(),
    []
  );
  
  // Calculate totals when transactions change
  useEffect(() => {
    if (transactions) {
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      setTotalIncome(income);
      setTotalExpense(expense);
    }
  }, [transactions]);
  
  // Prepare chart data for expense categories
  const prepareChartData = () => {
    if (!transactions || !categories) return null;
    
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryTotals: Record<number, number> = {};
    
    expenseTransactions.forEach(transaction => {
      const categoryId = transaction.category;
      categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + transaction.amount;
    });
    
    const categoryData = Object.entries(categoryTotals).map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === Number(categoryId));
      return {
        categoryId: Number(categoryId),
        name: category ? category.name : 'Unknown',
        color: category ? category.color : '#888888',
        amount
      };
    }).sort((a, b) => b.amount - a.amount);
    
    return {
      labels: categoryData.map(c => c.name),
      datasets: [
        {
          data: categoryData.map(c => c.amount),
          backgroundColor: categoryData.map(c => c.color),
          borderWidth: 0,
        },
      ],
    };
  };
  
  const chartData = prepareChartData();
  
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };
  
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link 
          to="/transactions/add" 
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Transaction</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium mb-4">Month Summary</h2>
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={goToPreviousMonth}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Previous
            </button>
            <h3 className="text-lg font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            {format(currentMonth, 'MMMM yyyy') !== format(new Date(), 'MMMM yyyy') && (
              <button 
                onClick={goToCurrentMonth}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Current
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Income</span>
                <span className="text-green-600 dark:text-green-400">
                  +${totalIncome.toFixed(2)}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Expenses</span>
                <span className="text-red-600 dark:text-red-400">
                  -${totalExpense.toFixed(2)}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full" 
                  style={{ width: `${totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0}%` }}
                />
              </div>
            </div>
            
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Balance</span>
                <span className={`font-bold ${
                  totalIncome - totalExpense >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  ${(totalIncome - totalExpense).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium mb-4">Expense Breakdown</h2>
          {chartData && totalExpense > 0 ? (
            <div className="h-48 flex items-center justify-center">
              <Doughnut 
                data={chartData} 
                options={{
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  cutout: '70%',
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No expense data to show
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Quick Actions</h2>
          </div>
          
          <div className="space-y-3">
            <Link
              to="/transactions/add"
              className="block w-full py-3 px-4 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/30 text-blue-800 dark:text-blue-300 rounded-lg transition-colors"
            >
              Add New Transaction
            </Link>
            
            <Link
              to="/budgets"
              className="block w-full py-3 px-4 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800/30 text-purple-800 dark:text-purple-300 rounded-lg transition-colors"
            >
              Manage Budgets
            </Link>
            
            <Link
              to="/reports"
              className="block w-full py-3 px-4 bg-teal-100 dark:bg-teal-900/30 hover:bg-teal-200 dark:hover:bg-teal-800/30 text-teal-800 dark:text-teal-300 rounded-lg transition-colors"
            >
              View Reports
            </Link>
            
            <Link
              to="/settings"
              className="block w-full py-3 px-4 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 text-gray-800 dark:text-gray-300 rounded-lg transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Recent Transactions</h2>
          <Link 
            to="/transactions" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All
          </Link>
        </div>
        
        <div className="space-y-3">
          {recentTransactions && categories && recentTransactions.length > 0 ? (
            recentTransactions.map(transaction => {
              const category = categories.find(c => c.id === transaction.category);
              if (!category) return null;
              
              return (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  category={category}
                  onDelete={() => {}} // Implemented in Transactions page
                />
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No transactions yet. Add your first one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;