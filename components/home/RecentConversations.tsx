'use client';

import React from 'react';
import { MessageSquare, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export interface ConversationItem {
  id: string;
  title: string;
  timestamp: string;
  summary: string;
}

export interface RecentConversationsProps {
  onSelectConversation?: (item: ConversationItem) => void;
  className?: string;
}

export const RecentConversations: React.FC<RecentConversationsProps> = ({
  onSelectConversation,
  className,
}) => {
  const conversations: ConversationItem[] = [
    {
      id: 'conv-1',
      title: 'What changed since yesterday?',
      timestamp: '2 hours ago',
      summary: 'Reviewed 3 email threads and 1 rescheduled calendar invite for Project Alpha.',
    },
    {
      id: 'conv-2',
      title: 'Find all updates related to Project Alpha',
      timestamp: 'Yesterday',
      summary: 'Indexed Google Drive spec document and identified deadline discrepancy.',
    },
    {
      id: 'conv-3',
      title: 'Prepare a follow-up email for Rahul',
      timestamp: '2 days ago',
      summary: 'Generated draft context response referencing recent client discussions.',
    },
  ];

  return (
    <Card
      title="Recent conversations"
      description="Personal AI context history"
      className={className}
    >
      <div className="space-y-2.5 mt-1">
        {conversations.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectConversation?.(item)}
            className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 group"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  {item.title}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 truncate pl-5.5">{item.summary}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {item.timestamp}
              </span>
              <div className="h-6 w-6 rounded-lg bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 text-slate-400 flex items-center justify-center transition-colors">
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
