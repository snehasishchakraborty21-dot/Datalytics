import React, { useEffect } from 'react';
import { X, Info } from 'lucide-react';

interface PreviewNoticeModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onEnquire?: () => void;
}

export const PreviewNoticeModal: React.FC<PreviewNoticeModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
  onEnquire,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-notice-title"
    >
      <div
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-white rounded-md border border-[#E5E9E7] shadow-xl overflow-hidden z-10">
        <div className="px-6 py-5 border-b border-[#E5E9E7] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#0A3D36]">
            <Info className="w-4 h-4 shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Initial Release Preview
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#64748B] hover:text-[#111827] rounded-md transition-colors cursor-pointer"
            aria-label="Close preview notice"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <h3
            id="preview-notice-title"
            className="font-editorial text-xl font-medium text-[#111827] mb-2"
          >
            {title}
          </h3>

          <p className="text-sm text-[#4B5563] leading-relaxed mb-6">
            {message}
          </p>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#F1F5F9]">
            {onEnquire && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEnquire();
                }}
                className="px-4 py-2 text-xs font-medium text-[#0A3D36] hover:underline cursor-pointer"
              >
                Submit Enquiry
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-sm transition-colors cursor-pointer"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
