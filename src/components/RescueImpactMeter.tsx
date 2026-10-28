import React, { useState } from 'react';
import { Scale, Leaf, Users, ArrowUpRight } from 'lucide-react';

interface RescueImpactMeterProps {
  totalPoundsRescued: number;
  totalMealsProvided: number;
  totalCo2MetricTons: number;
  activeVolunteersCount: number;
  onViewLedger: () => void;
}

export const RescueImpactMeter: React.FC<RescueImpactMeterProps> = ({
  totalPoundsRescued,
  totalMealsProvided,
  totalCo2MetricTons,
  activeVolunteersCount,
  onViewLedger,
}) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  const weeklyGoalLbs = 5500;
  const monthlyGoalLbs = 22000;

  const displayedLbs = timeframe === 'weekly' ? totalPoundsRescued : totalPoundsRescued * 3 + 4120;
  const targetLbs = timeframe === 'weekly' ? weeklyGoalLbs : monthlyGoalLbs;
  const progressPct = Math.min(100, Math.round((displayedLbs / targetLbs) * 100));

  const displayedMeals = timeframe === 'weekly' ? totalMealsProvided : totalMealsProvided * 3 + 3400;
  const displayedCo2 = timeframe === 'weekly' ? totalCo2MetricTons : +(totalCo2MetricTons * 3.8).toFixed(2);

  return (
    <section
      aria-label="Neighborhood Rescue Impact Meter"
      className="bg-white rounded-3xl p-5 sm:p-6 shadow-harvest-1 border border-slate-900/5"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="text-xs font-semibold text-[#15803D] tracking-wide">
            Bay Area Perishable Relief Network · Live Telemetry
          </div>
          <h1
            className="text-[28px] sm:text-[34px] font-extrabold text-[#0F172A] tracking-[-0.02em] leading-tight mt-1"
            style={{ textWrap: 'balance' }}
          >
            Every surplus loaf and harvest crate reaches a neighbor before sunset.
          </h1>
        </div>

        {/* Interactive Timeframe Segmented Switcher */}
        <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
          <div className="flex items-center p-1 bg-[#F1F5F9] rounded-full">
            <button
              type="button"
              onClick={() => setTimeframe('weekly')}
              className={`min-h-[40px] px-4 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                timeframe === 'weekly'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              7-Day Sprint
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('monthly')}
              className={`min-h-[40px] px-4 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                timeframe === 'monthly'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              30-Day Cumulative
            </button>
          </div>

          <button
            type="button"
            onClick={onViewLedger}
            className="min-h-[40px] px-4 py-2 rounded-full border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Audit Ledger
            <ArrowUpRight className="w-3.5 h-3.5 text-[#15803D]" />
          </button>
        </div>
      </div>

      {/* Primary Emerald over Sage Progress Tracker */}
      <div className="pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tabular-nums tracking-tight">
              {displayedLbs.toLocaleString()} lbs
            </span>
            <span className="text-xs sm:text-sm text-[#3F493F] font-medium tabular-nums">
              rescued of {targetLbs.toLocaleString()} lbs {timeframe === 'weekly' ? 'weekly' : 'monthly'} neighborhood goal ({progressPct}%)
            </span>
          </div>
          <span className="text-xs font-semibold text-[#14532D] tabular-nums">
            {(targetLbs - displayedLbs > 0 ? targetLbs - displayedLbs : 0).toLocaleString()} lbs to next cold-storage grant milestone
          </span>
        </div>

        {/* Sage Track (#DCFCE7) with Emerald Fill (#15803D & #86EFAC) */}
        <div className="w-full h-4 rounded-full bg-[#DCFCE7] overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#15803D] via-[#16A34A] to-[#86EFAC] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* 3-Column Quantitative Breakdown (Separated by Hairline Dividers, Zero Nested Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 mt-6 border-t border-slate-100">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#64748B]">
              Verified Surplus Diverted
            </div>
            <div className="text-xl font-bold text-[#0F172A] tabular-nums mt-0.5">
              {displayedLbs.toLocaleString()} lbs
            </div>
            <div className="text-xs text-[#3F493F] mt-0.5 tabular-nums">
              98.4% cold-chain compliance rate
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3.5 sm:border-l sm:border-slate-100 sm:pl-6">
          <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#64748B]">
              Nutrient-Dense Meals Served
            </div>
            <div className="text-xl font-bold text-[#0F172A] tabular-nums mt-0.5">
              {displayedMeals.toLocaleString()} meals
            </div>
            <div className="text-xs text-[#3F493F] mt-0.5 tabular-nums">
              Across 14 partner neighborhood pantries · {activeVolunteersCount} couriers active
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3.5 sm:border-l sm:border-slate-100 sm:pl-6">
          <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#14532D] flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#64748B]">
              Methane &amp; Emissions Averted
            </div>
            <div className="text-xl font-bold text-[#0F172A] tabular-nums mt-0.5">
              {displayedCo2} MT CO₂e
            </div>
            <div className="text-xs text-[#3F493F] mt-0.5 tabular-nums">
              EPA WARM food waste diversion standard
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
