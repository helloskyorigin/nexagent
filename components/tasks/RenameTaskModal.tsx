'use client';

import React, { useState } from 'react';
import { X, Edit2 } from 'lucide-react';
import { TaskItem, renameTask } from '../../services/tasks/taskService';

interface RenameTaskModalProps {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RenameTaskModal: React.FC<RenameTaskModalProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !task) return null;

  return (
    <RenameTaskModalContent
      key={task.id}
      task={task}
      onClose={onClose}
    />
  );
};

const RenameTaskModalContent: React.FC<{
  task: TaskItem;
  onClose: () => void;
}> = ({ task, onClose }) => {
  const [title, setTitle] = useState(task.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      renameTask(task.id, title.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn select-none">
      <div
        className="w-full max-w-md bg-[#121520] border border-white/[0.1] rounded-2xl shadow-2xl p-6 relative space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 text-white font-semibold text-sm sm:text-base">
            <Edit2 className="h-4 w-4 text-blue-400" />
            <span>Rename Task</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Task Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#161a27] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
