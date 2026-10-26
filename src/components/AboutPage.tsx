import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface AboutPageProps {
  onNavigateHome: () => void;
  onExploreDatasets: () => void;
  onNavigateConsulting: () => void;
}

const AUDIENCE_GROUPS = [
  'Businesses and Entrepreneurs',
  'Researchers and Universities',
  'Government and Public Institutions',
  'Investors and Financial Institutions',
  'Development Organizations',
  'Independent Professionals',
];

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateHome,
  onExploreDatasets,
  onNavigateConsulting,
}) => {
  const [heroImgLoaded, setHeroImgLoaded] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);

  const [platformImgLoaded, setPlatformImgLoaded] = useState(false);
  const [platformImgError, setPlatformImgError] = useState(false);

  const [approachImgLoaded, setApproachImgLoaded] = useState(false);
  const [approachImgError, setApproachImgError] = useState(false);

  return (
    <div className="w-full bg-white pt-8 md:pt-12 pb-8 md:pb-12">
      <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto">
        {/* 1. HERO SECTION & BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="text-xs text-[#525B66] mb-6 font-medium">
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
          <span className="text-[#111827] font-semibold">About</span>
        </nav>

        <section aria-labelledby="about-hero-heading" className="mb-14 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Heading, Description, Action */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <h1
                id="about-hero-heading"
                className="font-editorial text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#111827] leading-[1.14] mb-4"
              >
                Making African data easier to access and use.
              </h1>

              <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl mb-7">
                Datalytics brings dataset discovery, research support and data storage enquiries into one platform.
              </p>

              <div>
                <button
                  type="button"
                  onClick={onExploreDatasets}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
                >
                  <span>Explore Datasets</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Large authentic photograph of African urban development / commercial infrastructure */}
            <div className="lg:col-span-6 w-full">
              <figure className="w-full flex flex-col m-0">
                <div className="relative w-full h-[220px] sm:h-[260px] md:h-[340px] lg:h-[390px] bg-[#F4F6F5] rounded-md overflow-hidden border border-[#E2E8F0]/80 shadow-xs">
                  {(!heroImgLoaded || heroImgError) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#F1F6F3]">
                      <div className="w-12 h-12 rounded-full bg-[#E0ECE6] flex items-center justify-center mb-2.5 text-[#0A3D36]">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#0A3D36] font-sans mb-1">
                        Commercial Infrastructure
                      </span>
                      <p className="text-xs text-[#525B66] max-w-xs font-sans">
                        African urban business district and regional economic hub
                      </p>
                    </div>
                  )}

                  {!heroImgError && (
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Nairobi%27s_Central_Business_District_Landmark_Skyscrapers..jpg/1280px-Nairobi%27s_Central_Business_District_Landmark_Skyscrapers..jpg"
                      alt="Nairobi Central Business District skyline with commercial office towers and urban infrastructure"
                      loading="eager"
                      referrerPolicy="no-referrer"
                      onLoad={() => setHeroImgLoaded(true)}
                      onError={() => setHeroImgError(true)}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${heroImgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                  )}
                </div>
                <p className="mt-1.5 text-[11px] text-[#64748B] font-sans px-0.5">
                  Photo: Tall Black (CC BY-SA 4.0 via Wikimedia Commons)
                </p>
              </figure>
            </div>
          </div>
        </section>

        {/* 2. ABOUT DATALYTICS: Section 1 - Left Image, Right Text */}
        <section aria-labelledby="about-datalytics-heading" className="w-full mb-14 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Left: Large authentic photograph related to African business, research or data use */}
            <div className="w-full order-1 lg:order-1">
              <figure className="w-full flex flex-col m-0">
                <div className="relative w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[360px] bg-[#F4F6F5] rounded-md overflow-hidden border border-[#E2E8F0]/80 shadow-xs">
                  {(!platformImgLoaded || platformImgError) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#F1F6F3]">
                      <div className="w-12 h-12 rounded-full bg-[#E0ECE6] flex items-center justify-center mb-2.5 text-[#0A3D36]">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.25 2.25L15 6.75" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#0A3D36] font-sans mb-1">
                        Data Science &amp; Research
                      </span>
                      <p className="text-xs text-[#525B66] max-w-xs font-sans">
                        Computational social science and data research practitioners in Africa
                      </p>
                    </div>
                  )}

                  {!platformImgError && (
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/The_2026_Summer_Institutes_in_Computational_Social_Science_%28SICSS%29_Kenya.jpg/1280px-The_2026_Summer_Institutes_in_Computational_Social_Science_%28SICSS%29_Kenya.jpg"
                      alt="Researchers and data practitioners collaborating during a computational science workshop in Africa"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onLoad={() => setPlatformImgLoaded(true)}
                      onError={() => setPlatformImgError(true)}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${platformImgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                  )}
                </div>
                <p className="mt-1.5 text-[11px] text-[#64748B] font-sans px-0.5">
                  Photo: Queen Asali (CC BY-SA 4.0 via Wikimedia Commons)
                </p>
              </figure>
            </div>

            {/* Right: Heading followed by both existing paragraphs stacked naturally */}
            <div className="flex flex-col justify-center order-2 lg:order-2">
              <h2
                id="about-datalytics-heading"
                className="font-editorial text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#111827] mb-5 md:mb-6"
              >
                A platform built around better access to data.
              </h2>

              <div className="space-y-4 text-base sm:text-lg text-[#475569] leading-relaxed">
                <p>
                  Datalytics is being developed to help businesses, researchers, investors, public institutions and development organizations discover data relevant to their work.
                </p>
                <p>
                  The platform combines a searchable dataset marketplace with channels for requesting specialist research, analysis and data storage services.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PURPOSE AND APPROACH: Section 2 - Left Text, Right Image */}
        <section aria-labelledby="purpose-approach-heading" className="w-full mb-14 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Left: Heading and existing three points */}
            <div className="flex flex-col justify-center order-2 lg:order-1">
              <h2
                id="purpose-approach-heading"
                className="font-editorial text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#111827] mb-6 md:mb-7"
              >
                From information to informed decisions.
              </h2>

              <div className="space-y-6 md:space-y-7">
                {/* Point 1 */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#111827] tracking-tight mb-1.5 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D36] shrink-0" aria-hidden="true" />
                    <span>Discover Relevant Data</span>
                  </h3>
                  <p className="text-sm md:text-base text-[#475569] leading-relaxed pl-4">
                    Explore datasets by country, region, industry and topic.
                  </p>
                </div>

                {/* Point 2 */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#111827] tracking-tight mb-1.5 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D36] shrink-0" aria-hidden="true" />
                    <span>Understand Before Accessing</span>
                  </h3>
                  <p className="text-sm md:text-base text-[#475569] leading-relaxed pl-4">
                    Review available descriptions, coverage, formats and licensing information.
                  </p>
                </div>

                {/* Point 3 */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#111827] tracking-tight mb-1.5 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D36] shrink-0" aria-hidden="true" />
                    <span>Request Specialist Support</span>
                  </h3>
                  <p className="text-sm md:text-base text-[#475569] leading-relaxed pl-4">
                    Discuss research, analysis or storage requirements with the team.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Existing research photograph */}
            <div className="w-full order-1 lg:order-2">
              <figure className="w-full flex flex-col m-0">
                <div className="relative w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[360px] bg-[#F4F6F5] rounded-md overflow-hidden border border-[#E2E8F0]/80 shadow-xs">
                  {(!approachImgLoaded || approachImgError) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#F1F6F3]">
                      <div className="w-12 h-12 rounded-full bg-[#E0ECE6] flex items-center justify-center mb-2.5 text-[#0A3D36]">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#0A3D36] font-sans mb-1">
                        Research &amp; Review
                      </span>
                      <p className="text-xs text-[#525B66] max-w-xs font-sans">
                        Professionals and researchers reviewing data systems and findings
                      </p>
                    </div>
                  )}

                  {!approachImgError && (
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/AfLIA_2023_Preconference_workshop.jpg/1280px-AfLIA_2023_Preconference_workshop.jpg"
                      alt="Researchers and information professionals reviewing data systems and research resources together"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onLoad={() => setApproachImgLoaded(true)}
                      onError={() => setApproachImgError(true)}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${approachImgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                  )}
                </div>
                <p className="mt-1.5 text-[11px] text-[#64748B] font-sans px-0.5">
                  Photo: African Library and Information Associations and Institutions (CC BY-SA 4.0 via Wikimedia Commons)
                </p>
              </figure>
            </div>
          </div>
        </section>

        {/* 4. WHO THE PLATFORM IS FOR: Balanced 3-column desktop layout */}
        <section aria-labelledby="audience-heading" className="mb-14 md:mb-20">
          <div className="mb-6 md:mb-8">
            <h2
              id="audience-heading"
              className="font-editorial text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#111827]"
            >
              Supporting different data needs.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {AUDIENCE_GROUPS.map((audience) => (
              <div
                key={audience}
                className="p-5 md:p-6 bg-[#F9FBFA] border border-[#E2E8F0]/80 rounded-md flex items-start gap-3 transition-colors hover:bg-[#F2F8F5]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D36] mt-2 shrink-0" aria-hidden="true" />
                <span className="text-sm md:text-base font-medium text-[#111827] leading-snug">
                  {audience}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. RESPONSIBLE DATA USE: Balanced two-column pale-mint section */}
        <section aria-labelledby="responsible-data-heading" className="mb-14 md:mb-20">
          <div className="w-full p-7 md:p-8 bg-[#F1F7F4] border border-[#E2E8F0]/80 rounded-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-center">
              {/* Left: Heading and explanatory paragraph */}
              <div className="lg:col-span-7">
                <h2
                  id="responsible-data-heading"
                  className="font-editorial text-2xl sm:text-3xl font-medium tracking-tight text-[#111827] mb-2.5"
                >
                  Clear information. Responsible use.
                </h2>

                <p className="text-sm md:text-base text-[#475569] leading-relaxed">
                  Dataset access should be supported by clear source information, appropriate permissions and understandable licensing conditions.
                </p>
              </div>

              {/* Right: Checklist points */}
              <div className="lg:col-span-5">
                <ul className="space-y-3 text-sm md:text-base text-[#334155]">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#E5F0EB] text-[#0A3D36] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span>Source and attribution information.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#E5F0EB] text-[#0A3D36] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span>Clear usage and access conditions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#E5F0EB] text-[#0A3D36] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span>Respect for privacy and distribution rights.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FINAL ACTIONS: Compact section */}
        <section aria-labelledby="final-actions-heading">
          <div className="max-w-2xl">
            <h2
              id="final-actions-heading"
              className="font-editorial text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#111827] mb-6"
            >
              Find the right starting point.
            </h2>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={onExploreDatasets}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
              >
                <span>Explore Datasets</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onNavigateConsulting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-[#0A3D36] bg-[#EAF5F0] hover:bg-[#D8ECE3] active:bg-[#C8E4D8] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
              >
                <span>Discuss a Research Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
