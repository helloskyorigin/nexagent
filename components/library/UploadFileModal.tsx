'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, File, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createFileItem, formatFileSize } from '../../services/library/libraryService';
import { cn } from '../../lib/utils';

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UploadFileModal: React.FC<UploadFileModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setCustomTitle(file.name);
      setErrorMsg(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setCustomTitle(file.name);
      setErrorMsg(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMsg(null);
    setUploadProgress(20);

    try {
      // Simulate real progress ticks
      await new Promise((r) => setTimeout(r, 150));
      setUploadProgress(60);
      await new Promise((r) => setTimeout(r, 150));
      setUploadProgress(90);

      await createFileItem(selectedFile, customTitle.trim() || selectedFile.name);
      setUploadProgress(100);

      await new Promise((r) => setTimeout(r, 100));
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Upload failed:', err);
      setErrorMsg('Upload failed. Please try again.');
      setUploadProgress(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        id="upload-file-modal"
        className={cn(
          'relative w-full max-w-lg rounded-2xl z-10',
          'bg-[#121520] border border-white/[0.12]',
          'shadow-2xl shadow-black/80',
          'p-6 animate-in zoom-in-95 duration-150'
        )}
      >
        {/* Close Button */}
        <button
          id="close-upload-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white tracking-tight">Upload file</h2>
          <p className="text-sm text-slate-400 mt-1">
            Upload documents, images, code files, or data to your library.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          {/* Dropzone Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all',
              selectedFile
                ? 'border-blue-500/50 bg-blue-500/5'
                : 'border-white/[0.12] hover:border-white/[0.25] bg-[#0b0d13]/60'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                  <File size={24} />
                </div>
                <p className="text-sm font-semibold text-white truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatFileSize(selectedFile.size)}
                </p>
                <span className="text-[11px] text-blue-400 mt-2 hover:underline">
                  Click or drop to choose a different file
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 mb-2">
                  <Upload size={22} />
                </div>
                <p className="text-sm font-medium text-slate-200">
                  Drop your file here, or <span className="text-blue-400 underline">browse</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PDF, DOCX, PNG, JPG, TS, PY, JSON, TXT and more
                </p>
              </div>
            )}
          </div>

          {/* Title Override */}
          {selectedFile && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Display Title <span className="text-slate-500">(optional)</span>
              </label>
              <input
                id="upload-title-input"
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Project Roadmap"
                className={cn(
                  'w-full px-3.5 py-2 rounded-xl text-sm',
                  'bg-[#0b0d13] border border-white/[0.1] text-white placeholder:text-slate-500',
                  'focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50',
                  'transition-colors'
                )}
              />
            </div>
          )}

          {/* Progress Bar */}
          {uploadProgress !== null && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
            <button
              id="cancel-upload-btn"
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium',
                'text-slate-300 hover:text-white hover:bg-white/[0.06]',
                'transition-colors disabled:opacity-50'
              )}
            >
              Cancel
            </button>
            <button
              id="submit-upload-btn"
              type="submit"
              disabled={!selectedFile || isUploading}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium',
                'bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none text-white',
                'shadow-lg shadow-blue-600/20 active:scale-[0.98]',
                'transition-all duration-150'
              )}
            >
              {isUploading ? 'Uploading...' : 'Upload to Library'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
