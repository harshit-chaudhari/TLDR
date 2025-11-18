'use client';

import { useState, useMemo } from 'react';

interface CalendarPickerProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
  mode?: 'single' | 'week' | 'range';
  minDate?: Date;
  maxDate?: Date;
}

export default function CalendarPicker({
  selectedDate,
  onDateSelect,
  onClose,
  mode = 'single',
  minDate,
  maxDate,
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const monthStart = useMemo(() => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    return date;
  }, [currentMonth]);

  const monthEnd = useMemo(() => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    return date;
  }, [currentMonth]);

  const startDate = useMemo(() => {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - date.getDay()); // Start from Sunday
    return date;
  }, [monthStart]);

  const endDate = useMemo(() => {
    const date = new Date(monthEnd);
    date.setDate(date.getDate() + (6 - date.getDay())); // End on Saturday
    return date;
  }, [monthEnd]);

  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [startDate, endDate]);

  const weeks = useMemo(() => {
    const weeksArray: Date[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeksArray.push(calendarDays.slice(i, i + 7));
    }
    return weeksArray;
  }, [calendarDays]);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;

    if (mode === 'week') {
      // Check if date is in the same week as selected date
      const selectedWeekStart = getWeekStart(selectedDate);
      const selectedWeekEnd = getWeekEnd(selectedDate);
      return date >= selectedWeekStart && date <= selectedWeekEnd;
    }

    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getWeekEnd = (date: Date) => {
    const d = new Date(date);
    d.setDate(d.getDate() + (6 - d.getDay()));
    d.setHours(23, 59, 59, 999);
    return d;
  };

  const handleDateClick = (date: Date) => {
    if (isDisabled(date)) return;
    onDateSelect(date);
  };

  const handleWeekHover = (date: Date) => {
    if (mode === 'week') {
      setHoveredDate(date);
    }
  };

  const isInHoveredWeek = (date: Date) => {
    if (!hoveredDate || mode !== 'week') return false;
    const weekStart = getWeekStart(hoveredDate);
    const weekEnd = getWeekEnd(hoveredDate);
    return date >= weekStart && date <= weekEnd;
  };

  const monthYearDisplay = useMemo(() => {
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentMonth]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Calendar */}
      <div
        className="relative z-10 bg-tldr-darkGray rounded-2xl shadow-2xl border border-tldr-lightGray/20 p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-tldr-lightGray/10 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h3 className="text-xl font-bold text-white">{monthYearDisplay}</h3>

          <button
            onClick={nextMonth}
            className="p-2 hover:bg-tldr-lightGray/10 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {week.map((date, dayIndex) => {
                const selected = isSelected(date);
                const today = isToday(date);
                const currentMonth = isCurrentMonth(date);
                const disabled = isDisabled(date);
                const hoveredWeek = isInHoveredWeek(date);

                return (
                  <button
                    key={dayIndex}
                    onClick={() => handleDateClick(date)}
                    onMouseEnter={() => handleWeekHover(date)}
                    disabled={disabled}
                    className={`
                      aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                      ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                      ${!currentMonth ? 'text-gray-600' : 'text-white'}
                      ${selected ? 'bg-tldr-gold text-black font-bold shadow-lg' : ''}
                      ${hoveredWeek && !selected ? 'bg-tldr-gold/20' : ''}
                      ${today && !selected ? 'ring-2 ring-tldr-gold ring-inset' : ''}
                      ${!selected && !hoveredWeek && !disabled ? 'hover:bg-tldr-lightGray/20' : ''}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-tldr-lightGray/20">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <div className="text-xs text-gray-500">
            {mode === 'week' ? 'Select a week' : 'Select a date'}
          </div>
        </div>
      </div>
    </div>
  );
}
