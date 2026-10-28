import React, { useState } from 'react';
import { X, Clock, ThermometerSnowflake, Check, MapPin, Navigation, ShieldCheck } from 'lucide-react';
import { DonationListing } from '../data/rescueData';
import { BatchThumbnail } from './BatchThumbnail';

interface ClaimRescueModalProps {
  batch: DonationListing | null;
  onClose: () => void;
  onConfirmClaim: (batchId: string, courierName: string, probeTempF: number) => void;
  formatCountdown: (seconds: number) => string;
}

export const ClaimRescueModal: React.FC<ClaimRescueModalProps> = ({
  batch,
  onClose,
  onConfirmClaim,
  formatCountdown,
}) => {
  const [courierName, setCourierName] = useState('Alex Rivera (Cargo Van #09)');
  const [probeTemp, setProbeTemp] = useState(batch?.targetTempF ? String(batch.targetTempF - 1) : '37');
  const [checks, setChecks] = useState({
    thermalBlankets: true,
    cargoClearance: true,
    directTransit: true,
  });

  if (!batch) return null;

  const isCritical = batch.remainingSeconds < 1800;
  const allChecked = checks.thermalBlankets && checks.cargoClearance && checks.directTransit;

  const toggleCheck = (key: keyof typeof checks) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allChecked) return;
    onConfirmClaim(batch.id, courierName.trim() || 'Volunteer Courier', parseFloat(probeTemp) || 37);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0F172A]/25 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-modal-title"
    >
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-harvest-3 border border-slate-900/5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Mobile Drag Handle */}
        <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <BatchThumbnail type={batch.illustrationType} className="w-14 h-14 shrink-0" />
            <div>
              <div className="text-xs text-[#64748B] flex items-center gap-1.5">
                <span className="font-semibold text-[#15803D]">{batch.category}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{batch.id}</span>
                <span aria-hidden="true">·</span>
                <span
                  className={`font-semibold tabular-nums flex items-center gap-1 ${
                    isCritical ? 'text-[#DC2626]' : 'text-[#B45309]'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  {formatCountdown(batch.remainingSeconds)} left
                </span>
              </div>
              <h2 id="claim-modal-title" className="text-lg font-bold text-[#0F172A] mt-0.5">
                {batch.donorName}
              </h2>
              <p className="text-xs text-[#3F493F]">{batch.itemTitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dispatch modal"
            className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Route Summary Strip */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#D97706] mt-0.5 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-[#0F172A]">Pickup: {batch.donorName}</span>
                <p className="text-[#3F493F] mt-0.5">
                  {batch.address} ({batch.neighborhood}) · <span className="tabular-nums font-semibold">{batch.weightLbs} lbs / {batch.crateCount} crates</span>
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200/70 pt-3 flex items-start gap-3">
              <Navigation className="w-4 h-4 text-[#15803D] mt-0.5 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-[#0F172A]">Dropoff: {batch.matchedRecipient}</span>
                <p className="text-[#3F493F] mt-0.5">
                  {batch.recipientAddress} · <span className="tabular-nums font-semibold">{batch.distanceMiles} miles</span> direct transit
                </p>
              </div>
            </div>
          </div>

          {/* Courier Input & Cold Chain Target */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="courier-name-input" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Assigned Rescue Courier &amp; Vehicle
              </label>
              <input
                id="courier-name-input"
                type="text"
                required
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                placeholder="Name & vehicle unit"
                className="w-full min-h-[48px] px-3.5 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#15803D] focus:ring-3 focus:ring-[#15803D]/15"
              />
            </div>

            <div>
              <label htmlFor="cooler-temp-input" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Cooler Temp (°F)
              </label>
              <div className="relative">
                <input
                  id="cooler-temp-input"
                  type="number"
                  step="0.5"
                  min="28"
                  max="72"
                  value={probeTemp}
                  onChange={(e) => setProbeTemp(e.target.value)}
                  className="w-full min-h-[48px] px-3.5 rounded-xl bg-white border border-[#CBD5E1] text-sm font-bold tabular-nums text-[#0F172A] focus:outline-none focus:border-[#15803D] focus:ring-3 focus:ring-[#15803D]/15"
                />
                <ThermometerSnowflake className="w-4 h-4 text-[#15803D] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Earthy Harvest Modern 20px Square Checkboxes (rounded-md 6px, #15803D checked) */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-[#0F172A] uppercase tracking-[0.04em]">
              Food Safety &amp; Cold-Chain Readiness Verification
            </div>

            <button
              type="button"
              onClick={() => toggleCheck('thermalBlankets')}
              className="w-full min-h-[44px] p-2.5 rounded-xl border border-slate-200/80 hover:bg-[#F8FAFC] flex items-center gap-3 text-left transition-colors cursor-pointer"
            >
              <span
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                  checks.thermalBlankets
                    ? 'bg-[#15803D] text-white'
                    : 'bg-white border border-[#CBD5E1]'
                }`}
              >
                {checks.thermalBlankets && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </span>
              <span className="text-xs font-medium text-[#0F172A]">
                Sanitized thermal blankets &amp; insulated food-grade carriers loaded ({batch.requiresColdChain ? `Required ≤${batch.targetTempF}°F` : 'Ambient protection'})
              </span>
            </button>

            <button
              type="button"
              onClick={() => toggleCheck('cargoClearance')}
              className="w-full min-h-[44px] p-2.5 rounded-xl border border-slate-200/80 hover:bg-[#F8FAFC] flex items-center gap-3 text-left transition-colors cursor-pointer"
            >
              <span
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                  checks.cargoClearance
                    ? 'bg-[#15803D] text-white'
                    : 'bg-white border border-[#CBD5E1]'
                }`}
              >
                {checks.cargoClearance && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </span>
              <span className="text-xs font-medium text-[#0F172A]">
                Vehicle capacity confirmed for <span className="tabular-nums font-bold">{batch.crateCount} crates ({batch.weightLbs} lbs)</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => toggleCheck('directTransit')}
              className="w-full min-h-[44px] p-2.5 rounded-xl border border-slate-200/80 hover:bg-[#F8FAFC] flex items-center gap-3 text-left transition-colors cursor-pointer"
            >
              <span
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                  checks.directTransit
                    ? 'bg-[#15803D] text-white'
                    : 'bg-white border border-[#CBD5E1]'
                }`}
              >
                {checks.directTransit && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </span>
              <span className="text-xs font-medium text-[#0F172A]">
                Commit to direct non-stop delivery to {batch.matchedRecipient} within 45 minutes
              </span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto min-h-[52px] px-6 rounded-full bg-white border-[1.5px] border-[#E2E8F0] text-sm font-semibold text-[#0F172A] hover:bg-[#F1F5F9] active:scale-[0.98] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!allChecked}
              className={`w-full sm:w-auto min-h-[52px] px-7 rounded-full text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 ${
                isCritical
                  ? 'bg-[#DC2626] hover:bg-[#B91C1C]'
                  : 'bg-[#15803D] hover:bg-[#14532D]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              {isCritical ? 'Confirm Immediate Dispatch' : 'Confirm Rescue & Generate PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
