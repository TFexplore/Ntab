import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { SEARCH_ENGINES } from '../constants';
import { SearchEngine } from '../types';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeEngine, setActiveEngine] = useState<SearchEngine>(SEARCH_ENGINES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `${activeEngine.url}${encodeURIComponent(query)}`;
  };

  return (
    <div className={`relative w-full max-w-2xl transition-all duration-300 ${isFocused ? 'scale-105' : 'scale-100'}`}>
      <form onSubmit={handleSearch} className="flex items-center w-full h-14 rounded-2xl glass-input shadow-2xl overflow-hidden">
        
        {/* Engine Selector */}
        <div className="relative h-full">
          <button
            type="button"
            className="h-full px-4 flex items-center gap-2 hover:bg-gray-100/50 transition-colors border-r border-gray-200/30"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img src={activeEngine.icon} alt={activeEngine.name} className="w-5 h-5 object-contain" />
            <ChevronDown size={14} className="text-gray-500" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 w-36 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              {SEARCH_ENGINES.map((engine) => (
                <button
                  key={engine.name}
                  type="button"
                  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 text-sm text-gray-700"
                  onClick={() => {
                    setActiveEngine(engine);
                    setIsDropdownOpen(false);
                  }}
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
            className="h-full px-5 text-gray-400 hover:text-blue-500 transition-colors"
        >
            <Search size={20} />
        </button>

      </form>
    </div>
  );
};

export default SearchBar;