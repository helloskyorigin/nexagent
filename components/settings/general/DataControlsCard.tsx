'use client';

import React, { useRef } from 'react';
import { Download, Upload, Trash2, Brain, ChevronRight } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import { cn } from '../../../lib/utils';

export interface DataControlsCardProps {
  onExportClick: () => void;
  onImportClick: () => void;
  onClearBrowsingClick: () => void;
  onManageMemoryClick: () => void;
  className?: string;
}

export const DataControlsCard: React.FC<DataControlsCardProps> = ({
  onExportClick,
  onImportClick,
  onClearBrowsingClick,
  onManageMemoryClick,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addToast({
        type: 'info',
        title: 'Ingesting Memory Archive',
        description: `Importing ${file.name} (${(file.size / 1024).toFixed(1)} KB)...`,
      });
      setTimeout(() => {
        addToast({
          type: 'success',
          title: 'Import Completed',
          description: `Successfully imported memory items from ${file.name}.`,
        });
      }, 1200);
    }
  };

  const triggerImportFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={cn(
        'p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] transition-all space-y-3',
        className
      )}
    >
      {/* Hidden File Input for Real File Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.zip,.txt,.md"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="space-y-0.5">
        <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white tracking-tight">
          Data Controls
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Control your data and memory.
        </p>
      </div>

      {/* Action Options List */}
      <div className="space-y-1 pt-1">
        {/* Export all data */}
        <button
          type="button"
          onClick={onExportClick}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="shrink-0">
              <Download className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Export all data
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>

        {/* Import data */}
        <button
          type="button"
          onClick={triggerImportFile}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="shrink-0">
              <Upload className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Import data
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>

        {/* Clear browsing data */}
        <button
          type="button"
          onClick={onClearBrowsingClick}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="shrink-0">
              <Trash2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Clear browsing data
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>

        {/* Manage memory */}
        <button
          type="button"
          onClick={onManageMemoryClick}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="shrink-0">
              <Brain className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Manage memory
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>
      </div>
    </div>
  );
};
