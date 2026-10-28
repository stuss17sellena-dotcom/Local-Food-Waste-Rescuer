import React from 'react';
import { MapPin, Navigation, ThermometerSnowflake, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DonationListing } from '../data/rescueData';

interface DispatchMapProps {
  donations: DonationListing[];
  selectedBatch: DonationListing | null;
  onSelectBatch: (batch: DonationListing) => void;
  onOpenClaimModal: (batch: DonationListing) => void;
  formatCountdown: (seconds: number) => string;
}

export const DispatchMap: React.FC<DispatchMapProps> = ({
  donations,
  selectedBatch,
  onSelectBatch,
  onOpenClaimModal,
  formatCountdown,
}) => {
  const activeBatch = selectedBatch || donations[0] || null;

  return (
    <div className="bg-white rounded-3xl shadow-harvest-1 border border-slate-900/5 overflow-hidden flex flex-col">
      {/* Map Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-semibold text-[#0F172A] leading-6">
            San Francisco Sector Dispatch Map
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Select a donor node to inspect route pairing · {donations.filter(d => d.status === 'available').length} active pickups
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#3F493F] font-medium shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#DC2626] inline-block" />
            &lt;30m Critical
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#D97706] inline-block" />
            Standard
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#15803D] inline-block" />
            Pantry Hub
          </span>
        </div>
      </div>

      {/* Interactive SVG Map Canvas */}
      <div className="relative h-[300px] sm:h-[340px] w-full bg-[#F1F5F9] overflow-hidden select-none">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
          aria-label="Interactive neighborhood food rescue map"
        >
          {/* Soft Organic Park Zones */}
          <rect width="100" height="100" fill="#F1F5F9" />
          <path d="M0 15 Q 25 18, 40 8 L 45 0 L 0 0 Z" fill="#DCFCE7" opacity="0.55" />
          <path d="M55 45 Q 72 42, 85 55 Q 78 72, 60 68 Z" fill="#DCFCE7" opacity="0.5" />
          <path d="M12 72 Q 28 66, 38 82 L 20 96 Z" fill="#DCFCE7" opacity="0.45" />
          {/* Bay Shoreline Right */}
          <path d="M88 0 L 100 0 L 100 100 L 90 100 Q 84 65, 91 35 Z" fill="#DBEAFE" opacity="0.7" />

          {/* Street Grid Lines */}
          <g stroke="#E2E8F0" strokeWidth="0.6">
            <line x1="0" y1="20" x2="90" y2="20" />
            <line x1="0" y1="38" x2="90" y2="38" />
            <line x1="0" y1="56" x2="90" y2="56" />
            <line x1="0" y1="74" x2="90" y2="74" />
            <line x1="20" y1="0" x2="20" y2="100" />
            <line x1="38" y1="0" x2="38" y2="100" />
            <line x1="56" y1="0" x2="56" y2="100" />
            <line x1="74" y1="0" x2="74" y2="100" />
          </g>

          {/* Market St Diagonal Artery */}
          <line x1="10" y1="88" x2="86" y2="12" stroke="#CBD5E1" strokeWidth="1.4" />

          {/* Active Route Connection Curve */}
          {activeBatch && (
            <g>
              <line
                x1={activeBatch.mapCoords.x}
                y1={activeBatch.mapCoords.y}
                x2={activeBatch.recipientCoords.x}
                y2={activeBatch.recipientCoords.y}
                stroke={activeBatch.remainingSeconds < 1800 && activeBatch.status === 'available' ? '#DC2626' : '#15803D'}
                strokeWidth="1.2"
                strokeDasharray="2.2 1.4"
              />
              {/* Recipient Pantry Node */}
              <circle
                cx={activeBatch.recipientCoords.x}
                cy={activeBatch.recipientCoords.y}
                r="3.2"
                fill="#DCFCE7"
                stroke="#15803D"
                strokeWidth="1"
              />
            </g>
          )}
        </svg>

        {/* Neighborhood Labels */}
        <span className="absolute top-3 left-4 text-[10px] font-bold tracking-[0.04em] uppercase text-slate-400 pointer-events-none">
          Pacific Heights
        </span>
        <span className="absolute top-[40%] left-4 text-[10px] font-bold tracking-[0.04em] uppercase text-slate-400 pointer-events-none">
          Mission District
        </span>
        <span className="absolute bottom-4 left-6 text-[10px] font-bold tracking-[0.04em] uppercase text-slate-400 pointer-events-none">
          Noe Valley
        </span>
        <span className="absolute top-[28%] right-14 text-[10px] font-bold tracking-[0.04em] uppercase text-slate-400 pointer-events-none">
          Civic Center
        </span>
        <span className="absolute bottom-5 right-14 text-[10px] font-bold tracking-[0.04em] uppercase text-slate-400 pointer-events-none">
          Dogpatch Bay
        </span>

        {/* Interactive Donor Nodes */}
        {donations.map((batch) => {
          const isSelected = activeBatch?.id === batch.id;
          const isCritical = batch.remainingSeconds < 1800 && batch.status === 'available';
          const isClaimed = batch.status === 'claimed';

          const pinBg = isClaimed
            ? 'bg-[#15803D] text-white'
            : isCritical
            ? 'bg-[#DC2626] text-white shadow-critical-glow'
            : 'bg-[#D97706] text-white';

          return (
            <button
              key={batch.id}
              type="button"
              onClick={() => onSelectBatch(batch)}
              style={{
                left: `${batch.mapCoords.x}%`,
                top: `${batch.mapCoords.y}%`,
              }}
              aria-label={`Select ${batch.donorName}, ${batch.weightLbs} pounds`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center transition-transform duration-150 focus:outline-none ${
                isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105'
              }`}
            >
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold tabular-nums flex items-center gap-1 border-2 border-white shadow-md whitespace-nowrap ${pinBg} ${
                  isSelected ? 'ring-4 ring-[#15803D]/25' : ''
                }`}
              >
                <MapPin className="w-3 h-3 shrink-0" />
                {batch.weightLbs}lb
              </span>
            </button>
          );
        })}

        {/* Active Matched Recipient Marker */}
        {activeBatch && (
          <div
            style={{
              left: `${activeBatch.recipientCoords.x}%`,
              top: `${activeBatch.recipientCoords.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
          >
            <div className="px-2.5 py-1 rounded-full bg-white text-[#14532D] border-2 border-[#15803D] shadow-sm text-[10px] font-bold whitespace-nowrap flex items-center gap-1">
              <Navigation className="w-2.5 h-2.5 text-[#15803D]" />
              {activeBatch.matchedRecipient.split(' ')[0]} Hub
            </div>
          </div>
        )}
      </div>

      {/* Selected Batch Route Inspector Footer */}
      {activeBatch && (
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-[#64748B] flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-[#0F172A]">{activeBatch.id}</span>
                <span aria-hidden="true">·</span>
                <span>{activeBatch.neighborhood}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums font-medium text-[#15803D]">{activeBatch.distanceMiles} mi transit</span>
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mt-1">
                {activeBatch.donorName}
              </h3>
              <p className="text-xs text-[#3F493F] mt-0.5">
                {activeBatch.address}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-[#0F172A] tabular-nums">
                {activeBatch.weightLbs} lbs · {activeBatch.crateCount} crates
              </div>
              <div
                className={`text-xs font-semibold tabular-nums mt-0.5 flex items-center justify-end gap-1 ${
                  activeBatch.remainingSeconds < 1800 && activeBatch.status === 'available'
                    ? 'text-[#DC2626]'
                    : 'text-[#B45309]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {activeBatch.status === 'claimed'
                  ? 'En Route Now'
                  : `${formatCountdown(activeBatch.remainingSeconds)} left`}
              </div>
            </div>
          </div>

          {/* Route Pairing Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-[#3F493F] flex items-center gap-2">
              <span className="font-medium text-[#64748B]">Matched Dropoff:</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
              <span className="font-semibold text-[#0F172A]">{activeBatch.matchedRecipient}</span>
              {activeBatch.requiresColdChain && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 text-[#0F172A] font-medium tabular-nums">
                    <ThermometerSnowflake className="w-3.5 h-3.5 text-[#15803D]" />
                    &le;{activeBatch.targetTempF}°F
                  </span>
                </>
              )}
            </div>

            {activeBatch.status === 'available' ? (
              <button
                type="button"
                onClick={() => onOpenClaimModal(activeBatch)}
                className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs font-bold text-white transition-transform active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer ${
                  activeBatch.remainingSeconds < 1800
                    ? 'bg-[#DC2626] hover:bg-[#B91C1C]'
                    : 'bg-[#15803D] hover:bg-[#14532D]'
                }`}
              >
                {activeBatch.remainingSeconds < 1800 ? 'Dispatch Critical Pickup' : 'Claim Rescue Route'}
              </button>
            ) : (
              <span className="text-xs font-semibold text-[#15803D] flex items-center gap-1.5 whitespace-nowrap">
                <CheckCircle2 className="w-4 h-4" />
                Assigned to {activeBatch.claimedBy}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
