import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Film, Tv, Home, Menu, X } from 'lucide-react';
import { useRouter } from 'next/router';
import CacheDebugger from './CacheDebugger';
import TVKeyboard from './TVKeyboard';
import ExitConfirmDialog from './ExitConfirmDialog';
import { useTVNavigation } from '../hooks/useTVNavigation';
import { useAndroidBackButton } from '../hooks/useAndroidBackButton';
import { App } from '@capacitor/app';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showTVKeyboard, setShowTVKeyboard] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Handle back button for modals/overlays
  const handleBackButton = (): boolean => {
    if (showExitDialog) {
      setShowExitDialog(false);
      return true; // Handled
    } else if (showTVKeyboard) {
      setShowTVKeyboard(false);
      return true; // Handled
    } else if (isMenuOpen) {
      setIsMenuOpen(false);
      return true; // Handled
    } else if (isSearchOpen) {
      setIsSearchOpen(false);
      return true; // Handled
    }
    return false; // Not handled, let default behavior continue
  };

  const { isAndroidTV } = useTVNavigation({
    onBack: handleBackButton,
    onMenu: () => {
      setIsMenuOpen(!isMenuOpen);
    }
  });

  // Handle Android hardware back button
  useAndroidBackButton({
    onBack: handleBackButton,
    onShowExitDialog: setShowExitDialog
  });

  // Handle exit app
  const handleExitApp = async () => {
    try {
      await App.exitApp();
    } catch (error) {
      console.log('Cannot exit app in web environment');
      window.close(); // Fallback for web
    }
  };

  // Focus management for TV
  useEffect(() => {
    if (isAndroidTV && !isMenuOpen && !showTVKeyboard) {
      // Auto-focus first focusable element when not in menu
      const timer = setTimeout(() => {
        const firstFocusable = document.querySelector('.tv-focusable') as HTMLElement;
        if (firstFocusable && document.activeElement === document.body) {
          firstFocusable.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAndroidTV, isMenuOpen, showTVKeyboard, router.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  const openSearch = () => {
    if (isAndroidTV) {
      setShowTVKeyboard(true);
    } else {
      setIsSearchOpen(true);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleTVSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setShowTVKeyboard(false);
    setIsMenuOpen(false);
  };

  const closeTVKeyboard = () => {
    setShowTVKeyboard(false);
  };

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/movies', label: 'Movies', icon: Film },
    { href: '/tv', label: 'TV Shows', icon: Tv },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col safe-area-inset">
      {/* Header */}
      <header className="bg-gradient-to-b from-black via-black/95 to-transparent backdrop-blur-md sticky top-0 z-50 transition-all duration-300" style={{paddingTop: 'env(safe-area-inset-top)'}}>
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
             <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
               <div className="w-10 h-10 bg-red-600 rounded-md flex items-center justify-center shadow-lg">
                 <span className="text-white font-bold text-sm">PM</span>
               </div>
               <span className="text-2xl font-bold text-white tracking-tight">PDP MOVIES</span>
             </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`nav-item tv-focusable flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 focus:outline-none font-medium ${
                    isAndroidTV
                      ? 'focus:ring-4 focus:ring-red-500 focus:scale-105 text-lg px-6 py-3'
                      : 'hover:bg-gray-800'
                  } ${
                    router.pathname === href
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white focus:text-white'
                  }`}
                  tabIndex={0}
                >
                  <Icon className={isAndroidTV ? 'h-5 w-5' : 'h-4 w-4'} />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>

            {/* Search for Android TV */}
            {isAndroidTV ? (
              <div className="hidden md:flex items-center">
                {!isSearchOpen ? (
                    <button
                      onClick={openSearch}
                      className="flex items-center space-x-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 focus:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500/50 rounded-lg transition-all duration-300 text-white"
                      tabIndex={0}
                    >
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </button>
                ) : (
                  <form onSubmit={handleSearch} className="flex items-center space-x-2">
                    <div className="relative">
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search movies, TV shows..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-800/90 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-80 text-lg border border-gray-700 focus:border-red-500 transition-all duration-200"
                        autoComplete="off"
                        inputMode="none"
                        readOnly={isAndroidTV}
                      />
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <button
                      type="button"
                      onClick={closeSearch}
                      className="p-2 bg-gray-600 hover:bg-gray-500 focus:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/50 rounded-lg transition-all duration-200 text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* Regular Search for non-TV devices */
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search movies, TV shows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </form>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-700">
              {/* Mobile Search */}
              {isAndroidTV ? (
                <div className="mb-4 px-2">
                  {!isSearchOpen ? (
                    <button
                      onClick={openSearch}
                      className="flex items-center space-x-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 focus:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/50 rounded-lg transition-all duration-200 text-white w-full justify-center text-lg"
                    >
                      <Search className="h-6 w-6" />
                      <span>Search Movies & TV Shows</span>
                    </button>
                  ) : (
                    <form onSubmit={handleSearch} className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search movies, TV shows..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-4 focus:ring-red-500/50 w-full text-lg"
                          autoComplete="off"
                          inputMode="none"
                          readOnly={isAndroidTV}
                        />
                        <Search className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={closeSearch}
                        className="p-3 bg-gray-600 hover:bg-gray-500 focus:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/50 rounded-lg transition-all duration-200 text-white"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSearch} className="mb-4 px-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search movies, TV shows..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </form>
              )}

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`nav-item tv-focusable flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none ${
                      isAndroidTV 
                        ? 'focus:ring-4 focus:ring-gray-500 focus:scale-105 text-lg py-4'
                        : ''
                    } ${
                      router.pathname === href
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800 focus:bg-gray-700 focus:text-white'
                    }`}
                    tabIndex={0}
                  >
                    <Icon className={isAndroidTV ? 'h-5 w-5' : 'h-4 w-4'} />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-0" style={{paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)'}}>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 mt-auto" style={{paddingBottom: 'env(safe-area-inset-bottom)', paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)'}}>
        <div className="px-4 py-8">
          <div className="text-center text-gray-500">
            <p className="text-sm font-medium">&copy; 2025 PDP MOVIES • Built with ❤️ by FROSTGARELINE</p>
          </div>
        </div>
      </footer>

      {/* Cache Debugger - only in development */}
      <CacheDebugger enabled={process.env.NODE_ENV === 'development'} />
      
      {/* TV Keyboard */}
      <TVKeyboard 
        isOpen={showTVKeyboard}
        onClose={closeTVKeyboard}
        onSearch={handleTVSearch}
      />
      
      {/* Exit Confirmation Dialog */}
      <ExitConfirmDialog
        isOpen={showExitDialog}
        onConfirm={handleExitApp}
        onCancel={() => setShowExitDialog(false)}
      />
    </div>
  );
};

export default Layout;
