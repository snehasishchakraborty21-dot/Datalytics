import React from 'react';
import {
  LayoutDashboard,
  Database,
  Users,
  ShoppingCart,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
  X,
} from 'lucide-react';

export type AdminTab = 'dashboard' | 'datasets' | 'customers' | 'orders' | 'enquiries' | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onNavigateDashboard: () => void;
  onNavigateDatasets: () => void;
  onNavigateHome: () => void;
  onSignOut: () => void;
  onModuleClick: (moduleName: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  mobileOpen,
  onCloseMobile,
  onNavigateDashboard,
  onNavigateDatasets,
  onNavigateHome,
  onSignOut,
  onModuleClick,
}) => {
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Left Sidebar (~230px wide, anchored full screen height with independent nav scroll) */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-[230px] shrink-0 bg-white border-r border-[#E5E9E7] flex flex-col justify-between z-40 transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Admin Navigation"
      >
        {/* Top Header: Wordmark (anchored, non-scrolling) */}
        <div className="h-16 px-5 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-xl sm:text-2xl font-serif font-semibold tracking-tight text-[#111827] hover:text-[#0A3D36] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs cursor-pointer text-left"
            aria-label="Datalytics Home"
          >
            Datalytics
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-[#64748B] hover:text-[#111827] rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
            aria-label="Close navigation sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items (scrolls independently on shorter screens) */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Administrative Modules">
          {/* Dashboard */}
          {activeTab === 'dashboard' ? (
            <div
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-md bg-[#0A3D36] text-white cursor-default shadow-xs"
              aria-current="page"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0 text-white" aria-hidden="true" />
              <span>Dashboard</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onNavigateDashboard}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#4B5563] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-md transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0 text-[#64748B]" aria-hidden="true" />
              <span>Dashboard</span>
            </button>
          )}

          {/* Datasets (Enabled - no 'Soon' badge) */}
          {activeTab === 'datasets' ? (
            <div
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-md bg-[#0A3D36] text-white cursor-default shadow-xs"
              aria-current="page"
            >
              <Database className="w-4 h-4 shrink-0 text-white" aria-hidden="true" />
              <span>Datasets</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onNavigateDatasets}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#4B5563] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-md transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
            >
              <Database className="w-4 h-4 shrink-0 text-[#64748B]" aria-hidden="true" />
              <span>Datasets</span>
            </button>
          )}

          {/* Customers */}
          <button
            type="button"
            onClick={() => onModuleClick('Customers')}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-[#4B5563] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-md transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
          >
            <span className="flex items-center gap-2.5">
              <Users className="w-4 h-4 shrink-0 text-[#64748B]" aria-hidden="true" />
              <span>Customers</span>
            </span>
            <span className="text-[10px] font-sans text-[#94A3B8] uppercase tracking-wider">
              Soon
            </span>
          </button>

          {/* Orders */}
          <button
            type="button"
            onClick={() => onModuleClick('Orders')}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-[#4B5563] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-md transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
          >
            <span className="flex items-center gap-2.5">
              <ShoppingCart className="w-4 h-4 shrink-0 text-[#64748B]" aria-hidden="true" />
              <span>Orders</span>
            </span>
            <span className="text-[10px] font-sans text-[#94A3B8] uppercase tracking-wider">
              Soon
            </span>
          </button>

          {/* Enquiries */}
          <button
            type="button"
            onClick={() => onModuleClick('Enquiries')}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-[#4B5563] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-md transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
          >
            <span className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 shrink-0 text-[#64748B]" aria-hidden="true" />
              <span>Enquiries</span>
            </span>
            <span className="text-[10px] font-sans text-[#94A3B8] uppercase tracking-wider">
              Soon
            </span>
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() => onModuleClick('Settings')}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-[#4B5563] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-md transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
          >
            <span className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 shrink-0 text-[#64748B]" aria-hidden="true" />
              <span>Settings</span>
            </span>
            <span className="text-[10px] font-sans text-[#94A3B8] uppercase tracking-wider">
              Soon
            </span>
          </button>
        </nav>

        {/* Bottom Area: View Website & Sign Out (anchored at bottom, non-scrolling) */}
        <div className="p-3 shrink-0 space-y-1">
          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#4B5563] hover:text-[#0A3D36] hover:bg-[#F8FAFC] rounded-md transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
          >
            <ExternalLink className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
            <span>View Website</span>
          </button>

          <button
            type="button"
            onClick={onSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#DC2626] hover:bg-[#FEF2F2] rounded-md transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
