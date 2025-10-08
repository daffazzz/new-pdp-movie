import React, { useEffect, useState } from 'react';
import { Country } from '../lib/tmdb';
import { Filter } from 'lucide-react';

interface CountryFilterProps {
  selectedCountry: string | null;
  onCountryChange: (countryCode: string | null) => void;
}

const CountryFilter: React.FC<CountryFilterProps> = ({ selectedCountry, onCountryChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAndroidTV, setIsAndroidTV] = useState(false);

  const countries: Country[] = [
    { iso_3166_1: 'US', english_name: 'United States' },
    { iso_3166_1: 'GB', english_name: 'United Kingdom' },
    { iso_3166_1: 'CA', english_name: 'Canada' },
    { iso_3166_1: 'AU', english_name: 'Australia' },
    { iso_3166_1: 'FR', english_name: 'France' },
    { iso_3166_1: 'DE', english_name: 'Germany' },
    { iso_3166_1: 'ES', english_name: 'Spain' },
    { iso_3166_1: 'IT', english_name: 'Italy' },
    { iso_3166_1: 'JP', english_name: 'Japan' },
    { iso_3166_1: 'KR', english_name: 'South Korea' },
    { iso_3166_1: 'IN', english_name: 'India' },
    { iso_3166_1: 'CN', english_name: 'China' },
    { iso_3166_1: 'BR', english_name: 'Brazil' },
    { iso_3166_1: 'MX', english_name: 'Mexico' },
    { iso_3166_1: 'AR', english_name: 'Argentina' },
    { iso_3166_1: 'SE', english_name: 'Sweden' },
    { iso_3166_1: 'DK', english_name: 'Denmark' },
    { iso_3166_1: 'NO', english_name: 'Norway' },
    { iso_3166_1: 'RU', english_name: 'Russia' },
    { iso_3166_1: 'TR', english_name: 'Turkey' },
    { iso_3166_1: 'ID', english_name: 'Indonesia' },
    { iso_3166_1: 'BN', english_name: 'Brunei Darussalam' },
    { iso_3166_1: 'KH', english_name: 'Cambodia' },
    { iso_3166_1: 'TL', english_name: 'Timor-Leste' },
    { iso_3166_1: 'LA', english_name: 'Lao People\'s Democratic Republic' },
    { iso_3166_1: 'MY', english_name: 'Malaysia' },
    { iso_3166_1: 'MM', english_name: 'Myanmar' },
    { iso_3166_1: 'PH', english_name: 'Philippines' },
    { iso_3166_1: 'SG', english_name: 'Singapore' },
    { iso_3166_1: 'TH', english_name: 'Thailand' },
    { iso_3166_1: 'VN', english_name: 'Viet Nam' },
  ];
  
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isTV = /android.*tv|smart-tv|smarttv/.test(userAgent) ||
                 window.innerWidth >= 1920 && window.innerHeight >= 1080;
    setIsAndroidTV(isTV);
  }, []);

  const handleCountrySelect = (countryCode: string | null) => {
    onCountryChange(countryCode);
    setIsOpen(false);
  };

  const selectedCountryName = selectedCountry 
    ? countries.find(c => c.iso_3166_1 === selectedCountry)?.english_name || 'Unknown'
    : 'All Countries';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`tv-focusable flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 focus:bg-red-600 focus:ring-4 focus:ring-red-500/50 text-white px-4 py-2 rounded-lg transition-all duration-200 min-w-[150px] justify-between focus:outline-none ${
          isAndroidTV ? 'focus:scale-105 text-lg px-6 py-3' : ''
        }`}
        tabIndex={0}
      >
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span className="truncate">{selectedCountryName}</span>
        </div>
        <svg
          className={`h-4 w-4 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto">
            <div className="py-2">
              <button
                onClick={() => handleCountrySelect(null)}
                className={`tv-focusable w-full text-left px-4 py-2 hover:bg-gray-700 focus:bg-red-600 focus:text-white focus:outline-none transition-all duration-200 ${
                  isAndroidTV ? 'text-lg py-3 focus:scale-[1.02]' : ''
                } ${
                  selectedCountry === null ? 'bg-red-600 text-white' : 'text-gray-300'
                }`}
                tabIndex={0}
              >
                All Countries
              </button>
              
              {countries.map(country => (
                <button
                  key={country.iso_3166_1}
                  onClick={() => handleCountrySelect(country.iso_3166_1)}
                  className={`tv-focusable w-full text-left px-4 py-2 hover:bg-gray-700 focus:bg-red-600 focus:text-white focus:outline-none transition-all duration-200 ${
                    isAndroidTV ? 'text-lg py-3 focus:scale-[1.02]' : ''
                  } ${
                    selectedCountry === country.iso_3166_1 ? 'bg-red-600 text-white' : 'text-gray-300'
                  }`}
                  tabIndex={0}
                >
                  {country.english_name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CountryFilter;