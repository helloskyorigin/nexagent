'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { TaskActivity } from '../../services/agent/storage';

export interface ActivityPanelProps {
  activities: TaskActivity[];
}

export const ActivityPanel: React.FC<ActivityPanelProps> = ({ activities }) => {
  return (
    <div className="bg-[#15181D] border border-slate-800 rounded-2xl p-5 space-y-4">
      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
        <Clock className="h-4 w-4 text-blue-400" />
        <span>Recent activity</span>
      </h3>

      {activities.length > 0 ? (
        <div className="space-y-3 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
          {activities.map((act) => (
            <div key={act.id} className="flex items-start gap-2.5 text-xs">
              <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
              <div className="min-w-0 flex-1">
                <div className="text-slate-200 leading-snug">{act.event}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{act.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Intentional Empty State */
        <div className="p-6 text-center space-y-1">
          <div className="text-xs font-bold text-white">No agent activity yet.</div>
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
            Your agent activity will appear here when work begins.
          </p>
        </div>
      )}
    </div>
  );
};
