
import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { SEARCH_ENGINES } from '../constants';
import { SearchEngine } from '../types';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  
  // Load active engine from local storage
  const [activeEngine, setActiveEngine] = useState<SearchEngine>(() => {
    const savedName = localStorage.getItem('nbtab_active_engine');
    if (savedName) {
        const found = SEARCH_ENGINES.find(e => e.name === savedName);
        if (found) return found;
    }
    return SEARCH_ENGINES[0];
  });
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Save active engine when changed
  const handleEngineChange = (engine: SearchEngine) => {
    setActiveEngine(engine);
    setIsDropdownOpen(false);
    localStorage.setItem('nbtab_active_engine', engine.name);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.open(`${activeEngine.url}${encodeURIComponent(query)}`, '_blank');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative w-full max-w-2xl transition-all duration-300 ${isFocused ? 'scale-105' : 'scale-100'} z-50`}>
      <form onSubmit={handleSearch} className="flex items-center w-full h-14 rounded-2xl glass-input shadow-2xl">
        
        {/* Engine Selector */}
        <div className="relative h-full" ref={dropdownRef}>
          <button
            type="button"
            className="h-full px-4 flex items-center gap-2 hover:bg-gray-100/50 transition-colors border-r border-gray-200/30 rounded-l-2xl"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img src={activeEngine.icon} alt={activeEngine.name} className="w-5 h-5 object-contain" />
            <ChevronDown size={14} className="text-gray-500" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 w-36 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
              {SEARCH_ENGINES.map((engine) => (
                <button
                  key={engine.name}
                  type="button"
                  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 text-sm text-gray-700 first:rounded-t-xl last:rounded-b-xl"
                  onClick={() => handleEngineChange(engine)}
                >
                  <img src={engine.icon} alt={engine.name} className="w-4 h-4 object-contain" />
                  {engine.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex-1 relative h-full flex items-center">
            <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={activeEngine.placeholder}
            className="w-full h-full px-4 bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium"
            />
        </div>
        
        {/* Search Icon Button */}
        <button 
            type="submit"
            className="h-full px-5 text-gray-400 hover:text-blue-500 transition-colors rounded-r-2xl"
        >
            <Search size={20} />
        </button>

      </form>
    </div>
  );
};

export default SearchBar;
