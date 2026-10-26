import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { DatasetItem, DatasetImage } from '../data/datasets';

interface DatasetDetailPageProps {
  dataset?: DatasetItem | null;
  isUnavailable?: boolean;
  onNavigateHome: () => void;
  onBackToDatasets: () => void;
  onRequestAccess: (dataset: DatasetItem) => void;
}

interface DatasetImageDisplayProps {
  image: DatasetImage;
  heightClass: string;
  loading?: 'eager' | 'lazy';
  priority?: boolean;
}

const DatasetImageDisplay: React.FC<DatasetImageDisplayProps> = ({
  image,
  heightClass,
  loading = 'lazy',
  priority = false,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <figure className="w-full flex flex-col m-0">
      <div
        className={`relative w-full ${heightClass} bg-[#F4F6F5] rounded-md overflow-hidden border border-[#E2E8F0]/80 shadow-xs`}
      >
        {/* Placeholder / Styled Fallback if image is loading or fails */}
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

        {/* Real Authentic Photograph */}
        {!error && Boolean(image?.url) && (
          <img
            src={image.url}
            alt={image.alt || 'Dataset photograph'}
            loading={priority ? 'eager' : loading}
            decoding={priority ? 'sync' : 'async'}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ objectPosition: image.cropPosition || 'center' }}
          />
        )}
      </div>

      {/* Subtle Caption & Attribution */}
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

export const DatasetDetailPage: React.FC<DatasetDetailPageProps> = ({
  dataset,
  isUnavailable = false,
  onNavigateHome,
  onBackToDatasets,
  onRequestAccess,
}) => {
  if (isUnavailable || !dataset) {
    return (
      <div className="w-full bg-[#FCFDFD] min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-6">
        <div className="max-w-md w-full bg-white border border-[#E2E8F0] rounded-md p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="font-editorial text-2xl font-bold text-[#111827] mb-2">
            This dataset is currently unavailable.
          </h1>
          <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
            This dataset has been removed or unpublished from the public catalogue. Its information and files remain preserved in the administration panel.
          </p>
          <button
            type="button"
            onClick={onBackToDatasets}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-md transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Datasets</span>
          </button>
        </div>
      </div>
    );
  }

  const AccessPanel = () => (
    <div className="bg-[#F2F8F5] border border-[#DDEBE5] rounded-md p-6 sm:p-7">
      <h2 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] mb-2 tracking-tight">
        Dataset Access
      </h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-6 font-sans">
        Enquire about availability, pricing and licensing.
      </p>
      <button
        type="button"
        onClick={() => onRequestAccess(dataset)}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
      >
        <span>Enquire About This Dataset</span>
        <ArrowRight className="w-4 h-4" />
      </button>
      <p className="mt-4 text-xs text-[#64748B] leading-relaxed text-center sm:text-left font-sans">
        Illustrative listing. Purchasing and downloads are not available in this preview.
      </p>
    </div>
  );

  return (
    <div className="w-full bg-white min-h-[70vh] py-8 md:py-12">
      <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto">
        {/* TOP BAR: Breadcrumb Navigation & Back Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <nav aria-label="Breadcrumb" className="text-xs text-[#525B66] font-medium flex items-center flex-wrap gap-1.5">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-[#0A3D36] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
            >
              Home
            </button>
            <span className="text-[#94A3B8]" aria-hidden="true">
              /
            </span>
            <button
              type="button"
              onClick={onBackToDatasets}
              className="hover:text-[#0A3D36] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
            >
              Datasets
            </button>
            <span className="text-[#94A3B8]" aria-hidden="true">
              /
            </span>
            <span className="text-[#111827] font-semibold truncate max-w-[280px] sm:max-w-md">
              {dataset.title}
            </span>
          </nav>

          <button
            type="button"
            onClick={onBackToDatasets}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Datasets</span>
          </button>
        </div>

        {/* 1. MAIN PHOTOGRAPH: Balanced Split Hero (Equal Columns, ~40px gap) */}
        <section aria-label="Dataset Header" className="mb-12 md:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            {/* Left: Heading Information on White Background */}
            <div className="flex flex-col justify-center">
              {/* Small Illustrative dataset label */}
              <div className="mb-2.5">
                <span className="text-xs font-semibold tracking-wider text-[#0A3D36] uppercase font-sans">
                  Illustrative dataset
                </span>
              </div>

              {/* Selected dataset title as main heading */}
              <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#111827] leading-[1.12] mb-3.5">
                {dataset.title}
              </h1>

              {/* Category and country or region on one compact row */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#0A3D36] mb-4 font-sans">
                <span>{dataset.category}</span>
                <span className="text-[#94A3B8]" aria-hidden="true">
                  ·
                </span>
                <span className="text-[#525B66] font-normal capitalize">
                  {dataset.location}
                </span>
              </div>

              {/* Short dataset description */}
              <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl">
                {dataset.description}
              </p>
            </div>

            {/* Right: Main Landscape Photograph (~340-400px desktop, ~220-260px mobile) */}
            <div className="w-full">
              <DatasetImageDisplay
                image={dataset.primaryImage}
                heightClass="h-[230px] sm:h-[260px] md:h-[320px] lg:h-[380px]"
                priority={true}
              />
            </div>
          </div>
        </section>

        {/* 2. SECOND PHOTOGRAPH: Editorial Section (~45% image / ~55% text) */}
        <section aria-label="Overview and Coverage" className="mb-12 md:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left on Desktop / Top on Mobile: Second Photograph (~45% = 5 cols) */}
            <div className="lg:col-span-5 w-full">
              <DatasetImageDisplay
                image={dataset.secondaryImage}
                heightClass="h-[220px] sm:h-[260px] md:h-[300px] lg:h-[330px]"
                loading="lazy"
              />
            </div>

            {/* Right on Desktop / Bottom on Mobile: Overview and Coverage (~55% = 7 cols) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7">
              {/* Overview */}
              <div>
                <h2 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] tracking-tight mb-2.5">
                  Overview
                </h2>
                <p className="text-sm sm:text-base text-[#334155] leading-relaxed">
                  {dataset.overview || dataset.description}
                </p>
              </div>

              {/* Coverage */}
              <div>
                <h2 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] tracking-tight mb-2.5">
                  Coverage
                </h2>
                <p className="text-sm sm:text-base text-[#334155] leading-relaxed">
                  {dataset.scopeDetails || dataset.coverage}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. DETAILED INFORMATION & ACCESS PANEL: Beside each other on desktop */}
        <section aria-label="Detailed Specifications">
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-12">
            {/* Left: Detailed Information (Available Formats, Fields table, Source/Licensing) */}
            <div className="flex-1 w-full min-w-0 space-y-10">
              {/* Available Formats: Compact inline layout on the same horizontal line */}
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] tracking-tight whitespace-nowrap">
                  Available Formats:
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  {dataset.formats.map((fmt) => (
                    <span
                      key={fmt}
                      className="px-3 py-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xs text-xs sm:text-sm font-sans font-medium text-[#334155]"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dataset Fields */}
              <div>
                <div className="mb-3">
                  <h2 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] tracking-tight">
                    Dataset Fields
                  </h2>
                  <span className="text-xs text-[#525B66] italic font-sans block mt-0.5">
                    Illustrative field structure
                  </span>
                </div>

                {/* Clean Table: Natural height without internal scrolling */}
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
                      {dataset.fields.map((field) => (
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

            {/* Right on Desktop / Bottom on Mobile: Compact Dataset Access Panel */}
            <aside className="w-full lg:w-[320px] xl:w-[360px] shrink-0" aria-label="Dataset access panel">
              <div className="sticky top-28">
                <AccessPanel />
              </div>
            </aside>
          </div>
        </section>

        {/* 4. SOURCE AND LICENSING: Full Available Content Width */}
        <section aria-labelledby="source-and-licensing-heading" className="w-full mt-12 md:mt-16">
          <h2
            id="source-and-licensing-heading"
            className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] tracking-tight mb-5"
          >
            Source and Licensing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
            {/* Left Column: Source and its value */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] block mb-1.5 font-sans">
                Source
              </span>
              <p className="text-sm md:text-base text-[#111827] leading-relaxed">
                {dataset.source || 'To be confirmed'}
              </p>
              {dataset.reportingPeriod && (
                <div className="mt-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] block mb-1 font-sans">
                    Reporting Period
                  </span>
                  <p className="text-sm text-[#111827]">
                    {dataset.reportingPeriod}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Licensing & Access Terms and its value */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] block mb-1.5 font-sans">
                Licensing &amp; Access Terms
              </span>
              <p className="text-sm md:text-base text-[#334155] leading-relaxed">
                {dataset.accessLicensing && dataset.accessLicensing !== 'To be confirmed'
                  ? dataset.accessLicensing
                  : 'To be confirmed'}
              </p>
              {dataset.updateFrequency && (
                <div className="mt-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] block mb-1 font-sans">
                    Update Frequency
                  </span>
                  <p className="text-sm text-[#111827]">
                    {dataset.updateFrequency}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
