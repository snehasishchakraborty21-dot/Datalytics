import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  currentRoute: 'home' | 'datasets' | 'dataset-detail' | 'consulting' | 'data-storage' | 'pricing' | 'about' | 'contact' | 'signin' | 'create-account' | 'verify-email';
  onNavigateHome: () => void;
  onNavigateDatasets: () => void;
  onNavigateConsulting: () => void;
  onNavigateStorage: () => void;
  onNavigatePricing: () => void;
  onNavigateAbout: () => void;
  onNavigateContact: () => void;
  onNavigateSignIn?: () => void;
  onExploreDatasets: () => void;
  onOpenEnquiry: (context?: string) => void;
  onOpenPreviewNotice: (title: string, message: string) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigateHome,
  onNavigateDatasets,
  onNavigateConsulting,
  onNavigateStorage,
  onNavigatePricing,
  onNavigateAbout,
  onNavigateContact,
  onNavigateSignIn,
  onExploreDatasets,
  onOpenEnquiry,
  onOpenPreviewNotice,
  onScrollToSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onScrollToSection(sectionId);
  };

  const handleFuturePageClick = (pageName: string) => {
    setMobileMenuOpen(false);
    onOpenPreviewNotice(
      `${pageName} Page Preview`,
      `The ${pageName} section will be available once the full platform services are deployed. Explore our illustrative catalogue and service specifications on this homepage.`
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xs">
      <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Brand Zone: Restrained typographic wordmark */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                onNavigateHome();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-2xl font-serif font-semibold tracking-tight text-[#111827] hover:text-[#0A3D36] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs cursor-pointer text-left"
              aria-label="Datalytics Home"
            >
              Datalytics
            </button>
          </div>

          {/* Nav Links: Clean typography with active route highlighting */}
          <nav
            className="hidden lg:flex items-center gap-5 xl:gap-8 text-sm font-medium text-[#4B5563]"
            aria-label="Main Navigation"
          >
            <button
              type="button"
              onClick={() => {
                onNavigateHome();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`transition-colors whitespace-nowrap cursor-pointer py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs ${
                currentRoute === 'home'
                  ? 'text-[#111827] font-semibold'
                  : 'hover:text-[#111827]'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={onNavigateDatasets}
              className={`transition-colors whitespace-nowrap cursor-pointer py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs ${
                currentRoute === 'datasets' || currentRoute === 'dataset-detail'
                  ? 'text-[#0A3D36] font-semibold border-b-2 border-[#0A3D36]'
                  : 'hover:text-[#111827]'
              }`}
            >
              Datasets
            </button>
            <button
              type="button"
              onClick={onNavigateConsulting}
              className={`transition-colors whitespace-nowrap cursor-pointer py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs ${
                currentRoute === 'consulting'
                  ? 'text-[#0A3D36] font-semibold border-b-2 border-[#0A3D36]'
                  : 'hover:text-[#111827]'
              }`}
            >
              Consulting
            </button>
            <button
              type="button"
              onClick={onNavigateStorage}
              className={`transition-colors whitespace-nowrap cursor-pointer py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs ${
                currentRoute === 'data-storage'
                  ? 'text-[#0A3D36] font-semibold border-b-2 border-[#0A3D36]'
                  : 'hover:text-[#111827]'
              }`}
            >
              Data Storage
            </button>
            <button
              type="button"
              onClick={onNavigatePricing}
              className={`transition-colors whitespace-nowrap cursor-pointer py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs ${
                currentRoute === 'pricing'
                  ? 'text-[#0A3D36] font-semibold border-b-2 border-[#0A3D36]'
                  : 'hover:text-[#111827]'
              }`}
            >
              Pricing
            </button>
            <button
              type="button"
              onClick={onNavigateAbout}
              className={`transition-colors whitespace-nowrap cursor-pointer py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs ${
                currentRoute === 'about'
                  ? 'text-[#0A3D36] font-semibold border-b-2 border-[#0A3D36]'
                  : 'hover:text-[#111827]'
              }`}
            >
              About
            </button>
            <button
              type="button"
              onClick={onNavigateContact}
              className={`transition-colors whitespace-nowrap cursor-pointer py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs ${
                currentRoute === 'contact'
                  ? 'text-[#0A3D36] font-semibold border-b-2 border-[#0A3D36]'
                  : 'hover:text-[#111827]'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Zone */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (onNavigateSignIn) {
                  onNavigateSignIn();
                } else {
                  onOpenPreviewNotice(
                    'Member Sign In',
                    'Client and researcher account portals are currently in preparation for institutional onboarding. Please submit an enquiry to request early access.'
                  );
                }
              }}
              className={`text-sm font-medium px-3 py-2 transition-colors whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs ${
                currentRoute === 'signin'
                  ? 'text-[#0A3D36] font-semibold border-b-2 border-[#0A3D36]'
                  : 'text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={onExploreDatasets}
              className="inline-flex items-center justify-center px-4.5 py-2.5 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-md transition-colors cursor-pointer shadow-xs whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
            >
              Explore Datasets
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#111827] hover:bg-neutral-100 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer / dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white px-5 py-6 shadow-lg animate-in fade-in duration-150">
          <nav className="flex flex-col gap-3 text-base font-medium text-[#111827]">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateHome();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-left py-2 cursor-pointer ${
                currentRoute === 'home' ? 'text-[#0A3D36] font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateDatasets();
              }}
              className={`text-left py-2 cursor-pointer ${
                currentRoute === 'datasets' || currentRoute === 'dataset-detail' ? 'text-[#0A3D36] font-semibold' : ''
              }`}
            >
              Datasets
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateConsulting();
              }}
              className={`text-left py-2 cursor-pointer ${
                currentRoute === 'consulting' ? 'text-[#0A3D36] font-semibold' : ''
              }`}
            >
              Consulting
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateStorage();
              }}
              className={`text-left py-2 cursor-pointer ${
                currentRoute === 'data-storage' ? 'text-[#0A3D36] font-semibold' : ''
              }`}
            >
              Data Storage
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigatePricing();
              }}
              className={`text-left py-2 cursor-pointer ${
                currentRoute === 'pricing' ? 'text-[#0A3D36] font-semibold' : 'text-[#4B5563]'
              }`}
            >
              Pricing
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateAbout();
              }}
              className={`text-left py-2 cursor-pointer ${
                currentRoute === 'about' ? 'text-[#0A3D36] font-semibold' : 'text-[#4B5563]'
              }`}
            >
              About
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateContact();
              }}
              className={`text-left py-2 cursor-pointer ${
                currentRoute === 'contact' ? 'text-[#0A3D36] font-semibold' : 'text-[#4B5563]'
              }`}
            >
              Contact
            </button>
          </nav>

          <div className="mt-6 flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateDatasets();
              }}
              className="w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-md transition-colors cursor-pointer"
            >
              Explore Datasets
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigateSignIn) {
                  onNavigateSignIn();
                } else {
                  onOpenPreviewNotice(
                    'Member Sign In',
                    'Client and researcher account portals are currently in preparation for institutional onboarding.'
                  );
                }
              }}
              className={`w-full text-center px-4 py-2 text-sm font-medium cursor-pointer ${
                currentRoute === 'signin'
                  ? 'text-[#0A3D36] font-semibold'
                  : 'text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
