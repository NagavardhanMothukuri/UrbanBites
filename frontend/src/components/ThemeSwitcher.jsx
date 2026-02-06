import React, { useState } from 'react';
import { useTheme, themes } from '../context/ThemeContext';
import { IoMoon, IoSunny, IoColorPalette } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeSwitcher() {
  const { currentTheme, setTheme, isDarkMode, toggleDarkMode, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeIcons = {
    orange: '🌅',
    blue: '🌊',
    green: '🌲',
    purple: '👑',
    pink: '🌸'
  };

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 text-white hover:bg-gray-700' 
            : 'bg-white text-gray-800 hover:bg-gray-50'
        }`}
      >
        <IoColorPalette className="w-5 h-5" />
      </motion.button>

      {/* Theme Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className={`absolute right-0 top-14 w-72 rounded-2xl shadow-2xl z-50 overflow-hidden ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {/* Header */}
              <div className={`p-4 border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <h3 className={`font-bold text-lg ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  🎨 Theme Settings
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Customize your experience
                </p>
              </div>

              {/* Dark Mode Toggle */}
              <div className={`p-4 border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode 
                        ? 'bg-indigo-500/20 text-indigo-400' 
                        : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      {isDarkMode ? <IoMoon className="w-5 h-5" /> : <IoSunny className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                      </p>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {isDarkMode ? 'Easy on the eyes' : 'Bright and fresh'}
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleDarkMode}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                      isDarkMode ? 'bg-indigo-500' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      animate={{ x: isDarkMode ? 28 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                    />
                  </motion.button>
                </div>
              </div>

              {/* Color Themes */}
              <div className="p-4">
                <p className={`text-sm font-medium mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Color Theme
                </p>
                <div className="space-y-2">
                  {Object.entries(themes).map(([key, t]) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTheme(key)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                        currentTheme === key
                          ? isDarkMode
                            ? 'bg-gray-700 ring-2 ring-offset-2 ring-offset-gray-800 ring-' + t.primary.replace('#', '')
                            : 'bg-gray-50 ring-2 ring-offset-2 ring-' + t.primary.replace('#', '')
                          : isDarkMode
                            ? 'hover:bg-gray-700/50'
                            : 'hover:bg-gray-50'
                      }`}
                      style={{
                        boxShadow: currentTheme === key ? `0 0 0 2px ${t.primary}40` : 'none'
                      }}
                    >
                      {/* Color Preview */}
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`
                        }}
                      >
                        {themeIcons[key]}
                      </div>
                      
                      {/* Theme Info */}
                      <div className="flex-1 text-left">
                        <p className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {t.name}
                        </p>
                        <div className="flex gap-1 mt-1">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: t.primary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: t.secondary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: t.accent }}
                          />
                        </div>
                      </div>

                      {/* Active Indicator */}
                      {currentTheme === key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: t.primary }}
                        >
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Preview Card */}
              <div className={`p-4 border-t ${
                isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
              }`}>
                <p className={`text-xs font-medium mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Preview
                </p>
                <div 
                  className="p-3 rounded-xl"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))'
                      : 'linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0.05))'
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-8 h-8 rounded-lg"
                      style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                    />
                    <div className="flex-1">
                      <div className={`h-2 rounded w-20 mb-1 ${
                        isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`} />
                      <div className={`h-2 rounded w-12 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`} />
                    </div>
                  </div>
                  <div 
                    className="h-6 rounded-lg w-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
                      opacity: 0.8
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
