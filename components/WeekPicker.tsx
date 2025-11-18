'use client';

import { useState } from 'react';
import CalendarPicker from './CalendarPicker';

interface WeekPickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function WeekPicker({ selectedDate, onDateChange }: WeekPickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

  const formatWeekRange = (date: Date) => {
    const start = getWeekStart(date);
    const end = getWeekEnd(date);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  const previousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    onDateChange(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    onDateChange(newDate);
  };

  const handleDateSelect = (date: Date) => {
    onDateChange(date);
    setIsCalendarOpen(false);
  };

  const today = new Date();
  const isNextWeekDisabled = getWeekStart(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000)) > getWeekStart(today);

  return (
    <>
      <div className="inline-flex items-center gap-2 bg-tldr-darkGray rounded-xl p-2 border border-tldr-lightGray/20">
        <button onClick={previousWeek} className="p-2 hover:bg-tldr-lightGray/20 rounded-lg transition-colors text-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
        <button onClick={() => setIsCalendarOpen(true)} className="px-4 py-2 hover:bg-tldr-lightGray/20 rounded-lg transition-colors min-w-[180px] sm:min-w-[220px]"><div className="text-left"><div className="text-xs text-gray-500 mb-0.5">Week of</div><div className="text-sm font-medium text-white">{formatWeekRange(selectedDate)}</div></div></button>
        <button onClick={nextWeek} disabled={isNextWeekDisabled} className={`p-2 rounded-lg transition-colors ${isNextWeekDisabled ? 'opacity-30 cursor-not-allowed text-gray-600' : 'hover:bg-tldr-lightGray/20 text-white'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
        <button onClick={() => setIsCalendarOpen(true)} className="p-2 hover:bg-tldr-gold/20 rounded-lg transition-colors text-tldr-gold ml-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></button>
      </div>
      {isCalendarOpen && <CalendarPicker selectedDate={selectedDate} onDateSelect={handleDateSelect} onClose={() => setIsCalendarOpen(false)} mode="week" maxDate={today} />}
    </>
  );
}