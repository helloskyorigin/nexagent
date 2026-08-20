'use client';

import React from 'react';
import { Sparkles, ArrowRight, ChevronRight } from 'lucide-react';
import { AIRecommendation } from './types';

export interface AIRecommendationsCardProps {
  recommendations: AIRecommendation[];
  onSelectRecommendation: (rec: AIRecommendation) => void;
  onViewAll: () => void;
}

export const AIRecommendationsCard: React.FC<AIRecommendationsCardProps> = ({
  recommendations,
  onSelectRecommendation,
  onViewAll,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">AI Recommendations</h3>
        <div className="text-indigo-600">
          <Sparkles className="h-4 w-4 fill-indigo-500/10 text-indigo-500" />
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3 pt-1">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            onClick={() => onSelectRecommendation(rec)}
            className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50/70 hover:bg-indigo-50/40 border border-slate-100 hover:border-indigo-100 transition-all cursor-pointer group text-left"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="mt-0.5 text-indigo-600 shrink-0">
                <Sparkles className="h-4 w-4 fill-indigo-500/10 text-indigo-600" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-xs font-semibold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                  {rec.title}
                </div>
                {rec.description && (
                  <p className="text-[11px] text-slate-600 leading-normal line-clamp-2">
                    {rec.description}
                  </p>
                )}
              </div>
            </div>

            {/* Action arrow button */}
            <div className="h-7 w-7 rounded-full bg-indigo-100/80 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center shrink-0 transition-all shadow-2xs">
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onViewAll}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 py-1.5 rounded-lg hover:bg-indigo-50/50 transition-colors cursor-pointer group"
        >
          <span>View all recommendations</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
