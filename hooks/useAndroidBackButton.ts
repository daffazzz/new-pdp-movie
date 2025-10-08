import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { App } from '@capacitor/app';

interface UseAndroidBackButtonOptions {
  onBack?: () => boolean; // Return true to prevent default behavior
  onShowExitDialog?: (show: boolean) => void; // Callback to show/hide exit dialog
}

export const useAndroidBackButton = (options: UseAndroidBackButtonOptions = {}) => {
  const router = useRouter();

  useEffect(() => {
    let backButtonListener: any;

    const setupBackButtonHandler = async () => {
      try {
        // Check if we're in a Capacitor environment
        const { Capacitor } = await import('@capacitor/core');
        
        if (Capacitor.isNativePlatform()) {
          backButtonListener = await App.addListener('backButton', () => {
            // Check if custom handler wants to prevent default behavior
            if (options.onBack && options.onBack()) {
              return; // Custom handler handled the back action
            }

            // Default behavior: navigate back or show exit dialog
            if (window.history.length > 1 && router.pathname !== '/') {
              router.back();
            } else {
              // If we're on the home page or no history, show exit confirmation
              if (options.onShowExitDialog) {
                options.onShowExitDialog(true);
              } else {
                showExitConfirmation();
              }
            }
          });
        }
      } catch (error) {
        console.log('Capacitor not available, using web fallback');
        // Fallback for web environment
        setupWebBackHandler();
      }
    };

    const setupWebBackHandler = () => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' || event.key === 'Backspace') {
          event.preventDefault();
          
          // Check if custom handler wants to prevent default behavior
          if (options.onBack && options.onBack()) {
            return;
          }

          // Default web behavior
          if (router.pathname !== '/') {
            router.back();
          } else {
            // Show exit dialog if available
            if (options.onShowExitDialog) {
              options.onShowExitDialog(true);
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      
      // Return cleanup function
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    };

    const showExitConfirmation = async () => {
      try {
        const confirmed = window.confirm('Are you sure you want to exit the app?');
        if (confirmed) {
          App.exitApp();
        }
      } catch (error) {
        console.log('Cannot exit app in web environment');
      }
    };

    setupBackButtonHandler();

    // Cleanup
    return () => {
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, [router, options]);
};

export default useAndroidBackButton;
