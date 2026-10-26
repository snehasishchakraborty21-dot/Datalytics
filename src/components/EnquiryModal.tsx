import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillService?: string;
  prefillDatasetTitle?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  prefillService = 'Datasets',
  prefillDatasetTitle,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [service, setService] = useState(prefillService);
  const [message, setMessage] = useState(
    prefillDatasetTitle
      ? `I would like to enquire about access conditions and specifications for the "${prefillDatasetTitle}" dataset.`
      : ''
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (prefillService) {
      setService(prefillService);
    }
    if (prefillDatasetTitle) {
      setMessage(
        `I would like to enquire about access conditions and specifications for the "${prefillDatasetTitle}" dataset.`
      );
    }
  }, [prefillService, prefillDatasetTitle]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFullName('');
    setEmail('');
    setOrganization('');
    setMessage('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-md border border-[#E5E9E7] shadow-xl overflow-hidden z-10 my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E9E7] flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0A3D36]">
              Direct Platform Communication
            </span>
            <h2
              id="enquiry-modal-title"
              className="font-editorial text-2xl font-medium text-[#111827] mt-0.5"
            >
              Submit an Enquiry
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#111827] rounded-md transition-colors cursor-pointer"
            aria-label="Close enquiry modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F2F8F5] text-[#0A3D36] flex items-center justify-center mx-auto border border-[#DDEBE5]">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-editorial text-xl font-medium text-[#111827] mb-2">
                  Preview Notice
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed max-w-sm mx-auto">
                  This is an illustrative preview and no enquiry has been sent.
                  Our team will activate live client intake and submission routing
                  during the next phase of deployment.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-sm transition-colors cursor-pointer"
                >
                  Return to Homepage
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-sm text-xs text-[#525B66] leading-relaxed">
                Provide your research or organizational specifications. Service inquiries are reviewed for custom dataset provisioning, analytical briefs, or storage scope.
              </div>

              <div>
                <label
                  htmlFor="full-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1"
                >
                  Full Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Amina Bello"
                  className="w-full px-3 py-2 text-sm text-[#111827] border border-[#CBD5E1] rounded-sm focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1"
                  >
                    Institutional Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full px-3 py-2 text-sm text-[#111827] border border-[#CBD5E1] rounded-sm focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="organization"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1"
                  >
                    Organization / Entity
                  </label>
                  <input
                    id="organization"
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Company or Research body"
                    className="w-full px-3 py-2 text-sm text-[#111827] border border-[#CBD5E1] rounded-sm focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1"
                >
                  Service of Interest
                </label>
                <select
                  id="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-[#111827] border border-[#CBD5E1] rounded-sm focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] outline-none bg-white"
                >
                  <option value="Datasets">Datasets &amp; Data Marketplace</option>
                  <option value="Consulting">Specialist Research &amp; Consulting</option>
                  <option value="Data Storage">Data Storage &amp; Warehousing</option>
                  <option value="General">Institutional Partnership</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1"
                >
                  Requirements &amp; Objectives
                </label>
                <textarea
                  id="message"
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Outline the geographic focus, data parameters, or consulting scope required..."
                  className="w-full px-3 py-2 text-sm text-[#111827] border border-[#CBD5E1] rounded-sm focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#4B5563] hover:text-[#111827] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-sm transition-colors cursor-pointer"
                >
                  <span>Submit Enquiry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
