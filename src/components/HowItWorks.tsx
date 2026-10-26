import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'Discover',
      description: 'Search by topic, location or industry.',
    },
    {
      num: '2',
      title: 'Review',
      description: 'Check the description, sample and licensing information.',
    },
    {
      num: '3',
      title: 'Access',
      description: 'Purchase an available dataset or select a suitable subscription.',
    },
  ];

  return (
    <section className="w-full bg-white py-8">
      <div className="w-full px-5 md:px-8 lg:px-14 xl:px-16 max-w-[1536px] mx-auto">
        {/* Single-line heading with ~24px gap to steps */}
        <h2 className="font-editorial text-3xl sm:text-4xl text-[#111827] font-medium tracking-tight mb-6">
          How it works
        </h2>

        {/* 3 Evenly Spaced Columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col">
              {/* Step number and title together on one line with matching baseline, size, and weight */}
              <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#111827] mb-2 flex items-baseline">
                <span className="text-[#0A3D36] mr-2">{step.num}.</span>
                <span>{step.title}</span>
              </h3>

              {/* Description with exact 8px gap from heading */}
              <p className="text-sm md:text-base text-[#4B5563] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
