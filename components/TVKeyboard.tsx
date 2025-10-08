import React, { useState, useEffect } from 'react';
import { X, Delete } from 'lucide-react';

interface TVKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  initialValue?: string;
}

const TVKeyboard: React.FC<TVKeyboardProps> = ({ 
  isOpen, 
  onClose, 
  onSearch, 
  initialValue = '' 
}) => {
  const [query, setQuery] = useState(initialValue);
  const [focusedKey, setFocusedKey] = useState({ row: 0, col: 0 });

  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ['SPACE', 'BACKSPACE', 'SEARCH', 'CLOSE']
  ];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      
      switch (e.key) {
        case 'ArrowUp':
          setFocusedKey(prev => ({
            ...prev,
            row: Math.max(0, prev.row - 1)
          }));
          break;
        case 'ArrowDown':
          setFocusedKey(prev => ({
            ...prev,
            row: Math.min(keyboard.length - 1, prev.row + 1)
          }));
          break;
        case 'ArrowLeft':
          setFocusedKey(prev => ({
            ...prev,
            col: Math.max(0, prev.col - 1)
          }));
          break;
        case 'ArrowRight':
          setFocusedKey(prev => ({
            row: prev.row,
            col: Math.min(keyboard[prev.row].length - 1, prev.col + 1)
          }));
          break;
        case 'Enter':
          handleKeyPress(keyboard[focusedKey.row][focusedKey.col]);
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedKey]);

  const handleKeyPress = (key: string) => {
    switch (key) {
      case 'SPACE':
        setQuery(prev => prev + ' ');
        break;
      case 'BACKSPACE':
        setQuery(prev => prev.slice(0, -1));
        break;
      case 'SEARCH':
        if (query.trim()) {
          onSearch(query.trim());
        }
        break;
      case 'CLOSE':
        onClose();
        break;
      default:
        setQuery(prev => prev + key.toLowerCase());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Search Movies & TV Shows</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search Input Display */}
        <div className="mb-6">
          <div className="bg-gray-700 rounded-lg p-4 min-h-[60px] flex items-center">
            <span className="text-white text-xl font-mono">
              {query || 'Type your search...'}
              <span className="animate-pulse">|</span>
            </span>
          </div>
        </div>

        {/* Virtual Keyboard */}
        <div className="space-y-3">
          {keyboard.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-2">
              {row.map((key, colIndex) => {
                const isFocused = focusedKey.row === rowIndex && focusedKey.col === colIndex;
                const isSpecialKey = ['SPACE', 'BACKSPACE', 'SEARCH', 'CLOSE'].includes(key);
                
                return (
                  <button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className={`
                      px-4 py-3 rounded-lg font-semibold transition-all duration-200
                      ${isFocused 
                        ? 'bg-red-600 text-white ring-4 ring-red-500/50 scale-110' 
                        : 'bg-gray-600 text-white hover:bg-gray-500'
                      }
                      ${isSpecialKey ? 'min-w-[120px]' : 'min-w-[50px]'}
                      ${key === 'SPACE' ? 'min-w-[200px]' : ''}
                    `}
                  >
                    {key === 'BACKSPACE' ? (
                      <Delete className="h-5 w-5 mx-auto" />
                    ) : key === 'SPACE' ? (
                      'Space'
                    ) : (
                      key
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>Use arrow keys to navigate • Press Enter to select • Press Escape to close</p>
        </div>
      </div>
    </div>
  );
};

export default TVKeyboard;
