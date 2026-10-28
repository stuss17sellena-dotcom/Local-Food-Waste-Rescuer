import React, { useState } from 'react';
import { Download, Search } from 'lucide-react';
import { CompletedRescueRecord, FoodCategory } from '../data/rescueData';

interface ImpactLedgerViewProps {
  records: CompletedRescueRecord[];
}

export const ImpactLedgerView: React.FC<ImpactLedgerViewProps> = ({ records }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | FoodCategory>('All');

  const filteredRecords = records.filter((rec) => {
    const matchesCategory = selectedCategory === 'All' || rec.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      rec.donorName.toLowerCase().includes(q) ||
      rec.recipientPantry.toLowerCase().includes(q) ||
      rec.itemSummary.toLowerCase().includes(q) ||
      rec.id.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const totalWeight = filteredRecords.reduce((acc, r) => acc + r.weightLbs, 0);
  const totalMeals = filteredRecords.reduce((acc, r) => acc + r.mealsProvided, 0);
  const totalCo2Kg = filteredRecords.reduce((acc, r) => acc + r.co2AvertedKg, 0);

  const handleDownloadCsv = () => {
    const headers = [
      'Log ID',
      'Timestamp',
      'Donor Partner',
      'Category',
      'Batch Summary',
      'Receiving Pantry',
      'Weight (lbs)',
      'Meals Provided',
      'CO2e Averted (kg)',
      'Temperature Verification',
      'Courier',
    ];
    const rows = filteredRecords.map((r) => [
      r.id,
      `"${r.timestamp}"`,
      `"${r.donorName}"`,
      `"${r.category}"`,
      `"${r.itemSummary}"`,
      `"${r.recipientPantry}"`,
      r.weightLbs,
      r.mealsProvided,
      r.co2AvertedKg,
      `"${r.verifiedTempF}"`,
      `"${r.courierName}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `harvestloop-rescue-ledger-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-harvest-1 border border-slate-900/5 space-y-6">
      {/* Header & CSV Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold text-[#15803D] tracking-wide">
            Verified Chain-of-Custody · Tax Deduction &amp; Health Department Log
          </span>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#0F172A] tracking-[-0.02em] mt-1">
            Completed Food Rescue Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#3F493F] mt-1 tabular-nums">
            Showing {filteredRecords.length} verified deliveries · {totalWeight.toLocaleString()} lbs rescued · {totalMeals.toLocaleString()} meals · {totalCo2Kg.toFixed(1)} kg CO₂e averted
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadCsv}
          className="self-start sm:self-center min-h-[48px] px-6 rounded-full bg-[#15803D] hover:bg-[#14532D] text-xs font-bold text-white flex items-center gap-2 transition-transform active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download CSV
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Sliding Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-full overflow-x-auto">
          {(['All', 'Bakery', 'Produce', 'Prepared Meals', 'Cold Chain Dairy'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[40px] px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Search Input (48px height, rounded-xl) */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search donor, pantry, or ID..."
            aria-label="Search completed rescue ledger"
            className="w-full min-h-[48px] pl-10 pr-4 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#15803D] focus:ring-3 focus:ring-[#15803D]/15"
          />
        </div>
      </div>

      {/* High-Density Tabular Ledger */}
      <div className="overflow-x-auto -mx-5 sm:mx-0">
        <table className="w-full text-left border-collapse min-w-[780px]">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-[0.04em] text-[#64748B]">
              <th className="py-3 px-4">Log ID &amp; Time</th>
              <th className="py-3 px-4">Donor &amp; Batch</th>
              <th className="py-3 px-4">Receiving Pantry</th>
              <th className="py-3 px-4 text-right">Weight</th>
              <th className="py-3 px-4 text-right">Meals</th>
              <th className="py-3 px-4 text-right">CO₂e Averted</th>
              <th className="py-3 px-4">Cold-Chain Log</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm text-[#64748B]">
                  No completed rescue records match your current filter.
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4 align-top whitespace-nowrap">
                    <div className="font-mono-tabular font-bold text-xs text-[#0F172A]">{rec.id}</div>
                    <div className="text-xs text-[#64748B] mt-0.5">{rec.timestamp}</div>
                  </td>
                  <td className="py-3.5 px-4 align-top">
                    <div className="font-semibold text-[#0F172A]">{rec.donorName}</div>
                    <div className="text-xs text-[#3F493F] mt-0.5">
                      <span className="font-semibold text-[#15803D]">{rec.category}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{rec.itemSummary}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 align-top">
                    <div className="font-medium text-[#0F172A]">{rec.recipientPantry}</div>
                    <div className="text-xs text-[#64748B] mt-0.5">Courier: {rec.courierName}</div>
                  </td>
                  <td className="py-3.5 px-4 align-top text-right font-mono-tabular font-bold text-[#0F172A] whitespace-nowrap">
                    {rec.weightLbs} lbs
                  </td>
                  <td className="py-3.5 px-4 align-top text-right font-mono-tabular font-semibold text-[#15803D] whitespace-nowrap">
                    {rec.mealsProvided}
                  </td>
                  <td className="py-3.5 px-4 align-top text-right font-mono-tabular text-[#3F493F] whitespace-nowrap">
                    {rec.co2AvertedKg.toFixed(1)} kg
                  </td>
                  <td className="py-3.5 px-4 align-top whitespace-nowrap">
                    <span className="text-xs font-mono-tabular font-semibold text-[#0F172A]">
                      {rec.verifiedTempF}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
