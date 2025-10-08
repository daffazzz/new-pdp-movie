import { useEffect, useState } from 'react';

interface TVNavigationOptions {
  onBack?: () => boolean; // Return true if handled, false to continue with default
  onSelect?: () => void;
  onMenu?: () => void;
}

export const useTVNavigation = (options: TVNavigationOptions = {}) => {
  const [isAndroidTV, setIsAndroidTV] = useState(false);

  useEffect(() => {
    // Detect Android TV
    const userAgent = navigator.userAgent.toLowerCase();
    const isTV = /android.*tv|smart-tv|smarttv/.test(userAgent) ||
                 window.innerWidth >= 1920 && window.innerHeight >= 1080;
    setIsAndroidTV(isTV);

    if (!isTV) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
        case 'Backspace':
          if (options.onBack) {
            event.preventDefault();
            const handled = options.onBack();
            // If onBack returns false, let the event bubble up for default handling
            if (!handled) {
              // Don't prevent default, let other handlers process it
              event.preventDefault = () => {}; // Restore default behavior
            }
          }
          break;
        case 'Enter':
          if (options.onSelect) {
            event.preventDefault();
            options.onSelect();
          }
          break;
        case 'Menu':
          if (options.onMenu) {
            event.preventDefault();
            options.onMenu();
          }
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          // Let the browser handle focus navigation
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options]);

  return { isAndroidTV };
};

export const focusFirstElement = () => {
  const firstFocusable = document.querySelector('[tabindex="0"], button, a, input, select, textarea') as HTMLElement;
  if (firstFocusable) {
    firstFocusable.focus();
  }
};

export const focusElement = (selector: string) => {
  const element = document.querySelector(selector) as HTMLElement;
  if (element) {
    element.focus();
  }
};

export default useTVNavigation;
