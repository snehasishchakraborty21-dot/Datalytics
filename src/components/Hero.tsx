import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { TOPIC_SUGGESTIONS } from '../data/datasets';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  selectedTopic: string | null;
  onTopicSelect: (topic: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedTopic,
  onTopicSelect,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchQuery);
  };

  /**
   * PHOTO ASSET ATTRIBUTION & SOURCE REFERENCE:
   * Subject: Commercial trade logistics and intermodal transport infrastructure
   * Caption: Trade and infrastructure (neutral verified caption)
   * License/Usage: Editorial documentary infrastructure reference asset
   */
  const heroImageUrl =
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1400&q=80';

  return (
    <section className="relative w-full bg-white overflow-hidden">
      <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Column: 50% width on desktop */}
          <div className="flex flex-col justify-center">
            {/* Introductory Label: Clean unboxed typographic kicker */}
            <div className="mb-3.5">
              <span className="text-xs font-semibold tracking-wider text-[#0A3D36] uppercase font-sans">
                African Data and Intelligence
              </span>
            </div>

            {/* Main Heading: Refined serif */}
            <h1 className="font-editorial text-[38px] sm:text-[46px] md:text-[52px] lg:text-[56px] leading-[1.08] font-medium tracking-tight text-[#111827] text-balance mb-5">
              Better decisions begin with better data.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg md:text-xl text-[#4B5563] leading-relaxed max-w-2xl mb-7 sm:mb-9">
              Discover African datasets, access specialist research and find data
              services for your next decision.
            </p>

            {/* Prominent Dataset Search Field */}
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-2xl mb-4.5"
              role="search"
            >
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 sm:p-2 bg-white border border-[#CBD5E1] rounded-md focus-within:border-[#0A3D36] focus-within:ring-1 focus-within:ring-[#0A3D36] transition-all shadow-xs">
                <div className="relative flex-1 flex items-center pl-3">
                  <Search
                    className="w-5 h-5 text-[#64748B] shrink-0"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search datasets by topic, country or industry"
                    className="w-full pl-3 pr-2 py-2 text-sm sm:text-base text-[#111827] placeholder-[#64748B] bg-transparent border-0 focus:outline-none"
                    aria-label="Search datasets by topic, country or industry"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-3 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-sm transition-colors whitespace-nowrap cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
                >
                  Search Datasets
                </button>
              </div>
            </form>

            {/* Understated Clickable Topic Suggestions (No garish pills) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#4B5563]">
              <span className="text-xs uppercase tracking-wide text-[#64748B] font-medium">
                Topics:
              </span>
              {TOPIC_SUGGESTIONS.map((topic) => {
                const isSelected = selectedTopic === topic;
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => onTopicSelect(topic)}
                    className={`inline-flex items-center text-sm transition-colors cursor-pointer py-0.5 border-b focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs ${
                      isSelected
                        ? 'text-[#0A3D36] font-semibold border-[#0A3D36]'
                        : 'text-[#4B5563] hover:text-[#111827] border-transparent hover:border-[#94A3B8]'
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
              {selectedTopic && (
                <button
                  type="button"
                  onClick={() => onTopicSelect('')}
                  className="text-xs text-[#0A3D36] hover:underline ml-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>

          {/* Right Column: 50% width on desktop */}
          <div className="w-full">
            <figure className="w-full flex flex-col m-0">
              <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[390px] overflow-hidden rounded-md border border-[#E2E8F0] bg-[#F8FAFC]">
                {/* Fallback architectural/infrastructural vector background when image loading or if network fails */}
                <div
                  className={`absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-br from-[#F1F7F4] via-[#E8F3EE] to-[#E2ECE7] text-[#1E3A34] transition-opacity duration-300 ${
                    imageLoaded && !imageError ? 'opacity-0' : 'opacity-100'
                  }`}
                  aria-hidden={imageLoaded && !imageError ? 'true' : 'false'}
                >
                  <div className="flex items-center justify-between pb-2">
                    <div className="text-xs font-semibold tracking-wider uppercase text-[#0A3D36]">
                      Infrastructure &amp; Commerce
                    </div>
                    <div className="text-xs text-[#4A645E]">
                      Freight &amp; Logistics
                    </div>
                  </div>

                  <div className="my-auto space-y-4">
                    <svg
                      viewBox="0 0 400 220"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-auto text-[#0A3D36]/20 stroke-current"
                    >
                      <path
                        d="M20 180H380M60 180V90L130 50L200 90V180M130 50V180"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M220 180V120H340V180M240 140H270M290 140H320M240 160H270M290 160H320"
                        strokeWidth="1.5"
                      />
                      <circle cx="95" cy="115" r="4" fill="currentColor" />
                      <circle cx="165" cy="115" r="4" fill="currentColor" />
                      <path
                        d="M40 200L360 200"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    </svg>
                    <p className="text-xs text-[#3E5B54] text-center font-sans">
                      Trade and infrastructure
                    </p>
                  </div>

                  <div className="text-[11px] text-[#5C756F] pt-2">
                    Trade and infrastructure
                  </div>
                </div>

                {/* Realistic documentary photograph */}
                {!imageError && (
                  <img
                    src={heroImageUrl}
                    alt="Trade and infrastructure"
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                      setImageError(true);
                    }}
                  />
                )}
              </div>

              {/* Neutral caption as requested */}
              <figcaption className="mt-2 text-right">
                <span className="text-[12px] text-[#64748B]">
                  Trade and infrastructure
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};
