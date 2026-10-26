import React, { useState } from 'react';
import {
  X,
  ChevronRight,
} from 'lucide-react';
import {
  ALL_ADMIN_DATASETS,
  PUBLISHED_DATASETS_COUNT,
  DRAFT_DATASETS_COUNT,
  AdminDataset,
} from '../../data/adminDatasets';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminFooter } from './AdminFooter';

interface AdminDashboardProps {
  datasets?: AdminDataset[];
  onNavigateHome: () => void;
  onSignOut: () => void;
  onNavigateDatasets: () => void;
}

// Sample Enquiries Interface (strictly fictional sample records for review)
interface SampleEnquiry {
  id: string;
  reference: string;
  subject: string;
  serviceType: 'Dataset Access' | 'Consulting' | 'Data Storage';
  date: string;
  status: 'New' | 'Reviewed';
  details: string;
  organizationType: string;
}

// Fictional sample enquiries (compact list; full details in modal)
const SAMPLE_ENQUIRIES: SampleEnquiry[] = [
  {
    id: 'enq-101',
    reference: 'ENQ-2026-101',
    subject: 'Provincial Demographic Cross-Tabulation Query',
    serviceType: 'Dataset Access',
    date: 'Oct 18, 2026',
    status: 'New',
    details:
      'Requesting verification on provincial administrative subdivision attributes and historical census interval cross-tables.',
    organizationType: 'Research Foundation (Sample)',
  },
  {
    id: 'enq-102',
    reference: 'ENQ-2026-102',
    subject: 'Cross-Border Freight Telemetry Advisory',
    serviceType: 'Consulting',
    date: 'Oct 17, 2026',
    status: 'New',
    details:
      'Seeking specialist advisory on methodology for normalizing intermodal customs flow time series across East African transit corridors.',
    organizationType: 'Logistics Consortium (Sample)',
  },
  {
    id: 'enq-103',
    reference: 'ENQ-2026-103',
    subject: 'High-Volume Raster Storage Tier Architecture',
    serviceType: 'Data Storage',
    date: 'Oct 15, 2026',
    status: 'Reviewed',
    details:
      'Inquiry regarding dedicated object storage configuration and bandwidth specifications for multi-terabyte agricultural satellite imagery archives.',
    organizationType: 'Environmental Institute (Sample)',
  },
  {
    id: 'enq-104',
    reference: 'ENQ-2026-104',
    subject: 'Agricultural Yield Indicators License Scope',
    serviceType: 'Dataset Access',
    date: 'Oct 12, 2026',
    status: 'Reviewed',
    details:
      'Institutional request for clarification regarding multi-seat team redistributions and derivative academic publications.',
    organizationType: 'University Department (Sample)',
  },
];

// Fictional sample customers for preview count
const SAMPLE_CUSTOMERS_COUNT = 8;

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  datasets,
  onNavigateHome,
  onSignOut,
  onNavigateDatasets,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<SampleEnquiry | null>(null);
  const [comingSoonToast, setComingSoonToast] = useState<string | null>(null);

  // Datasets collection (shared or default)
  const datasetsList = datasets || ALL_ADMIN_DATASETS;

  // Recent datasets for dashboard view (first 5 records from shared admin datasets)
  const recentAdminDatasets: AdminDataset[] = datasetsList.slice(0, 5);

  // Shared operational counts calculated dynamically
  const publishedDatasetsCount = datasetsList.filter((d) => d.status === 'Published').length;
  const draftDatasetsCount = datasetsList.filter((d) => d.status === 'Draft').length;
  const customersCount = SAMPLE_CUSTOMERS_COUNT;
  const newEnquiriesCount = SAMPLE_ENQUIRIES.filter((e) => e.status === 'New').length;

  const handleModuleClick = (moduleName: string) => {
    setComingSoonToast(`${moduleName} module is planned for a subsequent development step.`);
    setTimeout(() => {
      setComingSoonToast((current) => (current?.startsWith(moduleName) ? null : current));
    }, 3200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans selection:bg-[#0A3D36]/10 selection:text-[#0A3D36]">
      {/* Screen Layout: Anchored Sidebar + Scrollable Main Content */}
      <div className="flex-1 flex w-full relative items-start">
        {/* Admin Navigation Sidebar (Datasets enabled without 'Soon' label) */}
        <AdminSidebar
          activeTab="dashboard"
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onNavigateDashboard={() => {}}
          onNavigateDatasets={onNavigateDatasets}
          onNavigateHome={onNavigateHome}
          onSignOut={onSignOut}
          onModuleClick={handleModuleClick}
        />

        {/* Main Workspace Column */}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen">
          {/* Top Bar Header */}
          <AdminHeader
            title="Dashboard"
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          />

          {/* Module Notification Toast if a 'coming soon' item was clicked */}
          {comingSoonToast && (
            <div
              role="status"
              aria-live="polite"
              className="bg-[#0A3D36] text-white text-xs py-2 px-4 text-center font-medium transition-all"
            >
              {comingSoonToast}
            </div>
          )}

          {/* Main Dashboard Content Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1536px] w-full mx-auto">
            {/* 1. Summary Cards Section (4 compact cards in 1 desktop row, 65-75px height, horizontal layout) */}
            <section aria-labelledby="summary-cards-heading">
              <h2 id="summary-cards-heading" className="sr-only">
                Operational Summary Metrics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Published Datasets Card */}
                <div className="bg-white px-5 py-4 rounded-md border border-[#E2E8F0] shadow-2xs flex items-center justify-between min-h-[68px] sm:min-h-[70px]">
                  <span className="text-[13px] sm:text-[14px] font-medium text-[#64748B] whitespace-nowrap">
                    Published Datasets
                  </span>
                  <span className="font-schoolbook font-bold text-[26px] sm:text-[28px] text-[#111827] leading-none shrink-0 ml-3">
                    {publishedDatasetsCount}
                  </span>
                </div>

                {/* Draft Datasets Card */}
                <div className="bg-white px-5 py-4 rounded-md border border-[#E2E8F0] shadow-2xs flex items-center justify-between min-h-[68px] sm:min-h-[70px]">
                  <span className="text-[13px] sm:text-[14px] font-medium text-[#64748B] whitespace-nowrap">
                    Draft Datasets
                  </span>
                  <span className="font-schoolbook font-bold text-[26px] sm:text-[28px] text-[#111827] leading-none shrink-0 ml-3">
                    {draftDatasetsCount}
                  </span>
                </div>

                {/* Customers Card */}
                <div className="bg-white px-5 py-4 rounded-md border border-[#E2E8F0] shadow-2xs flex items-center justify-between min-h-[68px] sm:min-h-[70px]">
                  <span className="text-[13px] sm:text-[14px] font-medium text-[#64748B] whitespace-nowrap">
                    Customers
                  </span>
                  <span className="font-schoolbook font-bold text-[26px] sm:text-[28px] text-[#111827] leading-none shrink-0 ml-3">
                    {customersCount}
                  </span>
                </div>

                {/* New Enquiries Card */}
                <div className="bg-white px-5 py-4 rounded-md border border-[#E2E8F0] shadow-2xs flex items-center justify-between min-h-[68px] sm:min-h-[70px]">
                  <span className="text-[13px] sm:text-[14px] font-medium text-[#64748B] whitespace-nowrap">
                    New Enquiries
                  </span>
                  <span className="font-schoolbook font-bold text-[26px] sm:text-[28px] text-[#111827] leading-none shrink-0 ml-3">
                    {newEnquiriesCount}
                  </span>
                </div>
              </div>
            </section>

            {/* 2. Main Content Grid (~2/3 Left and ~1/3 Right, approximately equal height) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              {/* Left Column: Recent Datasets (~2/3 width, 8 cols) */}
              <section className="lg:col-span-8 bg-white rounded-md border border-[#E2E8F0] shadow-2xs p-5 flex flex-col">
                <div className="mb-4">
                  <h3 className="font-schoolbook font-bold text-lg text-[#111827]">
                    Recent Datasets
                  </h3>
                </div>

                {recentAdminDatasets.length === 0 ? (
                  <div className="py-8 text-center text-sm text-[#64748B]">
                    No dataset records found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                        <tr>
                          <th scope="col" className="py-2.5 px-4 font-semibold">
                            Dataset
                          </th>
                          <th scope="col" className="py-2.5 px-3 font-semibold">
                            Country / Region
                          </th>
                          <th scope="col" className="py-2.5 px-3 font-semibold">
                            Format
                          </th>
                          <th scope="col" className="py-2.5 px-4 text-right font-semibold">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-[#111827]">
                        {recentAdminDatasets.map((record) => (
                          <tr key={record.id} className="hover:bg-[#F8FAFC] transition-colors">
                            {/* Title */}
                            <td className="py-3 px-4 font-medium text-[#111827] max-w-[280px] sm:max-w-[340px]">
                              <span className="line-clamp-1" title={record.title}>
                                {record.title}
                              </span>
                            </td>

                            {/* Country / Region */}
                            <td className="py-3 px-3 text-xs text-[#475569] whitespace-nowrap">
                              {record.country}
                            </td>

                            {/* Format (CSV or PDF only) */}
                            <td className="py-3 px-3 text-xs text-[#475569] whitespace-nowrap">
                              <span className="font-mono text-[11px] font-medium bg-[#F1F5F9] px-2 py-0.5 rounded text-[#334155] border border-[#E2E8F0]">
                                {record.formats.join(', ')}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              {record.status === 'Published' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0FDF4] text-[#0A3D36] border border-[#DCFCE7]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D36]" />
                                  Published
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
                                  Draft
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* Right Column: Recent Enquiries (~1/3 width, 4 cols, compact without description paragraph) */}
              <section className="lg:col-span-4 bg-white rounded-md border border-[#E2E8F0] shadow-2xs p-5 flex flex-col">
                <div className="mb-4">
                  <h3 className="font-schoolbook font-bold text-lg text-[#111827]">
                    Recent Enquiries
                  </h3>
                </div>

                {SAMPLE_ENQUIRIES.length === 0 ? (
                  <div className="py-8 text-center text-sm text-[#64748B]">
                    No enquiries received.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {SAMPLE_ENQUIRIES.map((enquiry) => (
                      <button
                        key={enquiry.id}
                        type="button"
                        onClick={() => setSelectedEnquiry(enquiry)}
                        className="w-full p-2.5 text-left rounded-md hover:bg-[#F8FAFC] transition-colors flex items-start justify-between gap-3 cursor-pointer focus:outline-none focus-visible:bg-[#F1F7F4] group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-mono text-[#64748B]">
                              {enquiry.date}
                            </span>
                            <span className="text-[10px] text-[#0A3D36] font-semibold bg-[#F1F7F4] px-1.5 py-0.5 rounded">
                              {enquiry.serviceType}
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-medium text-[#111827] line-clamp-2 leading-snug group-hover:text-[#0A3D36] transition-colors">
                            {enquiry.subject}
                          </h4>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                          {enquiry.status === 'New' ? (
                            <span className="text-[10px] font-semibold text-[#0A3D36] bg-[#F1F7F4] px-2 py-0.5 rounded-full border border-[#D1E7DD]">
                              New
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded-full border border-[#E2E8F0]">
                              Reviewed
                            </span>
                          )}
                          <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#0A3D36] transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </main>

          {/* Compact Admin Footer */}
          <AdminFooter />
        </div>
      </div>

      {/* Read-Only Sample Enquiry Modal (maintains complete enquiry content) */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-modal-title"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedEnquiry(null)}
            aria-hidden="true"
          />

          {/* Modal Panel */}
          <div className="relative w-full max-w-lg bg-white rounded-md border border-[#E2E8F0] shadow-xl overflow-hidden z-10 p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div>
                <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider block">
                  {selectedEnquiry.reference}
                </span>
                <h3 id="enquiry-modal-title" className="font-schoolbook font-bold text-lg text-[#111827]">
                  Enquiry Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 text-[#64748B] hover:text-[#111827] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                aria-label="Close enquiry details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                  Subject
                </span>
                <p className="font-medium text-[#111827]">{selectedEnquiry.subject}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                    Service Type
                  </span>
                  <p className="text-[#334155]">{selectedEnquiry.serviceType}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                    Date Received
                  </span>
                  <p className="text-[#334155]">{selectedEnquiry.date}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                  Status
                </span>
                <span
                  className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    selectedEnquiry.status === 'New'
                      ? 'bg-[#F1F7F4] text-[#0A3D36] border border-[#D1E7DD]'
                      : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]'
                  }`}
                >
                  {selectedEnquiry.status}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                  Message / Details
                </span>
                <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] text-[#334155] text-xs leading-relaxed">
                  {selectedEnquiry.details}
                </div>
              </div>

              <div className="p-3 bg-[#F1F7F4]/60 border border-[#0A3D36]/20 rounded-md text-[11px] text-[#0A3D36]">
                Sample enquiry record for frontend design review. Real customer messaging and database transactions will be integrated during backend development.
              </div>
            </div>

            {/* Footer action */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 text-xs font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-md transition-colors cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
