'use client';

import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { UserProfile } from '../types';
import { useToast } from '../../ui/Toast';
import { User, Mail, Globe, Clock, UserCheck } from 'lucide-react';

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<UserProfile>(user);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    addToast({
      type: 'success',
      title: 'Profile Updated',
      description: 'Your personal details and profile preferences have been saved.',
    });
  };

  const initialLetter = formData.name ? formData.name.charAt(0).toUpperCase() : 'S';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      description="Update your personal details and Nexorbit identity"
      maxWidth="md"
    >
      <form onSubmit={handleSave} className="space-y-4 pt-2">
        {/* Avatar Preview */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold shadow-2xs select-none">
            {initialLetter}
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-900">
              Profile Avatar
            </div>
            <p className="text-[11px] text-slate-500">
              Auto-generated initial badge matching Nexorbit light design style.
            </p>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span>Full Name</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            <span>Email Address</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Timezone & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Time Zone</span>
            </label>
            <input
              type="text"
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span>Language</span>
            </label>
            <input
              type="text"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};
