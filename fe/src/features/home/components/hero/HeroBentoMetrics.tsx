import React from 'react';

interface HeroBentoMetricsProps {
  metrics: {
    m1Val: string;
    m1Label: string;
    m2Val: string;
    m2Label: string;
    m3Val: string;
    m3Label: string;
  };
}

export const HeroBentoMetrics: React.FC<HeroBentoMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f5f3f0] p-4 rounded-xl shadow-xs border border-[#eae8e5]">
      <div className="flex flex-col">
        <span className="font-price-numeral text-2xl text-[#af101a] font-extrabold">
          {metrics.m1Val}
        </span>
        <span className="font-body-sm text-xs text-[#585757]">{metrics.m1Label}</span>
      </div>
      <div className="flex flex-col">
        <span className="font-price-numeral text-2xl text-[#1b1c1a] font-extrabold">
          {metrics.m2Val}
        </span>
        <span className="font-body-sm text-xs text-[#585757]">{metrics.m2Label}</span>
      </div>
      <div className="flex flex-col">
        <span className="font-price-numeral text-2xl text-[#835500] font-extrabold">
          {metrics.m3Val}
        </span>
        <span className="font-body-sm text-xs text-[#585757]">{metrics.m3Label}</span>
      </div>
    </div>
  );
};

