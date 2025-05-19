import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600/50"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="flex items-center gap-3">
        {theme === 'light' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
      </div>
      
      <div className="relative">
        <div 
          className={`w-11 h-6 rounded-full transition-colors duration-200 ${
            theme === 'light' 
              ? 'bg-gray-300 dark:bg-gray-600' 
              : 'bg-blue-600 dark:bg-blue-500'
          }`}
        />
        <div 
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
            theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;