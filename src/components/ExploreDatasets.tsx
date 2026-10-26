import React from 'react';
import { ArrowRight, FilterX } from 'lucide-react';
import { DatasetItem } from '../data/datasets';

interface ExploreDatasetsProps {
  datasets: DatasetItem[];
  allCount: number;
  selectedTopic: string | null;
  searchQuery: string;
  onClearFilter: () => void;
  onSelectDataset: (dataset: DatasetItem) => void;
  onBrowseAll: () => void;
}

export const ExploreDatasets: React.FC<ExploreDatasetsProps> = ({
  datasets,
  allCount,
  selectedTopic,
  searchQuery,
  onClearFilter,
  onSelectDataset,
  onBrowseAll,
}) => {
  const isFiltered = Boolean(selectedTopic || (searchQuery && searchQuery.trim() !== ''));

  return (
    <section
      id="explore-datasets"
      className="w-full bg-white pt-14 md:pt-16 pb-12 md:pb-14 scroll-mt-24"
    >
      <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto">
        {/* Section Header: Heading + relocated Browse All Datasets button on the right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xs font-semibold tracking-wider text-[#0A3D36] uppercase font-sans">
                Catalogue
              </span>
              <span className="text-xs text-[#94A3B8]" aria-hidden="true">
                /
              </span>
              {/* Mandatory Illustrative catalogue disclaimer */}
              <span className="text-xs md:text-[13px] text-[#525B66] italic">
                Illustrative catalogue
              </span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl text-[#111827] font-medium tracking-tight">
              Find the data your work needs.
            </h2>
          </div>

          {/* Right side: Relocated Browse All Datasets button aligned with main heading on desktop, below on mobile */}
          <div className="flex items-center gap-3 shrink-0 pt-1 sm:pt-0">
            {isFiltered && (
              <button
                type="button"
                onClick={onClearFilter}
                className="inline-flex items-center gap-1.5 text-xs md:text-[13px] text-[#0A3D36] hover:underline font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs mr-1"
              >
                <FilterX className="w-3.5 h-3.5" />
                Reset filters
              </button>
            )}

            <button
              type="button"
              onClick={onBrowseAll}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 text-sm font-medium text-[#111827] hover:text-[#0A3D36] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
            >
              <span>Browse All Datasets</span>
              <ArrowRight className="w-4 h-4 text-[#0A3D36]" />
            </button>
          </div>
        </div>

        {/* Simplified Dataset Listings: Clean 2-column desktop layout separated by generous whitespace */}
        {datasets.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-[#CBD5E1] rounded-md bg-[#F8FAFC]">
            <p className="text-sm md:text-base text-[#475569] mb-3">
              No illustrative datasets match your current search query{' '}
              {searchQuery ? `"${searchQuery}"` : ''}{' '}
              {selectedTopic ? `in topic "${selectedTopic}"` : ''}.
            </p>
            <button
              type="button"
              onClick={onClearFilter}
              className="text-sm font-medium text-[#0A3D36] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
            >
              Reset filters and view all catalogue entries
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-12 gap-y-6 md:gap-y-8">
            {datasets.map((dataset) => (
              <article
                key={dataset.id}
                className="flex flex-col justify-between py-4 md:py-5 transition-colors group"
              >
                <div>
                  {/* Short Country or Region Label */}
                  <span className="text-[13px] md:text-sm font-medium text-[#525B66] block mb-1.5">
                    {dataset.location}
                  </span>

                  {/* Prominent Dataset Title */}
                  <h3 className="font-editorial text-2xl text-[#111827] font-medium tracking-tight mb-3 group-hover:text-[#0A3D36] transition-colors leading-snug">
                    {dataset.title}
                  </h3>
                </div>

                {/* View Dataset Action with small arrow */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onSelectDataset(dataset)}
                    className="inline-flex items-center gap-1.5 text-xs md:text-[13px] font-semibold text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
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
      </div>
    </section>
  );
};
