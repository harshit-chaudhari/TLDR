'use client';

import { useState, useRef, useEffect } from 'react';

interface WeekPickerProps {
  selected: string;
  availableWeeks: string[];
  onChange: (week: string) => void;
}

export default function WeekPicker({ selected, availableWeeks, onChange }: WeekPickerProps) {
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

  const formatWeekDisplay = (weekStart: string) => {
    const date = new Date(weekStart);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 6);

    const formatDate = (d: Date) => {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const year = date.getFullYear();
    return `${formatDate(date)} - ${formatDate(endDate)}, ${year}`;
  };

  const isCurrentWeek = (weekStart: string) => {
    const today = new Date();
    const week = new Date(weekStart);
    const weekEnd = new Date(week);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return today >= week && today <= weekEnd;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-tldr-darkGray text-white px-4 py-2 rounded-lg hover:bg-tldr-gray transition-colors"
      >
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="font-medium">
          {isCurrentWeek(selected) ? 'This Week' : formatWeekDisplay(selected)}
        </span>
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
        <div className="absolute top-full mt-2 left-0 bg-tldr-darkGray border border-tldr-lightGray rounded-lg shadow-2xl z-50 min-w-[280px]">
          <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
            {availableWeeks.map(week => (
              <button
                key={week}
                onClick={() => {
                  onChange(week);
                  setIsOpen(false);
                }}
                className={`w-full text-left p-3 rounded transition-colors ${
                  selected === week
                    ? 'bg-tldr-gold text-tldr-dark font-semibold'
                    : 'text-white hover:bg-tldr-gray'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{formatWeekDisplay(week)}</span>
                  {isCurrentWeek(week) && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      selected === week ? 'bg-tldr-dark text-tldr-gold' : 'bg-tldr-gold text-tldr-dark'
                    }`}>
                      Current
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
