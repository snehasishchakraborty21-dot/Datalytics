import React from 'react';

export const DatasetInfoSection: React.FC = () => {
  const reviewItems = [
    {
      title: 'Source and attribution',
      description: 'See where the data comes from.',
    },
    {
      title: 'Coverage and reporting period',
      description: 'Check the locations and time period covered.',
    },
    {
      title: 'Formats and previews',
      description: 'Review available file formats and sample information.',
    },
    {
      title: 'Update frequency',
      description: 'Check the stated update schedule.',
    },
    {
      title: 'Licensing and access',
      description: 'Understand how the dataset may be accessed and used.',
    },
  ];

  return (
    <section className="w-full bg-[#F2F8F5] py-14 md:py-16">
      <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Heading and Context (5 cols) */}
          <div className="lg:col-span-5">
            <span className="text-xs font-semibold tracking-wider text-[#0A3D36] uppercase font-sans">
              Metadata Standards
            </span>

            <h2 className="font-editorial text-3xl sm:text-4xl text-[#111827] font-medium tracking-tight mt-1.5 mb-4">
              Understand the data before you use it.
            </h2>

            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
              Review the source, coverage, formats and licensing information before choosing a dataset.
            </p>
          </div>

          {/* Right Column: "What you can review" (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-md p-6 sm:p-7 shadow-xs">
              <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] mb-5">
                What you can review
              </h3>

              {/* Items separated by clean vertical spacing without horizontal divider lines */}
              <div className="space-y-4">
                {reviewItems.map((item, index) => (
                  <div key={item.title} className="py-1">
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono font-medium text-[#0A3D36] mt-0.5 shrink-0">
                        0{index + 1}
                      </span>
                      <div>
                        <h4 className="text-sm md:text-[15px] font-semibold text-[#111827] mb-0.5">
                          {item.title}
                        </h4>
                        <p className="text-sm text-[#4B5563] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
