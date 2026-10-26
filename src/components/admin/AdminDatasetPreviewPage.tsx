import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, Edit3 } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminFooter } from './AdminFooter';
import { ALL_ADMIN_DATASETS, AdminDataset } from '../../data/adminDatasets';
import { DatasetImage } from '../../data/datasets';

interface AdminDatasetPreviewPageProps {
  datasetId: string;
  datasets?: AdminDataset[];
  fromEditor?: boolean;
  onBackToDatasets: () => void;
  onEditDataset?: (datasetId: string) => void;
  onNavigateDashboard: () => void;
  onNavigateHome: () => void;
  onSignOut: () => void;
}

interface DatasetImageDisplayProps {
  image: DatasetImage;
  heightClass: string;
}

const DatasetImageDisplay: React.FC<DatasetImageDisplayProps> = ({ image, heightClass }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!image?.url) {
    return (
      <div
        className={`w-full ${heightClass} bg-[#F4F6F5] rounded-md border border-dashed border-[#CBD5E1] flex flex-col items-center justify-center p-6 text-center text-[#64748B]`}
      >
        <div className="w-10 h-10 rounded-full bg-[#E0ECE6] flex items-center justify-center mb-2 text-[#0A3D36]">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#0A3D36] font-sans">
          No photograph attached
        </span>
      </div>
    );
  }

  return (
    <figure className="w-full flex flex-col m-0">
      <div
        className={`relative w-full ${heightClass} bg-[#F4F6F5] rounded-md overflow-hidden border border-[#E2E8F0]/80 shadow-xs`}
      >
        {(!loaded || error) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#F1F6F3]">
            <div className="w-12 h-12 rounded-full bg-[#E0ECE6] flex items-center justify-center mb-2.5 text-[#0A3D36]">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0A3D36] font-sans mb-1">
              Photographic Reference
            </span>
            <p className="text-xs text-[#525B66] max-w-xs font-sans">
              {image.caption || image.alt}
            </p>
          </div>
        )}

        {!error && (
          <img
            src={image.url}
            alt={image.alt}
            loading="eager"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ objectPosition: image.cropPosition || 'center' }}
          />
        )}
      </div>

      {image.caption && (
        <figcaption className="mt-2 text-[11px] sm:text-xs text-[#64748B] flex items-center justify-between gap-2 font-sans px-0.5">
          <span className="truncate">{image.caption}</span>
          {image.attribution && (
            <span className="shrink-0 text-[#94A3B8] italic">{image.attribution}</span>
          )}
        </figcaption>
      )}
    </figure>
  );
};

export const AdminDatasetPreviewPage: React.FC<AdminDatasetPreviewPageProps> = ({
  datasetId,
  datasets,
  fromEditor,
  onBackToDatasets,
  onEditDataset,
  onNavigateDashboard,
  onNavigateHome,
  onSignOut,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [comingSoonToast, setComingSoonToast] = useState<string | null>(null);

  const datasetsList = datasets || ALL_ADMIN_DATASETS;
  const adminDataset: AdminDataset | undefined = datasetsList.find(
    (d) => d.id === datasetId
  );

  const handleModuleClick = (moduleName: string) => {
    setComingSoonToast(`${moduleName} module is planned for a subsequent development step.`);
    setTimeout(() => {
      setComingSoonToast((current) => (current?.startsWith(moduleName) ? null : current));
    }, 3200);
  };

  if (!adminDataset) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
        <div className="flex-1 flex w-full relative items-start">
          <AdminSidebar
            activeTab="datasets"
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
            onNavigateDashboard={onNavigateDashboard}
            onNavigateDatasets={onBackToDatasets}
            onNavigateHome={onNavigateHome}
            onSignOut={onSignOut}
            onModuleClick={handleModuleClick}
          />
          <div className="flex-1 min-w-0 flex flex-col min-h-screen">
            <AdminHeader
              title="Dataset Preview"
              onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            />
            <main className="flex-1 p-6 lg:p-8 max-w-[1536px] w-full mx-auto">
              <div className="bg-white p-8 rounded-md border border-[#E2E8F0] text-center">
                <h2 className="font-schoolbook font-bold text-xl text-[#111827] mb-2">
                  Dataset Not Found
                </h2>
                <p className="text-sm text-[#64748B] mb-5">
                  The requested dataset identifier does not exist in the administrative catalogue.
                </p>
                <button
                  type="button"
                  onClick={onBackToDatasets}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-md transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Datasets</span>
                </button>
              </div>
            </main>
            <AdminFooter />
          </div>
        </div>
      </div>
    );
  }

  const ds = adminDataset.datasetItem;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans selection:bg-[#0A3D36]/10 selection:text-[#0A3D36]">
      {/* Screen Layout: Anchored Sidebar + Scrollable Main Content */}
      <div className="flex-1 flex w-full relative items-start">
        {/* Admin Navigation Sidebar (Datasets highlighted) */}
        <AdminSidebar
          activeTab="datasets"
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onNavigateDashboard={onNavigateDashboard}
          onNavigateDatasets={onBackToDatasets}
          onNavigateHome={onNavigateHome}
          onSignOut={onSignOut}
          onModuleClick={handleModuleClick}
        />

        {/* Main Workspace Column */}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen bg-white">
          {/* Header with Title and Status Badge */}
          <AdminHeader
            title="Dataset Preview"
            badge={
              <div className="flex items-center gap-2">
                {adminDataset.status === 'Published' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0FDF4] text-[#0A3D36] border border-[#DCFCE7]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D36]" />
                    Published
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
                    Draft
                  </span>
                )}
              </div>
            }
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          />

          {/* Module Notification Toast */}
          {comingSoonToast && (
            <div
              role="status"
              aria-live="polite"
              className="bg-[#0A3D36] text-white text-xs py-2 px-4 text-center font-medium transition-all"
            >
              {comingSoonToast}
            </div>
          )}

          {/* Preview Navigation & Back to Datasets bar */}
          <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBackToDatasets}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{fromEditor ? 'Back to Editor' : 'Back to Datasets'}</span>
            </button>

            <div className="flex items-center gap-3">
              {onEditDataset && (
                <button
                  type="button"
                  onClick={() => onEditDataset(adminDataset.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Dataset</span>
                </button>
              )}
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <Eye className="w-3.5 h-3.5 text-[#0A3D36]" aria-hidden="true" />
                <span>Admin Read-Only Preview</span>
              </div>
            </div>
          </div>

          {/* Full-width Reused Customer Dataset-Detail Layout */}
          <main className="flex-1 py-8 md:py-12 px-5 md:px-8 lg:px-10 max-w-[1536px] w-full mx-auto">
            {/* 1. MAIN PHOTOGRAPH: Balanced Split Hero */}
            <section aria-label="Dataset Header" className="mb-12 md:mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
                {/* Left: Heading Information */}
                <div className="flex flex-col justify-center">
                  <div className="mb-2.5 flex items-center gap-2">
                    <span className="text-xs font-semibold tracking-wider text-[#0A3D36] uppercase font-sans">
                      {adminDataset.status === 'Draft' ? 'Draft preview dataset' : 'Illustrative dataset'}
                    </span>
                    <span className="text-[#94A3B8]">·</span>
                    <span className="text-xs font-mono text-[#64748B]">
                      {adminDataset.id}
                    </span>
                  </div>

                  <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#111827] leading-[1.12] mb-3.5">
                    {ds.title}
                  </h1>

                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#0A3D36] mb-4 font-sans">
                    <span>{ds.category}</span>
                    <span className="text-[#94A3B8]" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-[#525B66] font-normal capitalize">
                      {ds.location}
                    </span>
                  </div>

                  <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl">
                    {ds.description}
                  </p>
                </div>

                {/* Right: Main Landscape Photograph */}
                <div className="w-full">
                  <DatasetImageDisplay
                    image={ds.primaryImage}
                    heightClass="h-[230px] sm:h-[260px] md:h-[320px] lg:h-[380px]"
                  />
                </div>
              </div>
            </section>

            {/* 2. SECOND PHOTOGRAPH: Editorial Section */}
            <section aria-label="Overview and Coverage" className="mb-12 md:mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                <div className="lg:col-span-5 w-full">
                  <DatasetImageDisplay
                    image={ds.secondaryImage}
                    heightClass="h-[220px] sm:h-[260px] md:h-[300px] lg:h-[330px]"
                  />
                </div>

                <div className="lg:col-span-7 space-y-6 sm:space-y-7">
                  <div>
                    <h2 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] tracking-tight mb-2.5">
                      Overview
                    </h2>
                    <p className="text-sm sm:text-base text-[#334155] leading-relaxed">
                      {ds.overview || ds.description}
                    </p>
                  </div>

                  <div>
                    <h2 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] tracking-tight mb-2.5">
                      Coverage
                    </h2>
                    <p className="text-sm sm:text-base text-[#334155] leading-relaxed">
                      {ds.scopeDetails || ds.coverage}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. DETAILED INFORMATION & PREVIEW ACCESS PANEL */}
            <section aria-label="Detailed Specifications">
              <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-12">
                <div className="flex-1 w-full min-w-0 space-y-10">
                  {/* Available Formats */}
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] tracking-tight whitespace-nowrap">
                      Available Formats:
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                      {ds.formats.map((fmt) => (
                        <span
                          key={fmt}
                          className="px-3 py-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xs text-xs sm:text-sm font-sans font-medium text-[#334155]"
                        >
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Dataset Fields Table */}
                  <div>
                    <div className="mb-3">
                      <h2 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] tracking-tight">
                        Dataset Fields
                      </h2>
                      <span className="text-xs text-[#525B66] italic font-sans block mt-0.5">
                        {adminDataset.status === 'Draft' ? 'Draft field structure' : 'Illustrative field structure'}
                      </span>
                    </div>

                    <div className="w-full border border-[#E5E9E7] rounded-sm overflow-hidden bg-white">
                      <table className="w-full text-left border-collapse table-auto sm:table-fixed">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-[#E5E9E7] text-xs font-semibold uppercase tracking-wider text-[#475569] font-sans">
                            <th scope="col" className="py-3 px-3.5 sm:px-4 w-[34%] sm:w-[28%] font-semibold">
                              Field Name
                            </th>
                            <th scope="col" className="py-3 px-3.5 sm:px-4 w-[44%] sm:w-[50%] font-semibold">
                              Description
                            </th>
                            <th scope="col" className="py-3 px-3.5 sm:px-4 w-[22%] font-semibold">
                              Data Type
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9] font-sans">
                          {ds.fields.map((field) => (
                            <tr key={field.name} className="hover:bg-[#F9FBFA] transition-colors">
                              <td className="py-3 px-3.5 sm:px-4 text-xs font-mono font-medium text-[#111827] break-all align-top">
                                {field.name}
                              </td>
                              <td className="py-3 px-3.5 sm:px-4 text-xs sm:text-[13px] text-[#475569] leading-relaxed break-words align-top">
                                {field.description}
                              </td>
                              <td className="py-3 px-3.5 sm:px-4 text-xs font-medium text-[#0A3D36] break-words align-top">
                                {field.dataType}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right Column: Admin Preview Note Panel */}
                <aside className="w-full lg:w-[320px] xl:w-[360px] shrink-0" aria-label="Dataset admin info panel">
                  <div className="sticky top-28 bg-[#F2F8F5] border border-[#DDEBE5] rounded-md p-6 sm:p-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] tracking-tight">
                        Dataset Status
                      </h3>
                      {adminDataset.status === 'Published' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0FDF4] text-[#0A3D36] border border-[#DCFCE7]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D36]" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
                          Draft
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-[#475569] leading-relaxed font-sans">
                      {adminDataset.status === 'Draft'
                        ? 'This dataset is currently in Draft status and only visible within the admin panel. It does not appear in public marketplace searches.'
                        : 'This dataset is live and published in the customer-facing catalogue.'}
                    </p>

                    <div className="pt-2 border-t border-[#DDEBE5] text-xs text-[#64748B] space-y-2">
                      <div>
                        <span className="font-semibold text-[#111827] block">Identifier:</span>
                        <span className="font-mono">{adminDataset.id}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[#111827] block">Last Updated:</span>
                        <span>{adminDataset.updated || 'Not recorded'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onBackToDatasets}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-sm transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Datasets Listing</span>
                    </button>
                  </div>
                </aside>
              </div>
            </section>

            {/* 4. SOURCE AND LICENSING */}
            <section aria-labelledby="source-and-licensing-heading" className="w-full mt-12 md:mt-16">
              <h2
                id="source-and-licensing-heading"
                className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] tracking-tight mb-5"
              >
                Source and Licensing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] block mb-1.5 font-sans">
                    Source
                  </span>
                  <p className="text-sm md:text-base text-[#111827] leading-relaxed">
                    {ds.source || 'To be confirmed'}
                  </p>
                  {ds.reportingPeriod && (
                    <div className="mt-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] block mb-1 font-sans">
                        Reporting Period
                      </span>
                      <p className="text-sm text-[#111827]">
                        {ds.reportingPeriod}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] block mb-1.5 font-sans">
                    Licensing &amp; Access Terms
                  </span>
                  <p className="text-sm md:text-base text-[#334155] leading-relaxed">
                    {ds.accessLicensing && ds.accessLicensing !== 'To be confirmed'
                      ? ds.accessLicensing
                      : 'To be confirmed'}
                  </p>
                  {ds.updateFrequency && (
                    <div className="mt-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] block mb-1 font-sans">
                        Update Frequency
                      </span>
                      <p className="text-sm text-[#111827]">
                        {ds.updateFrequency}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </main>

          <AdminFooter />
        </div>
      </div>
    </div>
  );
};
