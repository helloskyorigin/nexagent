'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { respondToApproval, TaskApproval } from '../../services/agent/storage';

export interface PendingApprovalItem {
  taskId: string;
  taskTitle: string;
  approval: TaskApproval;
}

export interface ApprovalPanelProps {
  approvals: PendingApprovalItem[];
}

export const ApprovalPanel: React.FC<ApprovalPanelProps> = ({ approvals }) => {
  return (
    <div className="bg-[#15181D] border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-400" />
          <span>Needs your approval</span>
        </h3>
        {approvals.length > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
            {approvals.length} Pending
          </span>
        )}
      </div>

      {approvals.length > 0 ? (
        <div className="space-y-3">
          {approvals.map(({ taskId, taskTitle, approval }) => (
            <div
              key={approval.id}
              className="p-3.5 rounded-xl bg-[#0D0F12] border border-amber-500/30 space-y-2.5"
            >
              <div>
                <div className="text-[11px] font-bold text-amber-400 truncate">
                  {taskTitle}
                </div>
                <div className="text-xs font-semibold text-white mt-0.5">
                  {approval.action}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {approval.details}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => respondToApproval(taskId, approval.id, 'rejected')}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => respondToApproval(taskId, approval.id, 'approved')}
                  className="px-3.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors cursor-pointer"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Intentional Empty State */
        <div className="p-6 text-center space-y-1">
          <div className="text-xs font-bold text-white">No approvals waiting.</div>
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
            When Nexorbit needs your permission for an important action, it will appear here.
          </p>
        </div>
      )}
    </div>
  );
};
