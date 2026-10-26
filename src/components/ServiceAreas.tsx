import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface ServiceAreasProps {
  onExploreDatasets: () => void;
  onConsultingEnquiry: () => void;
  onStorageEnquiry: () => void;
}

export const ServiceAreas: React.FC<ServiceAreasProps> = ({
  onExploreDatasets,
  onConsultingEnquiry,
  onStorageEnquiry,
}) => {
  return (
    <section
      id="services"
      className="w-full bg-white py-14 md:py-16 scroll-mt-24"
    >
      <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto">
        {/* Section Lead */}
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-semibold tracking-wider text-[#0A3D36] uppercase font-sans">
            Platform Capabilities
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#111827] font-medium tracking-tight mt-1.5 mb-2.5">
            Three dedicated service areas.
          </h2>
          <p className="text-base text-[#4B5563] leading-relaxed">
            Discover datasets, request specialist research and explore data storage services.
          </p>
        </div>

        {/* Asymmetric Divided Editorial Layout separated by whitespace (no horizontal divider lines) */}
        <div className="space-y-6 md:space-y-8">
          {/* 01 — Datasets */}
          <div className="py-4 md:py-5 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start group">
            <div className="md:col-span-3">
              <span className="font-editorial text-2xl md:text-3xl font-medium text-[#0A3D36]">
                01
              </span>
              <span className="font-editorial text-2xl md:text-3xl font-medium text-[#94A3B8] mx-2">
                —
              </span>
              <h3 className="inline font-editorial text-2xl md:text-3xl font-medium text-[#111827]">
                Datasets
              </h3>
            </div>

            <div className="md:col-span-6">
              <p className="text-base text-[#334155] leading-relaxed">
                Discover structured data by country, industry and topic.
              </p>
            </div>

            <div className="md:col-span-3 md:text-right pt-1 md:pt-0">
              <button
                type="button"
                onClick={onExploreDatasets}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer group-hover:translate-x-0.5 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
              >
                <span>Explore Datasets</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 02 — Consulting */}
          <div className="py-4 md:py-5 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start group">
            <div className="md:col-span-3">
              <span className="font-editorial text-2xl md:text-3xl font-medium text-[#0A3D36]">
                02
              </span>
              <span className="font-editorial text-2xl md:text-3xl font-medium text-[#94A3B8] mx-2">
                —
              </span>
              <h3 className="inline font-editorial text-2xl md:text-3xl font-medium text-[#111827]">
                Consulting
              </h3>
            </div>

            <div className="md:col-span-6">
              <p className="text-base text-[#334155] leading-relaxed">
                Request research, analysis and specialist support for your business question.
              </p>
            </div>

            <div className="md:col-span-3 md:text-right pt-1 md:pt-0">
              <button
                type="button"
                onClick={onConsultingEnquiry}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer group-hover:translate-x-0.5 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
              >
                <span>Discuss Your Requirements</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 03 — Data Storage */}
          <div className="py-4 md:py-5 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start group">
            <div className="md:col-span-3">
              <span className="font-editorial text-2xl md:text-3xl font-medium text-[#0A3D36]">
                03
              </span>
              <span className="font-editorial text-2xl md:text-3xl font-medium text-[#94A3B8] mx-2">
                —
              </span>
              <h3 className="inline font-editorial text-2xl md:text-3xl font-medium text-[#111827]">
                Data Storage
              </h3>
            </div>

            <div className="md:col-span-6">
              <p className="text-base text-[#334155] leading-relaxed">
                Explore storage options or submit your organization’s requirements.
              </p>
            </div>

            <div className="md:col-span-3 md:text-right pt-1 md:pt-0">
              <button
                type="button"
                onClick={onStorageEnquiry}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A3D36] hover:text-[#072C27] hover:underline cursor-pointer group-hover:translate-x-0.5 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] rounded-xs"
              >
                <span>Explore Storage Services</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
