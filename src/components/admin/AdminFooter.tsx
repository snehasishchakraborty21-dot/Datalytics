import React from 'react';

export const AdminFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#F8FAFC] mt-auto">
      <div className="w-full px-5 md:px-8 max-w-[1536px] mx-auto py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-24 sm:pr-28 lg:pr-32">
        {/* Bold Black Copyright */}
        <div className="text-[#000000] font-bold text-[14px] leading-normal text-left">
          © 2026 Datalytics. All rights reserved.
        </div>

        {/* Century Schoolbook Developer Credit */}
        <div className="font-schoolbook font-bold italic text-[13px] md:text-sm text-[#334155] tracking-wide text-left sm:text-right">
          Designed &amp; Developed by ASCO GLOBAL SOLUTIONS
        </div>
      </div>
    </footer>
  );
};
