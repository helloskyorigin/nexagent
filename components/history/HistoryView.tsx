'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  History as HistoryIcon,
  Clock,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  Sparkles,
  Link2,
  Calendar,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../ui/Toast';
import {
  Activity,
  subscribeToActivities,
} from '../../services/firestore/activity';

export interface HistoryViewProps {
  onNavigate?: (pageId: string) => void;
  className?: string;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onNavigate,
  className,
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Subscribe to real Firestore activities
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToActivities(
      user.uid,
      (fetchedActivities) => {
        setActivities(fetchedActivities);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading history activities:', err);
        setLoading(false);
      },
      40
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (selectedType !== 'all' && act.type !== selectedType) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          act.title.toLowerCase().includes(q) ||
          (act.description && act.description.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activities, selectedType, searchQuery]);

  const renderIcon = (type?: string) => {
    switch (type) {
      case 'task':
        return <CheckCircle2 className="h-4 w-4 text-indigo-600" />;
      case 'memory':
        return <Sparkles className="h-4 w-4 text-purple-600" />;
      case 'connector':
        return <Link2 className="h-4 w-4 text-emerald-600" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className={cn('w-full space-y-6 animate-fadeIn pb-16', className)}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <HistoryIcon className="h-4 w-4" />
            <span>Workspace Audit &amp; Activity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            History &amp; Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
            Real activity timeline of mission completions, memory entries, and system signals.
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto p-0.5">
          {(
            [
              { id: 'all', label: 'All Activity' },
              { id: 'task', label: 'Missions' },
              { id: 'memory', label: 'Memory' },
              { id: 'connector', label: 'Connectors' },
              { id: 'chat', label: 'Conversations' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap',
                selectedType === tab.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px] sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity logs..."
            className="w-full h-8.5 pl-8 pr-3 text-xs bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* ACTIVITY TIMELINE */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-white rounded-2xl border border-slate-200/80 animate-pulse" />
            ))}
          </div>
        ) : filteredActivities.length > 0 ? (
          filteredActivities.map((act) => {
            const timeStr = act.createdAt
              ? typeof act.createdAt.toDate === 'function'
                ? act.createdAt.toDate().toLocaleString([], {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })
                : 'Recent'
              : 'Recent';

            return (
              <div
                key={act.id}
                className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-center shrink-0 mt-0.5">
                    {renderIcon(act.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      {act.title}
                    </div>
                    {act.description && (
                      <div className="text-xs text-slate-500 mt-0.5">
                        {act.description}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[11px] font-medium text-slate-400 shrink-0 whitespace-nowrap mt-0.5">
                  {timeStr}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <HistoryIcon className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">No activity recorded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Meaningful actions such as task completions, memory creations, and connector updates will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
