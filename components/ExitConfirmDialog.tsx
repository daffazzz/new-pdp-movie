import React from 'react';
import { X } from 'lucide-react';

interface ExitConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ExitConfirmDialog: React.FC<ExitConfirmDialogProps> = ({ 
  isOpen, 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Exit App</h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
            tabIndex={0}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <p className="text-gray-300 mb-6">
          Are you sure you want to exit PDP Movies?
        </p>

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            className="tv-focusable flex-1 bg-gray-600 hover:bg-gray-500 focus:bg-gray-500 focus:ring-4 focus:ring-gray-400/50 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:scale-105"
            tabIndex={0}
          >
            Stay
          </button>
          <button
            onClick={onConfirm}
            className="tv-focusable flex-1 bg-red-600 hover:bg-red-700 focus:bg-red-700 focus:ring-4 focus:ring-red-500/50 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:scale-105"
            tabIndex={0}
            autoFocus
          >
            Exit
          </button>
        </div>

        {/* Instructions for TV */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          <p>Use arrow keys to navigate • Press Enter to select</p>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmDialog;

