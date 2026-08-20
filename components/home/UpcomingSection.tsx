'use client';

import React from 'react';
import { Video, MapPin, Plus, Calendar } from 'lucide-react';
import { UpcomingEventData } from './types';
import { UPCOMING_EVENTS } from './mockData';
import { cn } from '../../lib/utils';

export interface UpcomingSectionProps {
  events?: UpcomingEventData[];
  onEventClick?: (event: UpcomingEventData) => void;
  onAddMore?: () => void;
  onViewCalendar?: () => void;
  className?: string;
}

export const UpcomingSection: React.FC<UpcomingSectionProps> = ({
  events = UPCOMING_EVENTS,
  onEventClick,
  onAddMore,
  onViewCalendar,
  className,
}) => {
  const renderEventIcon = (type: UpcomingEventData['iconType']) => {
    switch (type) {
      case 'google-meet':
        return (
          <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-600" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zm0-12H5V5h14v2z" />
              <circle cx="9" cy="14" r="1.5" />
              <circle cx="15" cy="14" r="1.5" />
            </svg>
          </div>
        );
      case 'zoom':
        return (
          <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Video className="h-4 w-4 text-blue-600" />
          </div>
        );
      case 'location':
        return (
          <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <MapPin className="h-4 w-4 text-blue-600" />
          </div>
        );
      default:
        return (
          <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Calendar className="h-4 w-4 text-blue-600" />
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        'bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-950 tracking-tight">
            Upcoming
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your next events and commitments.
          </p>
        </div>
        <button
          type="button"
          onClick={onViewCalendar}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer pt-0.5"
        >
          View full calendar →
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => onEventClick?.(event)}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-200 hover:shadow-xs transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="shrink-0 text-[11px] font-semibold text-blue-700 bg-blue-50/90 border border-blue-100 px-2 py-1 rounded-full whitespace-nowrap">
                {event.time}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {event.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {event.locationOrPlatform}
                </div>
              </div>
            </div>

            {renderEventIcon(event.iconType)}
          </div>
        ))}

        {/* Add More Button Card */}
        <button
          type="button"
          onClick={onAddMore}
          className="p-3.5 rounded-2xl border border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 text-slate-600 hover:text-slate-900 text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 text-slate-400" />
          <span>Add more</span>
        </button>
      </div>
    </div>
  );
};
