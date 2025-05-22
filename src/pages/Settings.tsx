import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, addCategory, updateCategory, deleteCategory } from '../db/db';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Plus, X, Save, Trash2, Download } from 'lucide-react';
import Icon from '../components/Icon';
import * as LucideIcons from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | undefined>(undefined);
  
  // Category form state
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>('expense');
  const [categoryColor, setCategoryColor] = useState('#3B82F6');
  const [categoryIcon, setCategoryIcon] = useState('tag');
  const [showIconPicker, setShowIconPicker] = useState(false);
  
  // Fetch all categories
  const categories = useLiveQuery(
    () => db.categories.toArray(),
    []
  );
  
  // Available colors
  const colors = [
    '#EF4444', // red
    '#F97316', // orange
    '#F59E0B', // amber
    '#EAB308', // yellow
    '#84CC16', // lime
    '#22C55E', // green
    '#10B981', // emerald
    '#14B8A6', // teal
    '#06B6D4', // cyan
    '#0EA5E9', // sky
    '#3B82F6', // blue
    '#6366F1', // indigo
    '#8B5CF6', // violet
    '#A855F7', // purple
    '#D946EF', // fuchsia
    '#EC4899', // pink
    '#6B7280', // gray
  ];
  
  // Get common Lucide icons
  const getCommonIcons = () => {
    const commonIconNames = [
      'home', 'shopping-bag', 'coffee', 'car', 'utensils', 'film', 
      'music', 'book', 'gift', 'heart', 'dollar-sign', 'credit-card', 
      'smartphone', 'globe', 'briefcase', 'graduation-cap', 'first-aid', 
      'bus', 'plane', 'train', 'ship', 'bike', 'baby', 'shirt', 'tag',
      'gift', 'package', 'shopping-cart', 'truck', 'wallet', 'wrench', 
      'tool', 'scissors', 'camera', 'monitor', 'tv', 'wifi', 'cloud', 
      'umbrella', 'sun', 'moon', 'star', 'zap', 'activity'
    ];
    
    return commonIconNames.filter(name => name in LucideIcons);
  };
  
  const availableIcons = getCommonIcons();
  
  // Reset form
  const resetForm = () => {
    setCategoryName('');
    setCategoryType('expense');
    setCategoryColor('#3B82F6');
    setCategoryIcon('tag');
    setShowIconPicker(false);
    setEditingCategoryId(undefined);
  };
  
  // Set up form for editing a category
  const editCategory = (category: any) => {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryType(category.type);
    setCategoryColor(category.color);
    setCategoryIcon(category.icon);
    setShowAddCategory(true);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const categoryData = {
        name: categoryName,
        type: categoryType,
        color: categoryColor,
        icon: categoryIcon
      };
      
      if (editingCategoryId !== undefined) {
        await updateCategory(editingCategoryId, categoryData);
      } else {
        await addCategory(categoryData);
      }
      
      resetForm();
      setShowAddCategory(false);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category. Please try again.');
    }
  };
  
  // Handle category deletion
  const handleDeleteCategory = async (id: number) => {
    // Check if this category is used in any transactions
    const transactionsWithCategory = await db.transactions
      .where('category')
      .equals(id)
      .count();
    
    if (transactionsWithCategory > 0) {
      alert(`This category is used in ${transactionsWithCategory} transaction(s). Please reassign those transactions first.`);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
    }
  };
  
  // Export all data
  const exportAllData = async () => {
    try {
      const allTransactions = await db.transactions.toArray();
      const allCategories = await db.categories.toArray();
      const allBudgets = await db.budgets.toArray();
      
      const exportData = {
        transactions: allTransactions,
        categories: allCategories,
        budgets: allBudgets,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `finance-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-medium mb-4">Appearance</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Dark Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Toggle between light and dark mode
              </p>
            </div>
            
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{ backgroundColor: theme === 'dark' ? '#3B82F6' : '#D1D5DB' }}
            >
              <span
                className={`${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`}
              />
              {theme === 'dark' ? (
                <Moon className="absolute right-1 h-3 w-3 text-blue-100" />
              ) : (
                <Sun className="absolute left-1 h-3 w-3 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Categories</h2>
            <button
              onClick={() => {
                resetForm();
                setShowAddCategory(!showAddCategory);
              }}
              className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showAddCategory ? (
                <>
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add Category</span>
                </>
              )}
            </button>
          </div>
          
          {showAddCategory && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium mb-3">
                {editingCategoryId !== undefined ? 'Edit Category' : 'Add New Category'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="income"
                        checked={categoryType === 'income'}
                        onChange={() => setCategoryType('income')}
                        className="form-radio h-4 w-4 text-blue-600 dark:text-blue-400"
                      />
                      <span className="ml-2">Income</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="expense"
                        checked={categoryType === 'expense'}
                        onChange={() => setCategoryType('expense')}
                        className="form-radio h-4 w-4 text-blue-600 dark:text-blue-400"
                      />
                      <span className="ml-2">Expense</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setCategoryColor(color)}
                        className={`w-8 h-8 rounded-full ${
                          categoryColor === color ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Icon</label>
                  <button
                    type="button"
                    onClick={() => setShowIconPicker(!showIconPicker)}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: categoryColor + '20' }}
                    >
                      <Icon name={categoryIcon} className="h-4 w-4" color={categoryColor} />
                    </div>
                    <span>{categoryIcon}</span>
                  </button>
                  
                  {showIconPicker && (
                    <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 max-h-40 overflow-y-auto">
                      <div className="grid grid-cols-6 gap-2">
                        {availableIcons.map((iconName) => (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => {
                              setCategoryIcon(iconName);
                              setShowIconPicker(false);
                            }}
                            className={`p-2 rounded-lg flex items-center justify-center ${
                              categoryIcon === iconName
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <Icon name={iconName} className="h-5 w-5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowAddCategory(false);
                    }}
                    className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
          
          <div className="space-y-2">
            {categories?.map(category => (
              <div 
                key={category.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    <Icon 
                      name={category.icon} 
                      className="h-4 w-4" 
                      color={category.color} 
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => editCategory(category)}
                    className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label={`Edit ${category.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                      <path d="m15 5 4 4"/>
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => category.id && handleDeleteCategory(category.id)}
                    className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-medium mb-4">Data Management</h2>
          
          <button
            onClick={exportAllData}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Export All Data</span>
          </button>
          
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            This will download all your financial data as a JSON file that you can back up or import later.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-medium mb-2">About</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Personal Finance Tracker v1.0.1
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This is a PWA that works offline and stores all your data locally on your device. Your financial data never leaves your device.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;