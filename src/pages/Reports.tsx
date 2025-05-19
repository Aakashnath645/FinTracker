import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { 
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  subYears,
  format
} from 'date-fns';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Download, ArrowDown, ArrowUp } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

type ReportPeriod = 'month' | 'year';

const Reports: React.FC = () => {
  const [period, setPeriod] = useState<ReportPeriod>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Calculate date ranges based on period
  const getDateRange = () => {
    if (period === 'month') {
      return {
        start: startOfMonth(currentDate).toISOString(),
        end: endOfMonth(currentDate).toISOString(),
        label: format(currentDate, 'MMMM yyyy')
      };
    } else {
      return {
        start: startOfYear(currentDate).toISOString(),
        end: endOfYear(currentDate).toISOString(),
        label: format(currentDate, 'yyyy')
      };
    }
  };
  
  const { start, end, label } = getDateRange();
  
  // Fetch transactions for the current period
  const transactions = useLiveQuery(
    () => db.transactions
      .where('date')
      .between(start, end)
      .toArray(),
    [start, end]
  );
  
  // Fetch categories
  const categories = useLiveQuery(
    () => db.categories.toArray()
  );
  
  // Calculate summary data
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  
  useEffect(() => {
    if (transactions) {
      const incomeTotal = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenseTotal = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      setIncome(incomeTotal);
      setExpense(expenseTotal);
      setBalance(incomeTotal - expenseTotal);
    }
  }, [transactions]);
  
  // Go to previous period
  const goToPrevious = () => {
    if (period === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subYears(currentDate, 1));
    }
  };
  
  // Go to current period
  const goToCurrent = () => {
    setCurrentDate(new Date());
  };
  
  // Prepare expense chart data
  const prepareExpenseChartData = () => {
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
  
  // Prepare income vs expense data for bar chart
  const prepareIncomeExpenseData = () => {
    if (!transactions) return null;
    
    let labels: string[] = [];
    let incomeData: number[] = [];
    let expenseData: number[] = [];
    
    if (period === 'month') {
      // Group by day of month
      const dailyTotals: Record<string, { income: number; expense: number }> = {};
      
      transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const day = date.getDate().toString();
        
        if (!dailyTotals[day]) {
          dailyTotals[day] = { income: 0, expense: 0 };
        }
        
        if (transaction.type === 'income') {
          dailyTotals[day].income += transaction.amount;
        } else {
          dailyTotals[day].expense += transaction.amount;
        }
      });
      
      // Sort days numerically
      labels = Object.keys(dailyTotals).sort((a, b) => parseInt(a) - parseInt(b));
      
      // Get income and expense data in the same order
      labels.forEach(day => {
        incomeData.push(dailyTotals[day].income);
        expenseData.push(dailyTotals[day].expense);
      });
    } else {
      // Group by month
      const monthlyTotals: Record<string, { income: number; expense: number }> = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthIndex = date.getMonth();
        const month = monthNames[monthIndex];
        
        if (!monthlyTotals[month]) {
          monthlyTotals[month] = { income: 0, expense: 0 };
        }
        
        if (transaction.type === 'income') {
          monthlyTotals[month].income += transaction.amount;
        } else {
          monthlyTotals[month].expense += transaction.amount;
        }
      });
      
      // Use all months in order
      labels = monthNames;
      
      // Get income and expense data for each month
      labels.forEach(month => {
        if (monthlyTotals[month]) {
          incomeData.push(monthlyTotals[month].income);
          expenseData.push(monthlyTotals[month].expense);
        } else {
          incomeData.push(0);
          expenseData.push(0);
        }
      });
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: '#22C55E',
        },
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: '#EF4444',
        },
      ],
    };
  };
  
  const expenseChartData = prepareExpenseChartData();
  const incomeExpenseData = prepareIncomeExpenseData();
  
  // Export data as CSV
  const exportData = () => {
    if (!transactions || !categories) return;
    
    // Prepare CSV content
    let csvContent = 'Date,Type,Category,Description,Amount,Notes\n';
    
    transactions.forEach(transaction => {
      const category = categories.find(c => c.id === transaction.category);
      const date = new Date(transaction.date).toLocaleDateString();
      const amount = transaction.amount.toFixed(2);
      const type = transaction.type;
      const description = transaction.description.replace(/,/g, ' ');
      const notes = transaction.notes?.replace(/,/g, ' ') || '';
      
      csvContent += `${date},${type},${category?.name || 'Unknown'},${description},${amount},${notes}\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `finance-report-${label}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Financial Reports</h1>
        <button 
          onClick={exportData}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>
      
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-lg ${
              period === 'month'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-4 py-2 rounded-lg ${
              period === 'year'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
            }`}
          >
            Yearly
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={goToPrevious}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            Previous
          </button>
          <span className="font-medium text-lg">{label}</span>
          {format(currentDate, period === 'month' ? 'MMMM yyyy' : 'yyyy') !== 
           format(new Date(), period === 'month' ? 'MMMM yyyy' : 'yyyy') && (
            <button
              onClick={goToCurrent}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Current
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
              <ArrowDown className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-gray-500 dark:text-gray-400">Total Income</span>
          </div>
          <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${income.toFixed(2)}
          </h3>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
              <ArrowUp className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-gray-500 dark:text-gray-400">Total Expenses</span>
          </div>
          <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
            ${expense.toFixed(2)}
          </h3>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${
              balance >= 0 
                ? 'bg-blue-100 dark:bg-blue-900/30' 
                : 'bg-orange-100 dark:bg-orange-900/30'
            }`}>
              <ArrowDown className={`h-5 w-5 ${
                balance >= 0 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-orange-600 dark:text-orange-400'
              }`} />
            </div>
            <span className="text-gray-500 dark:text-gray-400">Net Balance</span>
          </div>
          <h3 className={`text-2xl font-bold ${
            balance >= 0 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-orange-600 dark:text-orange-400'
          }`}>
            ${balance.toFixed(2)}
          </h3>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium mb-4">Expense Breakdown</h2>
          {expenseChartData && expense > 0 ? (
            <div className="h-64 flex items-center justify-center">
              <Doughnut 
                data={expenseChartData} 
                options={{
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        boxWidth: 12,
                        padding: 10,
                        color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#374151'
                      }
                    }
                  },
                  cutout: '65%',
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No expense data to show
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium mb-4">Income vs Expenses</h2>
          {incomeExpenseData ? (
            <div className="h-64">
              <Bar 
                data={incomeExpenseData} 
                options={{
                  plugins: {
                    legend: {
                      labels: {
                        color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#374151'
                      }
                    }
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280'
                      }
                    },
                    y: {
                      grid: {
                        color: document.documentElement.classList.contains('dark') ? '#374151' : '#E5E7EB'
                      },
                      ticks: {
                        color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280'
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No transaction data to show
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-lg font-medium mb-4">Top Spending Categories</h2>
        
        {expenseChartData && expense > 0 ? (
          <div className="space-y-4">
            {expenseChartData.labels.slice(0, 5).map((label, index) => {
              const amount = expenseChartData.datasets[0].data[index] as number;
              const percentage = ((amount / expense) * 100).toFixed(1);
              const color = expenseChartData.datasets[0].backgroundColor[index] as string;
              
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{label}</span>
                    <div>
                      <span className="font-semibold">${amount.toFixed(2)}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No expense data to show
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;