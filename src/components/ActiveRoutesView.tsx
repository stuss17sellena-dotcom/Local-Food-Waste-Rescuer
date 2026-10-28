import React, { useState } from 'react';
import { CheckCircle2, MapPin, Navigation, ThermometerSnowflake, KeyRound, Truck, ArrowRight } from 'lucide-react';
import { DonationListing } from '../data/rescueData';
import { BatchThumbnail } from './BatchThumbnail';

interface ActiveRoutesViewProps {
  claimedBatches: DonationListing[];
  onCompleteHandoff: (batchId: string, finalTempF: string) => void;
  onBrowseAvailable: () => void;
}

export const ActiveRoutesView: React.FC<ActiveRoutesViewProps> = ({
  claimedBatches,
  onCompleteHandoff,
  onBrowseAvailable,
}) => {
  const [tempOverrides, setTempOverrides] = useState<Record<string, string>>({});

  if (claimedBatches.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-harvest-1 border border-slate-900/5 text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mx-auto">
          <Truck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#0F172A] mt-4">
          No Active Courier Routes Assigned
        </h2>
        <p className="text-sm text-[#3F493F] mt-1.5 max-w-md mx-auto">
          Claim an open bakery, produce, or prepared meal batch from the Live Dispatch board to begin cold-chain transit verification.
        </p>
        <button
          type="button"
          onClick={onBrowseAvailable}
          className="mt-6 min-h-[52px] px-7 rounded-full bg-[#15803D] hover:bg-[#14532D] text-sm font-bold text-white inline-flex items-center gap-2 transition-transform active:scale-[0.98] cursor-pointer"
        >
          Browse Open Dispatch Feed
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-[#15803D] tracking-wide">
            Active Transit Manifest · Cold-Chain Custody
          </span>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#0F172A] tracking-[-0.02em] mt-0.5">
            In-Transit Rescue Routes ({claimedBatches.length})
          </h1>
        </div>
        <button
          type="button"
          onClick={onBrowseAvailable}
          className="self-start sm:self-center min-h-[44px] px-5 rounded-full bg-white border-[1.5px] border-[#E2E8F0] text-xs font-semibold text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
        >
          + Claim Additional Route
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {claimedBatches.map((batch) => {
          const currentTemp =
            tempOverrides[batch.id] ??
            (batch.verifiedTempF ? String(batch.verifiedTempF) : batch.targetTempF ? String(batch.targetTempF - 0.8) : '66.0');

          return (
            <article
              key={batch.id}
              className="bg-white rounded-3xl p-5 sm:p-6 shadow-harvest-1 border border-slate-900/5 flex flex-col justify-between gap-5"
            >
              <div>
                {/* Top Metadata Line (Zero-Pill Unboxed Discipline) */}
                <div className="flex items-center justify-between gap-2 text-xs text-[#64748B]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-[#15803D]">{batch.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular font-semibold text-[#0F172A]">{batch.id}</span>
                    <span aria-hidden="true">·</span>
                    <span>Claimed {batch.claimedAt || 'Just now'}</span>
                  </div>
                  <span className="font-mono-tabular font-bold text-[#0F172A]">
                    PIN #{batch.handoffPin}
                  </span>
                </div>

                {/* Main Batch Info */}
                <div className="flex items-start gap-4 mt-3">
                  <BatchThumbnail type={batch.illustrationType} className="w-16 h-16 shrink-0" />
                  <div>
                    <h2 className="text-lg font-bold text-[#0F172A] leading-snug">
                      {batch.donorName}
                    </h2>
                    <p className="text-sm font-medium text-[#3F493F] mt-0.5">
                      {batch.itemTitle}
                    </p>
                    <p className="text-xs text-[#64748B] mt-1 tabular-nums">
                      {batch.weightLbs} lbs · {batch.crateCount} crates · Courier: {batch.claimedBy}
                    </p>
                  </div>
                </div>

                {/* Pickup -> Dropoff Timeline */}
                <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#D97706] mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <div className="font-semibold text-[#0F172A]">Origin Dock Verified</div>
                      <div className="text-[#3F493F] mt-0.5">{batch.address}</div>
                      <div className="text-[#64748B]">{batch.neighborhood}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Navigation className="w-4 h-4 text-[#15803D] mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <div className="font-semibold text-[#0F172A]">Destination Pantry</div>
                      <div className="text-[#3F493F] mt-0.5">{batch.matchedRecipient}</div>
                      <div className="text-[#64748B]">{batch.recipientAddress} ({batch.distanceMiles} mi)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cold-Chain Telemetry & Complete Sign-off Bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div>
                    <label
                      htmlFor={`temp-verify-${batch.id}`}
                      className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-[0.04em] mb-1"
                    >
                      Arrival Probe (°F)
                    </label>
                    <div className="relative w-28">
                      <input
                        id={`temp-verify-${batch.id}`}
                        type="number"
                        step="0.2"
                        value={currentTemp}
                        onChange={(e) =>
                          setTempOverrides((prev) => ({ ...prev, [batch.id]: e.target.value }))
                        }
                        className="w-full min-h-[44px] px-3 rounded-xl bg-white border border-[#CBD5E1] text-sm font-bold tabular-nums text-[#0F172A] focus:outline-none focus:border-[#15803D]"
                      />
                      <ThermometerSnowflake className="w-3.5 h-3.5 text-[#15803D] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="text-xs text-[#3F493F]">
                    <div className="font-semibold text-[#0F172A] flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-[#D97706]" />
                      Handoff Code: <span className="font-mono-tabular font-bold">{batch.handoffPin}</span>
                    </div>
                    <div className="text-[#64748B] mt-0.5">
                      {batch.requiresColdChain
                        ? `Target ≤${batch.targetTempF}°F required`
                        : 'Ambient dry crate verification'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onCompleteHandoff(
                      batch.id,
                      batch.requiresColdChain ? `${currentTemp}°F Verified` : `Ambient (${currentTemp}°F)`
                    )
                  }
                  className="min-h-[52px] px-6 rounded-full bg-[#15803D] hover:bg-[#14532D] text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 transition-transform active:scale-[0.98] whitespace-nowrap cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Complete Pantry Handoff
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
