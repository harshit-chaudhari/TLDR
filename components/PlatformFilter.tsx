'use client';

import { useState, useRef, useEffect } from 'react';
import { Platform, allPlatforms } from '@/data/content';

interface PlatformFilterProps {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
}

export default function PlatformFilter({ selected, onChange }: PlatformFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTogglePlatform = (platform: Platform) => {
    if (selected.includes(platform)) {
      onChange(selected.filter(p => p !== platform));
    } else {
      onChange([...selected, platform]);
    }
  };

  const handleSelectAll = () => {
    onChange([...allPlatforms]);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const displayText = selected.length === 0 || selected.length === allPlatforms.length
    ? 'All Platforms'
    : selected.length === 1
    ? selected[0]
    : `${selected.length} Platforms`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-tldr-darkGray text-white px-4 py-2 rounded-lg hover:bg-tldr-gray transition-colors"
      >
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="font-medium">{displayText}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-tldr-darkGray border border-tldr-lightGray rounded-lg shadow-2xl z-50 min-w-[250px]">
          <div className="p-2 border-b border-tldr-lightGray flex gap-2">
            <button
              onClick={handleSelectAll}
              className="flex-1 text-xs text-gray-400 hover:text-white py-1 px-2 rounded hover:bg-tldr-gray transition-colors"
            >
              Select All
            </button>
            <button
              onClick={handleClearAll}
              className="flex-1 text-xs text-gray-400 hover:text-white py-1 px-2 rounded hover:bg-tldr-gray transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="p-2 space-y-1">
            {allPlatforms.map(platform => (
              <label
                key={platform}
                className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-tldr-gray transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(platform)}
                  onChange={() => handleTogglePlatform(platform)}
                  className="w-4 h-4 rounded border-gray-600 text-tldr-gold focus:ring-tldr-gold focus:ring-offset-tldr-darkGray"
                />
                <span className="text-white font-medium text-sm">{platform}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
