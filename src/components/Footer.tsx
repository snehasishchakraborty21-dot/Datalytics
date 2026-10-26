import React from 'react';

interface FooterProps {
  onOpenPreviewNotice: (title: string, message: string) => void;
  onExploreDatasets: () => void;
  onNavigateConsulting?: () => void;
  onNavigateStorage?: () => void;
  onNavigatePricing?: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
  onNavigateAdminLogin?: () => void;
  onCustomDataRequests?: () => void;
  onServicesClick: () => void;
  onEnquiryClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPreviewNotice,
  onExploreDatasets,
  onNavigateConsulting,
  onNavigateStorage,
  onNavigatePricing,
  onNavigateAbout,
  onNavigateContact,
  onNavigateAdminLogin,
  onCustomDataRequests,
  onServicesClick,
  onEnquiryClick,
}) => {
  const handleLegalClick = (title: string) => {
    onOpenPreviewNotice(
      title,
      `The full ${title} document will be published alongside institutional customer onboarding.`
    );
  };

  const handleCompanyClick = (title: string) => {
    onOpenPreviewNotice(
      title,
      `The ${title} page is currently in preparation for the complete platform release.`
    );
  };

  return (
    <footer className="w-full bg-[#FAFAFA] text-[#111827]">
      {/* Upper Navigation & Links Area separated by comfortable whitespace */}
      <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto pt-12 md:pt-16 pb-8 md:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Purpose (5 cols) */}
          <div className="md:col-span-5 max-w-sm">
            <span className="font-serif text-2xl font-semibold tracking-tight text-[#111827] block mb-2.5">
              Datalytics
            </span>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              African data and intelligence for informed decisions.
            </p>
          </div>

          {/* Platform Links (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3.5">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-[#334155]">
              <li>
                <button
                  type="button"
                  onClick={onExploreDatasets}
                  className="hover:text-[#0A3D36] transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  Explore Datasets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateConsulting) {
                      onNavigateConsulting();
                    } else {
                      onServicesClick();
                    }
                  }}
                  className="hover:text-[#0A3D36] transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  Consulting Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateStorage || onServicesClick}
                  className="hover:text-[#0A3D36] transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  Data Storage
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigatePricing}
                  className="hover:text-[#0A3D36] transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onCustomDataRequests || onEnquiryClick}
                  className="hover:text-[#0A3D36] transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  Custom Data Requests
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links (2 cols) */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3.5">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-[#334155]">
              <li>
                <button
                  type="button"
                  onClick={onNavigateAbout || (() => handleCompanyClick('About Datalytics'))}
                  className="hover:text-[#0A3D36] transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateContact || (() => handleCompanyClick('Contact Datalytics'))}
                  className="hover:text-[#0A3D36] transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCompanyClick('Methodology & Research')}
                  className="hover:text-[#0A3D36] transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  Methodology
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCompanyClick('Data Contributor Network')}
                  className="hover:text-[#0A3D36] transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  Data Contributors
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3.5">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-[#334155]">
              <li>
                <button
                  type="button"
                  onClick={() => handleLegalClick('Terms and Conditions')}
                  className="hover:text-[#0A3D36] transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  Terms and Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLegalClick('Privacy Policy')}
                  className="hover:text-[#0A3D36] transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLegalClick('Dataset Licensing')}
                  className="hover:text-[#0A3D36] transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  Dataset Licensing
                </button>
              </li>
              {/* Temporary Admin Sign In for Design Review (remove before launch) */}
              <li>
                <button
                  type="button"
                  onClick={onNavigateAdminLogin}
                  className="hover:text-[#0A3D36] transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  Admin Sign In
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Developer-Credit Strip (no horizontal divider lines) */}
      <div className="w-full">
        <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          {/* Left-aligned Copyright */}
          <div className="text-[#000000] font-bold text-[14px] leading-normal text-left">
            © 2026 Datalytics. All rights reserved.
          </div>

          {/* Right-aligned Developer Credit */}
          <div className="font-schoolbook font-bold italic text-[13px] md:text-sm text-[#334155] tracking-wide text-left sm:text-right">
            Designed &amp; Developed by ASCO GLOBAL SOLUTIONS
          </div>
        </div>
      </div>
    </footer>
  );
};
