import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DaySelectorProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  availableDates: string[];
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDate,
  onDateSelect,
  availableDates,
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return { day: 'Today', date: date.getDate() };
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return { day: 'Tomorrow', date: date.getDate() };
    }
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
    };
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <button
          onClick={scrollLeft}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div
          ref={scrollContainerRef}
          className="flex-1 flex gap-2 overflow-x-auto scroll-container py-4 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {availableDates.map((date) => {
            const { day, date: dayNumber } = formatDisplayDate(date);
            const isSelected = date === selectedDate;
            
            return (
              <button
                key={date}
                onClick={() => onDateSelect(date)}
                className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-xs font-medium">{day}</span>
                <span className="text-lg font-bold">{dayNumber}</span>
              </button>
            );
          })}
        </div>
        
        <button
          onClick={scrollRight}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};