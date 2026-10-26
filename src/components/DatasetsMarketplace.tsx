import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  DatasetItem,
  FILTER_LOCATIONS,
  FILTER_CATEGORIES,
  FILTER_FORMATS,
} from '../data/datasets';

export type SortOption = 'relevance' | 'title-asc' | 'title-desc';

export interface MarketplaceSavedState {
  searchInput: string;
  activeSearch: string;
  selectedLocations: string[];
  selectedCategories: string[];
  selectedFormats: string[];
  sortBy: SortOption;
  currentPage: number;
  scrollY: number;
}

export interface DatasetsMarketplaceProps {
  datasets: DatasetItem[];
  initialSearchQuery?: string;
  initialCategory?: string | null;
  savedState?: MarketplaceSavedState | null;
  onSelectDataset: (dataset: DatasetItem, state: MarketplaceSavedState) => void;
  onNavigateHome: () => void;
}

const PAGE_SIZE = 6;

export const DatasetsMarketplace: React.FC<DatasetsMarketplaceProps> = ({
  datasets,
  initialSearchQuery = '',
  initialCategory = null,
  savedState = null,
  onSelectDataset,
  onNavigateHome,
}) => {
  // Search state
  const [searchInput, setSearchInput] = useState(
    savedState ? savedState.searchInput : initialSearchQuery
  );
  const [activeSearch, setActiveSearch] = useState(
    savedState ? savedState.activeSearch : initialSearchQuery
  );

  // Sort state
  const [sortBy, setSortBy] = useState<SortOption>(
    savedState ? savedState.sortBy : 'relevance'
  );

  // Filters state
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    savedState ? savedState.selectedLocations : []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    savedState
      ? savedState.selectedCategories
      : initialCategory
      ? [initialCategory]
      : []
  );
  const [selectedFormats, setSelectedFormats] = useState<string[]>(
    savedState ? savedState.selectedFormats : []
  );

  // Collapsible sidebar groups
  const [openGroups, setOpenGroups] = useState({
    location: true,
    category: true,
    format: true,
  });

  // Mobile filter drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(
    savedState ? savedState.currentPage : 1
  );

  // Restore scroll position when returning from dataset details
  useEffect(() => {
    if (savedState && typeof savedState.scrollY === 'number' && savedState.scrollY > 0) {
      window.scrollTo({ top: savedState.scrollY, behavior: 'instant' });
    }
  }, [savedState]);

  // Sync initial props if changed and no savedState
  useEffect(() => {
    if (!savedState && initialSearchQuery) {
      setSearchInput(initialSearchQuery);
      setActiveSearch(initialSearchQuery);
    }
  }, [initialSearchQuery, savedState]);

  useEffect(() => {
    if (!savedState && initialCategory) {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory, savedState]);

  // Handle escape key for mobile filter drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileFilterOpen) {
        setMobileFilterOpen(false);
        filterButtonRef.current?.focus();
      }
    };
    if (mobileFilterOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileFilterOpen]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchInput.trim());
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setActiveSearch('');
    setCurrentPage(1);
  };

  // Toggle helpers
  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    );
    setCurrentPage(1);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const toggleFormat = (format: string) => {
    setSelectedFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setSelectedLocations([]);
    setSelectedCategories([]);
    setSelectedFormats([]);
    setCurrentPage(1);
  };

  const handleResetSearchAndFilters = () => {
    setSearchInput('');
    setActiveSearch('');
    setSelectedLocations([]);
    setSelectedCategories([]);
    setSelectedFormats([]);
    setSortBy('relevance');
    setCurrentPage(1);
  };

  const handleViewDataset = (dataset: DatasetItem) => {
    const currentState: MarketplaceSavedState = {
      searchInput,
      activeSearch,
      selectedLocations,
      selectedCategories,
      selectedFormats,
      sortBy,
      currentPage,
      scrollY: window.scrollY || window.pageYOffset || 0,
    };
    onSelectDataset(dataset, currentState);
  };

  const totalActiveFiltersCount =
    selectedLocations.length + selectedCategories.length + selectedFormats.length;

  // Filter and Sort Logic
  const filteredAndSortedDatasets = useMemo(() => {
    return datasets
      .filter((item) => {
        // Search matching
        if (activeSearch) {
          const query = activeSearch.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchDesc = item.description.toLowerCase().includes(query);
          const matchCat = item.category.toLowerCase().includes(query);
          const matchLoc = item.location.toLowerCase().includes(query);
          const matchCoverage = item.coverage.toLowerCase().includes(query);
          const matchTopics = item.topics.some((t) => t.toLowerCase().includes(query));

          if (!matchTitle && !matchDesc && !matchCat && !matchLoc && !matchCoverage && !matchTopics) {
            return false;
          }
        }

        // Location filter (OR logic within location group)
        if (selectedLocations.length > 0) {
          const matchLocation = selectedLocations.some((loc) => {
            return (
              item.location.toLowerCase() === loc.toLowerCase() ||
              item.coverage.toLowerCase().includes(loc.toLowerCase()) ||
              item.topics.some((t) => t.toLowerCase() === loc.toLowerCase())
            );
          });
          if (!matchLocation) return false;
        }

        // Category filter (OR logic within category group)
        if (selectedCategories.length > 0) {
          const matchCategory = selectedCategories.some((cat) => {
            return (
              item.category.toLowerCase() === cat.toLowerCase() ||
              item.topics.some((t) => t.toLowerCase() === cat.toLowerCase())
            );
          });
          if (!matchCategory) return false;
        }

        // Format filter (OR logic within format group)
        if (selectedFormats.length > 0) {
          const matchFormat = selectedFormats.some((fmt) => {
            return item.formats.some((f) => f.toUpperCase() === fmt.toUpperCase());
          });
          if (!matchFormat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'title-desc') {
          return b.title.localeCompare(a.title);
        }
        // Relevance: maintain catalog order
        return 0;
      });
  }, [datasets, activeSearch, selectedLocations, selectedCategories, selectedFormats, sortBy]);

  // Pagination calculation
  const totalItems = filteredAndSortedDatasets.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const currentDatasets = filteredAndSortedDatasets.slice(startIndex, endIndex);

  return (
    <div className="w-full bg-white min-h-[70vh] py-8 md:py-12">
      <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto">
        {/* PAGE HEADER: Breadcrumb + Compact Heading (Gap reduced to ~24px) */}
        <div className="mb-6">
          <nav aria-label="Breadcrumb" className="text-xs text-[#525B66] mb-2 font-medium">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-[#0A3D36] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
            >
              Home
            </button>
            <span className="mx-2 text-[#94A3B8]" aria-hidden="true">
              /
            </span>
            <span className="text-[#111827] font-semibold">Datasets</span>
          </nav>

          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#111827]">
            Explore Datasets
          </h1>
        </div>

        {/* SEARCH AND SORT BAR (Approximately 24px below heading) */}
        <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Wide Search Field */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 flex flex-col sm:flex-row items-stretch gap-2 p-1.5 sm:p-2 bg-white border border-[#CBD5E1] rounded-md focus-within:border-[#0A3D36] focus-within:ring-1 focus-within:ring-[#0A3D36] transition-all"
            role="search"
          >
            <div className="relative flex-1 flex items-center pl-3">
              <Search className="w-5 h-5 text-[#64748B] shrink-0" aria-hidden="true" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search datasets by topic, country or industry"
                className="w-full pl-3 pr-8 py-2 text-sm sm:text-base text-[#111827] placeholder-[#64748B] bg-transparent border-0 focus:outline-none"
                aria-label="Search datasets by topic, country or industry"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 p-1 text-[#64748B] hover:text-[#111827] cursor-pointer"
                  aria-label="Clear search input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-sm transition-colors whitespace-nowrap cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
            >
              Search
            </button>
          </form>

          {/* Sort Dropdown & Mobile Filter Button */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            {/* Mobile Filters Trigger */}
            <button
              ref={filterButtonRef}
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#111827] bg-[#F8FAFC] border border-[#CBD5E1] rounded-sm transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#0A3D36]" />
              <span>Filters</span>
              {totalActiveFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#0A3D36] text-white text-xs flex items-center justify-center font-mono">
                  {totalActiveFiltersCount}
                </span>
              )}
            </button>

            {/* Labelled Sort Dropdown */}
            <div className="flex items-center gap-2 text-sm">
              <label htmlFor="sort-select" className="text-xs uppercase tracking-wider text-[#64748B] font-semibold whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-sm text-[#111827] bg-white border border-[#CBD5E1] rounded-sm focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] outline-none cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="title-asc">Title A–Z</option>
                <option value="title-desc">Title Z–A</option>
              </select>
            </div>
          </div>
        </div>

        {/* MAIN BODY: 240px Filter Sidebar + Results Grid */}
        <div className="flex items-start gap-8 lg:gap-10">
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="w-[240px] shrink-0 hidden md:block" aria-label="Filters">
            {/* Filters heading with always-visible Clear All beside it (disabled when 0 filters) */}
            <div className="flex items-center gap-2.5 mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#111827]">
                Filters
              </h2>
              <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
              <button
                type="button"
                onClick={handleClearAllFilters}
                disabled={totalActiveFiltersCount === 0}
                className={`text-xs font-medium transition-colors ${
                  totalActiveFiltersCount > 0
                    ? 'text-[#0A3D36] hover:underline cursor-pointer'
                    : 'text-[#94A3B8] cursor-not-allowed opacity-60'
                }`}
                aria-label="Clear all selected filters"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-5">
              {/* Country or Region */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenGroups((prev) => ({ ...prev, location: !prev.location }))
                  }
                  className="w-full flex items-center justify-between py-1.5 text-xs font-semibold uppercase tracking-wider text-[#475569] hover:text-[#111827] cursor-pointer"
                  aria-expanded={openGroups.location}
                >
                  <span>Country or Region</span>
                  {openGroups.location ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {openGroups.location && (
                  <div className="pt-2 pl-0.5 space-y-1.5 text-sm text-[#334155]">
                    {FILTER_LOCATIONS.map((loc) => {
                      const checked = selectedLocations.includes(loc);
                      return (
                        <label
                          key={loc}
                          className="flex items-center gap-2.5 py-1 text-sm text-[#334155] hover:text-[#111827] cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleLocation(loc)}
                            className="w-4 h-4 rounded-xs border-[#CBD5E1] text-[#0A3D36] focus:ring-[#0A3D36] accent-[#0A3D36] cursor-pointer"
                          />
                          <span>{loc}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenGroups((prev) => ({ ...prev, category: !prev.category }))
                  }
                  className="w-full flex items-center justify-between py-1.5 text-xs font-semibold uppercase tracking-wider text-[#475569] hover:text-[#111827] cursor-pointer"
                  aria-expanded={openGroups.category}
                >
                  <span>Category</span>
                  {openGroups.category ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {openGroups.category && (
                  <div className="pt-2 pl-0.5 space-y-1.5 text-sm text-[#334155]">
                    {FILTER_CATEGORIES.map((cat) => {
                      const checked = selectedCategories.includes(cat);
                      return (
                        <label
                          key={cat}
                          className="flex items-center gap-2.5 py-1 text-sm text-[#334155] hover:text-[#111827] cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCategory(cat)}
                            className="w-4 h-4 rounded-xs border-[#CBD5E1] text-[#0A3D36] focus:ring-[#0A3D36] accent-[#0A3D36] cursor-pointer"
                          />
                          <span>{cat}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* File Format: Rendered with body font at ~13-14px and readable text color */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenGroups((prev) => ({ ...prev, format: !prev.format }))
                  }
                  className="w-full flex items-center justify-between py-1.5 text-xs font-semibold uppercase tracking-wider text-[#475569] hover:text-[#111827] cursor-pointer"
                  aria-expanded={openGroups.format}
                >
                  <span>File Format</span>
                  {openGroups.format ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {openGroups.format && (
                  <div className="pt-2 pl-0.5 space-y-1.5">
                    {FILTER_FORMATS.map((fmt) => {
                      const checked = selectedFormats.includes(fmt);
                      return (
                        <label
                          key={fmt}
                          className="flex items-center gap-2.5 py-1 text-[13px] md:text-sm font-sans text-[#334155] hover:text-[#111827] cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleFormat(fmt)}
                            className="w-4 h-4 rounded-xs border-[#CBD5E1] text-[#0A3D36] focus:ring-[#0A3D36] accent-[#0A3D36] cursor-pointer"
                          />
                          <span className="font-sans font-medium text-[13px] md:text-sm text-[#334155]">
                            {fmt}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* RESULTS AREA */}
          <div className="flex-1 min-w-0">
            {/* Results Meta Row: Illustrative catalogue tag + result count */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5 text-xs text-[#525B66]">
                <span className="italic">Illustrative catalogue</span>
                <span aria-hidden="true" className="text-[#94A3B8]">
                  ·
                </span>
                <span className="font-medium text-[#111827]">
                  {totalItems === 1 ? '1 dataset found' : `${totalItems} datasets found`}
                </span>
                {totalItems > 0 && (
                  <span className="text-[#64748B] hidden sm:inline">
                    (Showing {startIndex + 1}–{endIndex} of {totalItems})
                  </span>
                )}
              </div>

              {/* Clear Search affordance if search is active */}
              {activeSearch && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-xs text-[#0A3D36] hover:underline font-medium cursor-pointer"
                >
                  Clear search query “{activeSearch}”
                </button>
              )}
            </div>

            {/* Removable Chips for Active Filters */}
            {totalActiveFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6" aria-label="Active filters">
                <span className="text-xs text-[#64748B] font-medium mr-1">Active filters:</span>

                {selectedLocations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#1E3A34] bg-[#F1F7F4] border border-[#CBDCD4] rounded-sm font-medium"
                  >
                    <span>{loc}</span>
                    <button
                      type="button"
                      onClick={() => toggleLocation(loc)}
                      className="p-0.5 hover:text-[#0A3D36] cursor-pointer"
                      aria-label={`Remove ${loc} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#1E3A34] bg-[#F1F7F4] border border-[#CBDCD4] rounded-sm font-medium"
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className="p-0.5 hover:text-[#0A3D36] cursor-pointer"
                      aria-label={`Remove ${cat} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {selectedFormats.map((fmt) => (
                  <span
                    key={fmt}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans text-[#1E3A34] bg-[#F1F7F4] border border-[#CBDCD4] rounded-sm font-medium"
                  >
                    <span>{fmt}</span>
                    <button
                      type="button"
                      onClick={() => toggleFormat(fmt)}
                      className="p-0.5 hover:text-[#0A3D36] cursor-pointer"
                      aria-label={`Remove ${fmt} format filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="text-xs text-[#0A3D36] hover:underline font-medium ml-1 cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Results Grid or Empty State */}
            {currentDatasets.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-[#CBD5E1] rounded-md bg-[#F8FAFC] p-8">
                <p className="font-editorial text-2xl text-[#111827] font-medium mb-2">
                  No datasets match your search
                </p>
                <p className="text-sm text-[#4B5563] leading-relaxed max-w-md mx-auto mb-6">
                  Try adjusting or removing some of your selected filters or clearing the search query.
                </p>
                <button
                  type="button"
                  onClick={handleResetSearchAndFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-sm transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Search and Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
                {currentDatasets.map((dataset) => (
                  <article
                    key={dataset.id}
                    className="flex flex-col justify-between p-5 md:p-6 bg-[#F9FBFA] hover:bg-[#F2F8F5] border border-[#E2E8F0]/80 rounded-md transition-colors group"
                  >
                    <div>
                      {/* Short category label and location */}
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0A3D36] mb-2 font-sans">
                        <span>{dataset.category}</span>
                        <span className="text-[#94A3B8]" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-[#525B66] font-normal capitalize">
                          {dataset.location}
                        </span>
                      </div>

                      {/* Dataset title */}
                      <h3 className="font-editorial text-xl sm:text-2xl text-[#111827] font-medium tracking-tight mb-2.5 group-hover:text-[#0A3D36] transition-colors leading-snug">
                        {dataset.title}
                      </h3>

                      {/* One concise descriptive sentence */}
                      <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
                        {dataset.description}
                      </p>
                    </div>

                    {/* Available example formats & View Dataset action (without decorative horizontal divider) */}
                    <div className="pt-2 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-[#1E293B] text-[13px] md:text-sm">Formats:</span>
                        <span className="font-sans text-[13px] md:text-sm font-medium text-[#334155]">
                          {dataset.formats.join(' · ')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleViewDataset(dataset)}
                        className="inline-flex items-center gap-1.5 text-xs md:text-[13px] font-semibold text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                        aria-label={`View details for ${dataset.title}`}
                      >
                        <span>View Dataset</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* FUNCTIONAL PAGINATION (Gap reduced to ~24–32px, range left, controls right) */}
            {totalPages > 1 && (
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs md:text-[13px] text-[#475569] font-medium text-left">
                  Showing {startIndex + 1}–{endIndex} of {totalItems} datasets
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#111827] bg-white border border-[#CBD5E1] rounded-sm hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className={`min-w-8 h-8 px-2 text-xs font-medium rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] ${
                        currentPage === pageNum
                          ? 'bg-[#0A3D36] text-white font-semibold'
                          : 'bg-white text-[#111827] border border-[#CBD5E1] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#111827] bg-white border border-[#CBD5E1] rounded-sm hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden md:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-filters-title"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white shadow-xl flex flex-col justify-between">
              {/* Drawer Header with Clear All beside Filters heading */}
              <div className="px-5 py-4 border-b border-[#E5E9E7] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <h2
                    id="mobile-filters-title"
                    className="font-editorial text-xl font-medium text-[#111827]"
                  >
                    Filters
                  </h2>
                  <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    disabled={totalActiveFiltersCount === 0}
                    className={`text-xs font-medium transition-colors ${
                      totalActiveFiltersCount > 0
                        ? 'text-[#0A3D36] hover:underline cursor-pointer'
                        : 'text-[#94A3B8] cursor-not-allowed opacity-60'
                    }`}
                  >
                    Clear All
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-[#64748B] hover:text-[#111827] rounded-md transition-colors cursor-pointer"
                  aria-label="Close filters drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
                {/* Location Group */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2.5">
                    Country or Region
                  </h3>
                  <div className="space-y-2">
                    {FILTER_LOCATIONS.map((loc) => {
                      const checked = selectedLocations.includes(loc);
                      return (
                        <label
                          key={loc}
                          className="flex items-center gap-2.5 py-1 text-sm text-[#334155] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleLocation(loc)}
                            className="w-4 h-4 rounded-xs text-[#0A3D36] accent-[#0A3D36]"
                          />
                          <span>{loc}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Category Group */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2.5">
                    Category
                  </h3>
                  <div className="space-y-2">
                    {FILTER_CATEGORIES.map((cat) => {
                      const checked = selectedCategories.includes(cat);
                      return (
                        <label
                          key={cat}
                          className="flex items-center gap-2.5 py-1 text-sm text-[#334155] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCategory(cat)}
                            className="w-4 h-4 rounded-xs text-[#0A3D36] accent-[#0A3D36]"
                          />
                          <span>{cat}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Format Group: Body font at ~13-14px */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2.5">
                    File Format
                  </h3>
                  <div className="space-y-2">
                    {FILTER_FORMATS.map((fmt) => {
                      const checked = selectedFormats.includes(fmt);
                      return (
                        <label
                          key={fmt}
                          className="flex items-center gap-2.5 py-1 text-[13px] md:text-sm font-sans text-[#334155] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleFormat(fmt)}
                            className="w-4 h-4 rounded-xs text-[#0A3D36] accent-[#0A3D36]"
                          />
                          <span className="font-sans font-medium text-[13px] md:text-sm text-[#334155]">
                            {fmt}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-[#E5E9E7] bg-[#FAFAFA] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  disabled={totalActiveFiltersCount === 0}
                  className={`px-3.5 py-2 text-xs font-medium transition-colors ${
                    totalActiveFiltersCount > 0
                      ? 'text-[#4B5563] hover:text-[#111827] cursor-pointer'
                      : 'text-[#94A3B8] cursor-not-allowed opacity-60'
                  }`}
                >
                  Clear All
                </button>

                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#0A3D36] hover:bg-[#072C27] rounded-sm transition-colors cursor-pointer"
                >
                  Apply Filters {totalActiveFiltersCount > 0 ? `(${totalActiveFiltersCount})` : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
