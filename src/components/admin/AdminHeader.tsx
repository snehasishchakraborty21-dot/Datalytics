import React, { ReactNode } from 'react';
import { Menu } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  badge?: ReactNode;
  action?: ReactNode;
  onOpenMobileSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  badge,
  action,
  onOpenMobileSidebar,
}) => {
  return (
    <header className="h-16 bg-white px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-[#4B5563] hover:text-[#111827] rounded-md hover:bg-[#F1F5F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Heading: Century Schoolbook */}
        <div className="flex items-center gap-2.5">
          <h1 className="font-schoolbook font-bold text-2xl sm:text-3xl text-[#111827] tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
      </div>

      {/* Right: Optional action + Small "Sample data" label & "Admin Preview" account badge */}
      <div className="flex items-center gap-2 sm:gap-3">
        {action}
        <span className="hidden sm:inline-block text-[11px] font-mono px-2.5 py-1 rounded bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] tracking-wider uppercase font-medium">
          Sample data
        </span>

        {/* Admin Preview Account Indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#111827]">
          <div className="w-5 h-5 rounded-full bg-[#0A3D36] text-white flex items-center justify-center text-[10px] font-bold">
            A
          </div>
          <span className="hidden sm:inline font-sans">Admin Preview</span>
        </div>
      </div>
    </header>
  );
};
