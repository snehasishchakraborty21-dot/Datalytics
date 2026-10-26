import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CallToActionProps {
  onSubmitEnquiry: () => void;
  onBrowseDatasets: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({
  onSubmitEnquiry,
  onBrowseDatasets,
}) => {
  return (
    <section className="w-full bg-white py-14 md:py-16">
      <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold tracking-wider text-[#0A3D36] uppercase font-sans">
            Direct Inquiries
          </span>

          <h2 className="font-editorial text-3xl sm:text-4xl text-[#111827] font-medium tracking-tight mt-2 mb-3">
            Looking for something specific?
          </h2>

          <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed mb-7">
            Tell us the data, research or storage support you need.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {/* Primary Action */}
            <button
              type="button"
              onClick={onSubmitEnquiry}
              className="px-6 py-3 text-sm font-medium text-white bg-[#0A3D36] hover:bg-[#072C27] active:bg-[#05211D] rounded-sm transition-colors cursor-pointer shadow-xs whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36] focus-visible:ring-offset-2"
            >
              Submit an Enquiry
            </button>

            {/* Secondary Action */}
            <button
              type="button"
              onClick={onBrowseDatasets}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#111827] hover:text-[#0A3D36] bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-sm transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D36]"
            >
              <span>Browse Datasets</span>
              <ArrowRight className="w-4 h-4 text-[#0A3D36]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
