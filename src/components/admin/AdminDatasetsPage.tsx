import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Eye, Edit3, Plus, AlertCircle } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminFooter } from './AdminFooter';
import {
  AdminDataset,
  ALL_ADMIN_DATASETS,
  ADMIN_DATASET_LOCATIONS,
  TOTAL_ADMIN_DATASETS_COUNT,
} from '../../data/adminDatasets';

export interface DatasetsFilterState {
  searchQuery: string;
  statusFilter: 'all' | 'Published' | 'Draft';
  countryFilter: string;
  formatFilter: 'all' | 'CSV' | 'PDF';
  currentPage: number;
  scrollPosition?: number;
}

interface AdminDatasetsPageProps {
  datasets?: AdminDataset[];
  initialFilterState?: DatasetsFilterState;
  onFilterStateChange?: (state: DatasetsFilterState) => void;
  onNavigateDashboard: () => void;
  onNavigateHome: () => void;
  onSignOut: () => void;
  onPreviewDataset: (datasetId: string, currentState: DatasetsFilterState) => void;
  onNewDataset: () => void;
  onEditDataset: (datasetId: string, currentState: DatasetsFilterState) => void;
  onUnpublishDataset?: (datasetId: string) => void;
}

const ITEMS_PER_PAGE = 10;

export const AdminDatasetsPage: React.FC<AdminDatasetsPageProps> = ({
  datasets,
  initialFilterState,
  onFilterStateChange,
  onNavigateDashboard,
  onNavigateHome,
  onSignOut,
  onPreviewDataset,
  onNewDataset,
  onEditDataset,
  onUnpublishDataset,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [comingSoonToast, setComingSoonToast] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [datasetToUnpublish, setDatasetToUnpublish] = useState<AdminDataset | null>(null);

  // Escape key listener for unpublish modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && datasetToUnpublish) {
        setDatasetToUnpublish(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [datasetToUnpublish]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(initialFilterState?.searchQuery || '');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Published' | 'Draft'>(
    initialFilterState?.statusFilter || 'all'
  );
  const [countryFilter, setCountryFilter] = useState<string>(
    initialFilterState?.countryFilter || 'all'
  );
  const [formatFilter, setFormatFilter] = useState<'all' | 'CSV' | 'PDF'>(
    initialFilterState?.formatFilter || 'all'
  );
  const [currentPage, setCurrentPage] = useState<number>(initialFilterState?.currentPage || 1);

  // Restore scroll position if returning from preview
  useEffect(() => {
    if (initialFilterState?.scrollPosition) {
      window.scrollTo({ top: initialFilterState.scrollPosition, behavior: 'instant' as ScrollBehavior });
    }
  }, [initialFilterState?.scrollPosition]);

  // Keep parent in sync with filter state changes
  useEffect(() => {
    if (onFilterStateChange) {
      onFilterStateChange({
        searchQuery,
        statusFilter,
        countryFilter,
        formatFilter,
        currentPage,
        scrollPosition: typeof window !== 'undefined' ? window.scrollY : 0,
      });
    }
  }, [searchQuery, statusFilter, countryFilter, formatFilter, currentPage, onFilterStateChange]);

  const handleModuleClick = (moduleName: string) => {
    setComingSoonToast(`${moduleName} module is planned for a subsequent development step.`);
    setTimeout(() => {
      setComingSoonToast((current) => (current?.startsWith(moduleName) ? null : current));
    }, 3200);
  };

  // Determine if any filters are active
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    countryFilter !== 'all' ||
    formatFilter !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCountryFilter('all');
    setFormatFilter('all');
    setCurrentPage(1);
  };

  // Shared or default dataset collection
  const datasetsList = useMemo(() => {
    return datasets || ALL_ADMIN_DATASETS;
  }, [datasets]);

  // Dynamic Country / Region options derived from current records
  const availableLocations = useMemo(() => {
    return Array.from(new Set(datasetsList.map((d) => d.country))).sort();
  }, [datasetsList]);

  // Filtered dataset collection
  const filteredDatasets = useMemo(() => {
    return datasetsList.filter((item) => {
      // Title search (case-insensitive)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        if (!item.title.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // Country / Region filter
      if (countryFilter !== 'all' && item.country !== countryFilter) {
        return false;
      }

      // Format filter
      if (formatFilter !== 'all') {
        if (!item.formats.includes(formatFilter)) {
          return false;
        }
      }

      return true;
    });
  }, [datasetsList, searchQuery, statusFilter, countryFilter, formatFilter]);

  // Pagination calculation
  const totalItems = filteredDatasets.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentDatasets = filteredDatasets.slice(startIndex, endIndex);

  // Handlers that reset pagination
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: 'all' | 'Published' | 'Draft') => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleCountryChange = (val: string) => {
    setCountryFilter(val);
    setCurrentPage(1);
  };

  const handleFormatChange = (val: 'all' | 'CSV' | 'PDF') => {
    setFormatFilter(val);
    setCurrentPage(1);
  };

  const handlePreviewClick = (datasetId: string) => {
    const currentState: DatasetsFilterState = {
      searchQuery,
      statusFilter,
      countryFilter,
      formatFilter,
      currentPage: validCurrentPage,
      scrollPosition: typeof window !== 'undefined' ? window.scrollY : 0,
    };
    onPreviewDataset(datasetId, currentState);
  };

  const handleEditClick = (datasetId: string) => {
    const currentState: DatasetsFilterState = {
      searchQuery,
      statusFilter,
      countryFilter,
      formatFilter,
      currentPage: validCurrentPage,
      scrollPosition: typeof window !== 'undefined' ? window.scrollY : 0,
    };
    onEditDataset(datasetId, currentState);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans selection:bg-[#0A3D36]/10 selection:text-[#0A3D36]">
      {/* Screen Layout: Anchored Sidebar + Scrollable Main Content */}
      <div className="flex-1 flex w-full relative items-start">
        {/* Admin Navigation Sidebar */}
        <AdminSidebar
          activeTab="datasets"
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onNavigateDashboard={onNavigateDashboard}
          onNavigateDatasets={() => {}}
          onNavigateHome={onNavigateHome}
          onSignOut={onSignOut}
          onModuleClick={handleModuleClick}
        />

        {/* Main Workspace Column */}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen">
          {/* Header with Title, total record count badge, and oceanic green Add Dataset action */}
          <AdminHeader
            title="Datasets"
            badge={
              <span
                className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]"
                title="Total dataset records in catalogue"
              >
                {datasetsList.length}
              </span>
            }
            action={
              <button
                type="button"
                onClick={onNewDataset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-md transition-colors cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Dataset</span>
              </button>
            }
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          />

          {/* Status Feedback Toast */}
          {toastMessage && (
            <div
              role="status"
              aria-live="polite"
              className="bg-[#0A3D36] text-white text-xs py-2.5 px-4 text-center font-medium transition-all flex items-center justify-center gap-2"
            >
              <span>{toastMessage}</span>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="p-0.5 text-white/80 hover:text-white cursor-pointer"
                aria-label="Dismiss notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

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

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 max-w-[1536px] w-full mx-auto">
            {/* Search and Filters Toolbar (Compact Desktop Toolbar) */}
            <section
              aria-label="Dataset Filters"
              className="bg-white p-3.5 sm:p-4 rounded-md border border-[#E2E8F0] shadow-2xs"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search
                    className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search by dataset title..."
                    aria-label="Search by dataset title"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:bg-white focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange('')}
                      aria-label="Clear title search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#111827] p-0.5 rounded cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Dropdowns Row */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                  {/* Status Filter */}
                  <div className="flex-1 sm:flex-none min-w-[130px]">
                    <label htmlFor="filter-status" className="sr-only">
                      Filter by Status
                    </label>
                    <select
                      id="filter-status"
                      value={statusFilter}
                      onChange={(e) =>
                        handleStatusChange(e.target.value as 'all' | 'Published' | 'Draft')
                      }
                      className="w-full px-2.5 py-2 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#111827] focus:outline-none focus:bg-white focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] transition-colors cursor-pointer"
                    >
                      <option value="all">Status: All</option>
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>

                  {/* Country / Region Filter */}
                  <div className="flex-1 sm:flex-none min-w-[160px]">
                    <label htmlFor="filter-country" className="sr-only">
                      Filter by Country or Region
                    </label>
                    <select
                      id="filter-country"
                      value={countryFilter}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#111827] focus:outline-none focus:bg-white focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] transition-colors cursor-pointer"
                    >
                      <option value="all">Country / Region: All</option>
                      {availableLocations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Format Filter */}
                  <div className="flex-1 sm:flex-none min-w-[130px]">
                    <label htmlFor="filter-format" className="sr-only">
                      Filter by Format
                    </label>
                    <select
                      id="filter-format"
                      value={formatFilter}
                      onChange={(e) => handleFormatChange(e.target.value as 'all' | 'CSV' | 'PDF')}
                      className="w-full px-2.5 py-2 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#111827] focus:outline-none focus:bg-white focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] transition-colors cursor-pointer"
                    >
                      <option value="all">Format: All</option>
                      <option value="CSV">CSV</option>
                      <option value="PDF">PDF</option>
                    </select>
                  </div>

                  {/* Clear Filters Action (visible only when filters are active) */}
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium text-[#0A3D36] hover:text-[#072C27] hover:bg-[#F1F7F4] rounded-md transition-colors cursor-pointer shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Clear Filters</span>
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Dataset Table Card */}
            <section
              aria-label="Dataset Listings Table"
              className="bg-white rounded-md border border-[#E2E8F0] shadow-2xs overflow-hidden flex flex-col"
            >
              {filteredDatasets.length === 0 ? (
                /* Empty State */
                <div className="py-16 px-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-schoolbook font-bold text-lg text-[#111827] mb-1">
                    No datasets found
                  </h3>
                  <p className="text-sm text-[#64748B] max-w-sm mx-auto mb-4">
                    No dataset records match your current search criteria or active filters.
                  </p>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-md transition-colors cursor-pointer shadow-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Clear Filters</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Table with responsive horizontal scrolling container */}
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[820px]">
                      <thead>
                        <tr className="bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0]">
                          <th scope="col" className="py-3 px-4 w-[25%] font-semibold">
                            Dataset
                          </th>
                          <th scope="col" className="py-3 px-3 w-[15%] font-semibold">
                            Country / Region
                          </th>
                          <th scope="col" className="py-3 px-3 w-[13%] font-semibold">
                            Category
                          </th>
                          <th scope="col" className="py-3 px-3 w-[11%] font-semibold">
                            Format
                          </th>
                          <th scope="col" className="py-3 px-3 w-[11%] font-semibold">
                            Status
                          </th>
                          <th scope="col" className="py-3 px-3 w-[11%] font-semibold">
                            Updated
                          </th>
                          <th scope="col" className="py-3 px-4 w-[14%] text-right font-semibold">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {currentDatasets.map((dataset) => (
                          <tr
                            key={dataset.id}
                            className="hover:bg-[#F1F7F4]/60 even:bg-[#FAFCFB] transition-colors"
                          >
                            {/* Dataset Title: allows wrapping up to 2 lines without overlapping */}
                            <td className="py-3 px-4 font-medium text-[#111827] align-middle">
                              <span
                                className="line-clamp-2 leading-snug font-medium"
                                title={dataset.title}
                              >
                                {dataset.title}
                              </span>
                            </td>

                            {/* Country / Region */}
                            <td className="py-3 px-3 text-xs text-[#475569] align-middle whitespace-nowrap">
                              {dataset.country}
                            </td>

                            {/* Category */}
                            <td className="py-3 px-3 text-xs text-[#475569] align-middle whitespace-nowrap">
                              {dataset.category}
                            </td>

                            {/* Format: CSV and PDF only */}
                            <td className="py-3 px-3 text-xs align-middle">
                              <div className="flex items-center gap-1 flex-wrap">
                                {dataset.formats.map((fmt) => (
                                  <span
                                    key={fmt}
                                    className="font-mono text-[11px] font-medium bg-[#F1F5F9] px-1.5 py-0.5 rounded text-[#334155] border border-[#E2E8F0]"
                                  >
                                    {fmt}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* Status Badge */}
                            <td className="py-3 px-3 align-middle whitespace-nowrap">
                              {dataset.status === 'Published' ? (
                                <div className="flex flex-col gap-1 items-start">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0FDF4] text-[#0A3D36] border border-[#DCFCE7]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D36]" />
                                    Published
                                  </span>
                                  {dataset.hasPendingChanges && (
                                    <span
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]"
                                      title="Draft edits have been saved that are not yet published to the customer catalogue"
                                    >
                                      <span className="w-1 h-1 rounded-full bg-[#D97706]" />
                                      Unpublished changes
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
                                  Draft
                                </span>
                              )}
                            </td>

                            {/* Updated Date: "Not recorded" when unavailable in normal readable text */}
                            <td className="py-3 px-3 text-xs align-middle whitespace-nowrap">
                              {dataset.updated ? (
                                <span className="text-[#334155] font-mono text-[12px]">
                                  {dataset.updated}
                                </span>
                              ) : (
                                <span className="text-[#475569] font-normal text-xs sm:text-[13px]">
                                  Not recorded
                                </span>
                              )}
                            </td>

                            {/* Action: Clearly labelled Edit, Preview, and Unpublish actions */}
                            <td className="py-3 px-4 text-right align-middle whitespace-nowrap">
                              <div className="inline-flex items-center justify-end gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => handleEditClick(dataset.id)}
                                  className="inline-flex items-center gap-1 text-xs font-medium text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs py-1 px-1"
                                  title={`Edit ${dataset.title}`}
                                >
                                  <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handlePreviewClick(dataset.id)}
                                  className="inline-flex items-center gap-1 text-xs font-medium text-[#475569] hover:text-[#111827] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs py-1 px-1"
                                  title={`Preview ${dataset.title}`}
                                >
                                  <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                                  <span>Preview</span>
                                </button>
                                {dataset.status === 'Published' && (
                                  <button
                                    type="button"
                                    onClick={() => setDatasetToUnpublish(dataset)}
                                    className="inline-flex items-center gap-1 text-xs font-medium text-[#64748B] hover:text-[#DC2626] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626] rounded-xs py-1 px-1"
                                    title={`Unpublish ${dataset.title} from customer catalogue`}
                                  >
                                    <span>Unpublish</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
                    {/* Range and total counter */}
                    <div>
                      Showing{' '}
                      <span className="font-semibold text-[#111827]">
                        {totalItems === 0 ? 0 : startIndex + 1}
                      </span>
                      –
                      <span className="font-semibold text-[#111827]">
                        {endIndex}
                      </span>{' '}
                      of <span className="font-semibold text-[#111827]">{totalItems}</span>{' '}
                      {totalItems === 1 ? 'dataset' : 'datasets'}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                          disabled={validCurrentPage <= 1}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Previous</span>
                        </button>
                        <span className="px-2 font-mono text-[11px] text-[#475569]">
                          {validCurrentPage} of {totalPages}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                          disabled={validCurrentPage >= totalPages}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          aria-label="Next page"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </section>
          </main>

          {/* Compact Admin Footer */}
          <AdminFooter />
        </div>
      </div>

      {/* Unpublish Confirmation Modal */}
      {datasetToUnpublish && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="unpublish-table-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs"
        >
          <div className="bg-white rounded-md border border-[#E2E8F0] shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3
                  id="unpublish-table-modal-title"
                  className="font-schoolbook font-bold text-lg text-[#111827]"
                >
                  Unpublish Dataset
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1 font-medium">
                  {datasetToUnpublish.title}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#334155] leading-relaxed">
              Remove this dataset from the customer catalogue? Its information and files will remain available in Admin.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDatasetToUnpublish(null)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-[#111827] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onUnpublishDataset) {
                    onUnpublishDataset(datasetToUnpublish.id);
                  }
                  setDatasetToUnpublish(null);
                  setToastMessage('Unpublished in preview.');
                  setTimeout(() => {
                    setToastMessage((prev) =>
                      prev === 'Unpublished in preview.' ? null : prev
                    );
                  }, 4500);
                }}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-md transition-colors cursor-pointer shadow-xs"
              >
                Unpublish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
