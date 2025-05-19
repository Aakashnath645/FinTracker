import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
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
      
      <div className={`w-10 h-5 rounded-full relative ${theme === 'light' ? 'bg-gray-300' : 'bg-blue-600'}`}>
        <div 
          className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform duration-200 ${
            theme === 'light' ? 'bg-white left-0.5' : 'bg-white left-5.5 transform translate-x-full'
          }`} 
        />
      </div>
    </button>
  );
};

export default ThemeToggle;