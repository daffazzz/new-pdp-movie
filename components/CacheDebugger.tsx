import React, { useState, useEffect } from 'react';
import { cache } from '../lib/cache';

interface CacheDebuggerProps {
  enabled?: boolean;
}

const CacheDebugger: React.FC<CacheDebuggerProps> = ({ enabled = false }) => {
  const [cacheStats, setCacheStats] = useState<{ size: number; keys: string[] }>({ size: 0, keys: [] });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const updateStats = () => {
      setCacheStats(cache.getStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
        title="Cache Debugger"
      >
        🔧
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-black/90 text-white p-4 rounded-lg shadow-xl min-w-[300px] max-h-[400px] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold">Cache Status</h3>
            <button
              onClick={() => {
                cache.clear();
                setCacheStats(cache.getStats());
              }}
              className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
            >
              Clear Cache
            </button>
          </div>
          
          <div className="space-y-2 text-xs">
            <div>
              <strong>Cache Size:</strong> {cacheStats.size} items
            </div>
            
            <div>
              <strong>Cached Keys:</strong>
              <ul className="mt-1 space-y-1 max-h-[200px] overflow-y-auto">
                {cacheStats.keys.map((key, index) => (
                  <li key={index} className="text-gray-300 break-all">
                    {key}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CacheDebugger;
