'use client';

import React, { useState, useRef } from 'react';
import { api } from '@/lib/api';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Trash2,
  ExternalLink,
  Link as LinkIcon,
} from 'lucide-react';

interface FileUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  allowManualUrl?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label = 'Upload File',
  value,
  onChange,
  accept = 'image/*',
  helperText,
  required = false,
  disabled = false,
  allowManualUrl = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [manualInput, setManualInput] = useState(value || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPdf = value?.toLowerCase().endsWith('.pdf');
  const isServerStored = value?.startsWith('/uploads/') || value?.startsWith('/team/');

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Check size limit (e.g. 25MB)
    if (file.size > 25 * 1024 * 1024) {
      setError('File size exceeds the 25MB limit.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await api.uploadFile(file);
      onChange(response.url);
      setManualInput(response.url);
    } catch (err: any) {
      console.error('File upload error:', err);
      setError(err.message || 'Failed to upload file to server. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleRemove = () => {
    onChange('');
    setManualInput('');
    setError(null);
  };

  const handleManualApply = () => {
    onChange(manualInput.trim());
  };

  return (
    <div className="space-y-2">
      {/* Label and Status */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {value && isServerStored && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Stored on Hostinger Server
          </span>
        )}
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files)}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Upload Zone or Current File Preview */}
      {value ? (
        /* File Already Present / Uploaded */
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 transition-all hover:border-slate-300">
          <div className="flex items-center space-x-3 min-w-0 w-full sm:w-auto">
            {isPdf ? (
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden border border-slate-300 flex-shrink-0 relative">
                <img
                  src={value}
                  alt="Upload Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {value.split('/').pop() || 'Uploaded File'}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">
                  {value}
                </span>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-forest-700 hover:text-forest-800 flex items-center gap-0.5"
                >
                  <ExternalLink className="w-2.5 h-2.5" /> View
                </a>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUploading ? 'animate-spin' : ''}`} />
              <span>Replace File</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled || isUploading}
              className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
              title="Remove file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty State: Drag & Drop or Click to Select from Local Machine */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-forest-500 bg-forest-50/70 scale-[1.01]'
              : 'border-slate-300 hover:border-forest-400 bg-slate-50/60 hover:bg-forest-50/20'
          } ${disabled || isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
              <span className="text-xs font-bold text-slate-800">
                Uploading to Hostinger server...
              </span>
              <span className="text-[10px] text-slate-500">
                Saving file safely to server disk
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center shadow-xs">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">
                  <span className="text-forest-700 hover:underline">Choose file from your computer</span> or drag & drop
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {helperText || (accept.includes('pdf') ? 'Images (JPG, PNG, WEBP) or PDFs up to 25MB' : 'JPG, PNG, WEBP, GIF up to 25MB')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Optional Manual URL Fallback Toggle */}
      {allowManualUrl && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowManualUrl(!showManualUrl)}
            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
          >
            <LinkIcon className="w-2.5 h-2.5" />
            <span>{showManualUrl ? 'Hide manual URL input' : 'Or enter custom URL/path'}</span>
          </button>

          {showManualUrl && (
            <div className="mt-2 flex items-center gap-2 animate-in fade-in">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="https://... or /uploads/..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleManualApply}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
