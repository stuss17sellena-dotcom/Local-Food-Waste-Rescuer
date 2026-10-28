/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Clock,
  ThermometerSnowflake,
  MapPin,
  ArrowRight,
  Check,
  Compass,
  Truck,
  PlusCircle,
  ClipboardList,
  CheckCircle2,
} from 'lucide-react';
import {
  INITIAL_DONATIONS,
  INITIAL_LEDGER,
  DonationListing,
  CompletedRescueRecord,
  FoodCategory,
} from './data/rescueData';
import { BatchThumbnail } from './components/BatchThumbnail';
import { RescueImpactMeter } from './components/RescueImpactMeter';
import { DispatchMap } from './components/DispatchMap';
import { ClaimRescueModal } from './components/ClaimRescueModal';
import { DonorPostForm } from './components/DonorPostForm';
import { ActiveRoutesView } from './components/ActiveRoutesView';
import { ImpactLedgerView } from './components/ImpactLedgerView';

type ActiveTab = 'dispatch' | 'routes' | 'post' | 'ledger';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dispatch');
  const [donations, setDonations] = useState<DonationListing[]>(INITIAL_DONATIONS);
  const [ledgerRecords, setLedgerRecords] = useState<CompletedRescueRecord[]>(INITIAL_LEDGER);

  // Filter & Search State for Live Dispatch
  const [categoryFilter, setCategoryFilter] = useState<'All' | FoodCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [criticalOnly, setCriticalOnly] = useState(false);

  // Selected batch for Map Inspector & Claim Modal
  const [selectedMapBatchId, setSelectedMapBatchId] = useState<string>(INITIAL_DONATIONS[0].id);
  const [claimModalBatch, setClaimModalBatch] = useState<DonationListing | null>(null);

  // Toast feedback banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live 1-second countdown ticker for perishable windows
  useEffect(() => {
    const timer = setInterval(() => {
      setDonations((prev) =>
        prev.map((item) => {
          if (item.status !== 'available') return item;
          return {
            ...item,
            remainingSeconds: item.remainingSeconds > 60 ? item.remainingSeconds - 1 : 60,
          };
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-dismiss notification banner
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 5000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  // Filtered donations for feed
  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      if (d.status === 'completed') return false;
      const matchesCat = categoryFilter === 'All' || d.category === categoryFilter;
      const matchesCritical = !criticalOnly || (d.remainingSeconds < 1800 && d.status === 'available');
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.donorName.toLowerCase().includes(q) ||
        d.itemTitle.toLowerCase().includes(q) ||
        d.neighborhood.toLowerCase().includes(q) ||
        d.matchedRecipient.toLowerCase().includes(q);
      return matchesCat && matchesCritical && matchesSearch;
    });
  }, [donations, categoryFilter, criticalOnly, searchQuery]);

  const selectedMapBatch = useMemo(() => {
    return (
      donations.find((d) => d.id === selectedMapBatchId && d.status !== 'completed') ||
      filteredDonations[0] ||
      null
    );
  }, [donations, selectedMapBatchId, filteredDonations]);

  const claimedBatches = useMemo(
    () => donations.filter((d) => d.status === 'claimed'),
    [donations]
  );

  // Impact Metrics (Base weekly + dynamic ledger additions)
  const impactStats = useMemo(() => {
    const ledgerLbs = ledgerRecords.reduce((sum, r) => sum + r.weightLbs, 0);
    const ledgerMeals = ledgerRecords.reduce((sum, r) => sum + r.mealsProvided, 0);
    const ledgerCo2Kg = ledgerRecords.reduce((sum, r) => sum + r.co2AvertedKg, 0);
    return {
      totalPounds: 4380 + ledgerLbs,
      totalMeals: 3640 + ledgerMeals,
      totalCo2Tons: +((1750 + ledgerCo2Kg) / 1000).toFixed(2),
    };
  }, [ledgerRecords]);

  // Handlers
  const handleConfirmClaim = (batchId: string, courierName: string, probeTempF: number) => {
    setDonations((prev) =>
      prev.map((d) =>
        d.id === batchId
          ? {
              ...d,
              status: 'claimed',
              claimedBy: courierName,
              claimedAt: 'Just now',
              verifiedTempF: probeTempF,
            }
          : d
      )
    );
    const target = donations.find((d) => d.id === batchId);
    setClaimModalBatch(null);
    setToastMessage(
      `Route claimed for ${target?.donorName}. Handoff PIN #${target?.handoffPin} unlocked in Active Routes.`
    );
  };

  const handleCompleteHandoff = (batchId: string, finalTempF: string) => {
    const batch = donations.find((d) => d.id === batchId);
    if (!batch) return;

    const newRecord: CompletedRescueRecord = {
      id: `LOG-${Math.floor(3943 + Math.random() * 900)}`,
      timestamp: 'Just now',
      donorName: batch.donorName,
      category: batch.category,
      itemSummary: batch.itemTitle,
      recipientPantry: batch.matchedRecipient,
      weightLbs: batch.weightLbs,
      mealsProvided: Math.round(batch.weightLbs * 0.83),
      co2AvertedKg: +(batch.weightLbs * 0.42).toFixed(1),
      verifiedTempF: finalTempF,
      courierName: batch.claimedBy || 'Volunteer Courier',
    };

    setLedgerRecords((prev) => [newRecord, ...prev]);
    setDonations((prev) =>
      prev.map((d) => (d.id === batchId ? { ...d, status: 'completed' } : d))
    );
    setToastMessage(
      `Handoff verified! +${batch.weightLbs} lbs delivered to ${batch.matchedRecipient}.`
    );
  };

  const handleAddDonation = (newBatch: DonationListing) => {
    setDonations((prev) => [newBatch, ...prev]);
    setSelectedMapBatchId(newBatch.id);
    setActiveTab('dispatch');
    setToastMessage(
      `Broadcast live: ${newBatch.weightLbs} lbs from ${newBatch.donorName} matched to ${newBatch.matchedRecipient}.`
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col pb-20 md:pb-12">
      {/* Top Navigation Bar (Strict 3-Zone Top Bar Contract) */}
      <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <a
          href="#dispatch"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('dispatch');
          }}
          className="text-lg font-extrabold tracking-[-0.02em] text-[#15803D] whitespace-nowrap shrink-0"
        >
          HarvestLoop
        </a>

        {/* Zone 2: 4 Concise Single-Line Navigation Links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#3F493F]">
          <a
            href="#dispatch"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('dispatch');
            }}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'dispatch'
                ? 'border-[#15803D] text-[#0F172A]'
                : 'border-transparent hover:text-[#0F172A] hover:border-slate-300'
            }`}
          >
            Live Dispatch
          </a>
          <a
            href="#routes"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('routes');
            }}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'routes'
                ? 'border-[#15803D] text-[#0F172A]'
                : 'border-transparent hover:text-[#0F172A] hover:border-slate-300'
            }`}
          >
            Active Routes ({claimedBatches.length})
          </a>
          <a
            href="#post"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('post');
            }}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'post'
                ? 'border-[#15803D] text-[#0F172A]'
                : 'border-transparent hover:text-[#0F172A] hover:border-slate-300'
            }`}
          >
            Donor Post
          </a>
          <a
            href="#ledger"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('ledger');
            }}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'ledger'
                ? 'border-[#15803D] text-[#0F172A]'
                : 'border-transparent hover:text-[#0F172A] hover:border-slate-300'
            }`}
          >
            Impact Ledger
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('post')}
            className="min-h-[40px] px-4 py-2 rounded-full bg-[#15803D] hover:bg-[#14532D] text-xs font-bold text-white transition-transform active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Post Surplus Batch
          </button>
        </div>
      </header>

      {/* Main Content Container (Full 1440px Desktop Viewport Presence) */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 flex-1">
        {/* Live Confirmation Toast Banner */}
        {toastMessage && (
          <div
            role="status"
            className="bg-[#DCFCE7] border border-[#86EFAC] text-[#14532D] px-4 py-3 rounded-2xl flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
              {toastMessage}
            </span>
            <div className="flex items-center gap-3 shrink-0">
              {activeTab === 'dispatch' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('routes')}
                  className="underline font-bold text-[#14532D] hover:text-[#0F172A] whitespace-nowrap cursor-pointer"
                >
                  Open Active Routes
                </button>
              )}
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-xs text-[#14532D]/70 hover:text-[#14532D] cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: LIVE DISPATCH TERMINAL */}
        {activeTab === 'dispatch' && (
          <>
            {/* Custom Component: Rescue Impact Meter */}
            <RescueImpactMeter
              totalPoundsRescued={impactStats.totalPounds}
              totalMealsProvided={impactStats.totalMeals}
              totalCo2MetricTons={impactStats.totalCo2Tons}
              activeVolunteersCount={18 + claimedBatches.length}
              onViewLedger={() => setActiveTab('ledger')}
            />

            {/* Operational Filter & Search Toolbar */}
            <section
              aria-label="Filter and search rescue listings"
              className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2"
            >
              {/* Logistical Category Tabs: Pill-shaped sliding container with #F1F5F9 track and elevated #FFFFFF thumb */}
              <div className="flex items-center gap-1 p-1.5 bg-[#F1F5F9] rounded-full overflow-x-auto">
                {(['All', 'Bakery', 'Produce', 'Prepared Meals', 'Cold Chain Dairy'] as const).map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`min-h-[40px] px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-white text-[#0F172A] shadow-xs'
                          : 'text-[#3F493F] hover:text-[#0F172A]'
                      }`}
                    >
                      {cat === 'All' ? 'All Perishables' : cat}
                    </button>
                  )
                )}
              </div>

              {/* Search Input & Critical Window (<30m) Checkbox Toggle */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* 20px Checkbox Filter for Critical Window (<30 mins) */}
                <button
                  type="button"
                  onClick={() => setCriticalOnly(!criticalOnly)}
                  className={`min-h-[48px] px-4 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    criticalOnly
                      ? 'bg-[#FEE2E2]/50 border-[#DC2626] text-[#93000B]'
                      : 'bg-white border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      criticalOnly
                        ? 'bg-[#15803D] text-white'
                        : 'bg-white border border-[#CBD5E1]'
                    }`}
                  >
                    {criticalOnly && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </span>
                  <span>Critical Window (&lt;30m) Only</span>
                </button>

                {/* Input Field: 48px min height, rounded-xl, #FFFFFF surface, #CBD5E1 border, #15803D focus ring */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter bakery, neighborhood, pantry..."
                    aria-label="Filter donation batches"
                    className="w-full min-h-[48px] pl-10 pr-4 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#15803D] focus:ring-3 focus:ring-[#15803D]/15"
                  />
                </div>
              </div>
            </section>

            {/* Split Terminal Grid: 7-Col Rescue Feed + 5-Col Interactive Donor Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Perishable Donation Listing Cards */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-[18px] font-semibold text-[#0F172A]">
                    Active Perishable Rescue Windows ({filteredDonations.length})
                  </h2>
                  <span className="text-xs text-[#64748B] tabular-nums">
                    Sorted by urgency countdown
                  </span>
                </div>

                {filteredDonations.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center shadow-harvest-1 border border-slate-900/5">
                    <p className="text-base font-semibold text-[#0F172A]">
                      No perishable batches match your current filter
                    </p>
                    <p className="text-xs text-[#64748B] mt-1">
                      Try clearing the critical window filter or resetting your category selection.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryFilter('All');
                        setCriticalOnly(false);
                        setSearchQuery('');
                      }}
                      className="mt-4 min-h-[44px] px-5 rounded-full bg-white border-[1.5px] border-[#E2E8F0] text-xs font-semibold text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  filteredDonations.map((batch) => {
                    const isCritical =
                      batch.remainingSeconds < 1800 && batch.status === 'available';
                    const isSelectedOnMap = selectedMapBatch?.id === batch.id;

                    return (
                      <article
                        key={batch.id}
                        onClick={() => setSelectedMapBatchId(batch.id)}
                        className={`bg-white rounded-2xl p-4 sm:p-5 transition-all cursor-pointer border ${
                          isSelectedOnMap
                            ? 'border-[#15803D] shadow-harvest-2'
                            : 'border-slate-900/5 shadow-harvest-1 hover:shadow-harvest-2'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                          {/* Hero Thumbnail with rounded-xl corners */}
                          <BatchThumbnail
                            type={batch.illustrationType}
                            className="w-full sm:w-24 h-32 sm:h-24 shrink-0"
                          />

                          <div className="flex-1 min-w-0 w-full">
                            {/* Unboxed Metadata Kicker Line (Zero-Pill Discipline) */}
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                              <div className="flex items-center gap-1.5 text-[#64748B] flex-wrap">
                                <span
                                  className={`font-bold uppercase tracking-[0.04em] text-[11px] ${
                                    batch.category === 'Bakery'
                                      ? 'text-[#B45309]'
                                      : batch.category === 'Produce'
                                      ? 'text-[#15803D]'
                                      : 'text-[#0F172A]'
                                  }`}
                                >
                                  {batch.category}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{batch.neighborhood}</span>
                                <span aria-hidden="true">·</span>
                                <span className="font-semibold text-[#0F172A] tabular-nums">
                                  {batch.distanceMiles} mi
                                </span>
                                {batch.requiresColdChain && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="inline-flex items-center gap-1 text-[#15803D] font-semibold tabular-nums">
                                      <ThermometerSnowflake className="w-3 h-3" />
                                      &le;{batch.targetTempF}°F Cold Chain
                                    </span>
                                  </>
                                )}
                              </div>

                              {/* Live Ticking Urgency Countdown Meter */}
                              <div
                                className={`font-mono-tabular text-xs font-bold flex items-center gap-1 shrink-0 ${
                                  batch.status === 'claimed'
                                    ? 'text-[#15803D]'
                                    : isCritical
                                    ? 'text-[#DC2626]'
                                    : 'text-[#B45309]'
                                }`}
                              >
                                <Clock className="w-3.5 h-3.5 shrink-0" />
                                {batch.status === 'claimed'
                                  ? 'Claimed · En Route'
                                  : isCritical
                                  ? `Critical · ${formatCountdown(batch.remainingSeconds)}`
                                  : `${formatCountdown(batch.remainingSeconds)} window`}
                              </div>
                            </div>

                            {/* Donor Bakery / Market Title & Batch Headline */}
                            <div className="mt-1.5 flex items-baseline justify-between gap-3">
                              <h3 className="text-[18px] font-bold text-[#0F172A] leading-6 truncate">
                                {batch.donorName}
                              </h3>
                              <span className="text-base font-extrabold text-[#0F172A] tabular-nums shrink-0">
                                {batch.weightLbs} lbs · {batch.crateCount} crates
                              </span>
                            </div>

                            <p className="text-sm font-semibold text-[#3F493F] mt-0.5">
                              {batch.itemTitle}
                            </p>
                            <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                              {batch.description}
                            </p>

                            {/* Card Footer: Matched Pantry + Primary Rescue Action Button */}
                            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="text-xs text-[#3F493F] flex items-center gap-1.5 flex-wrap">
                                <MapPin className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                                <span>{batch.address}</span>
                                <ArrowRight className="w-3 h-3 text-[#64748B] shrink-0" />
                                <span className="font-semibold text-[#0F172A]">
                                  {batch.matchedRecipient}
                                </span>
                              </div>

                              {batch.status === 'available' ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setClaimModalBatch(batch);
                                  }}
                                  className={`min-h-[48px] px-6 rounded-full text-xs font-bold text-white transition-all active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer ${
                                    isCritical
                                      ? 'bg-[#DC2626] hover:bg-[#B91C1C] shadow-critical-glow'
                                      : 'bg-[#15803D] hover:bg-[#14532D]'
                                  }`}
                                >
                                  {isCritical ? 'Immediate Dispatch' : 'Claim Rescue'}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTab('routes');
                                  }}
                                  className="min-h-[44px] px-5 rounded-full bg-white border-[1.5px] border-[#E2E8F0] text-xs font-semibold text-[#15803D] hover:bg-[#F1F5F9] whitespace-nowrap shrink-0 cursor-pointer"
                                >
                                  View Transit Route →
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>

              {/* Right Column: Sticky Split-Terminal Neighborhood Verification Map */}
              <div className="lg:col-span-5 lg:sticky lg:top-20">
                <DispatchMap
                  donations={filteredDonations.length > 0 ? filteredDonations : donations}
                  selectedBatch={selectedMapBatch}
                  onSelectBatch={(batch) => setSelectedMapBatchId(batch.id)}
                  onOpenClaimModal={(batch) => setClaimModalBatch(batch)}
                  formatCountdown={formatCountdown}
                />
              </div>
            </div>
          </>
        )}

        {/* TAB 2: ACTIVE RESCUE ROUTES */}
        {activeTab === 'routes' && (
          <ActiveRoutesView
            claimedBatches={claimedBatches}
            onCompleteHandoff={handleCompleteHandoff}
            onBrowseAvailable={() => setActiveTab('dispatch')}
          />
        )}

        {/* TAB 3: DONOR POST SURPLUS FORM */}
        {activeTab === 'post' && (
          <DonorPostForm
            onAddDonation={handleAddDonation}
            onCancel={() => setActiveTab('dispatch')}
          />
        )}

        {/* TAB 4: COMMUNITY IMPACT AUDIT LEDGER */}
        {activeTab === 'ledger' && <ImpactLedgerView records={ledgerRecords} />}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="mt-12 border-t border-slate-200/70 bg-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div>
            HarvestLoop Community Logistics · Bill Emerson Good Samaritan Food Donation Act Compliant
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('dispatch')}
              className="hover:text-[#0F172A] cursor-pointer"
            >
              Dispatch Board
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('post')}
              className="hover:text-[#0F172A] cursor-pointer"
            >
              Donor Portal
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ledger')}
              className="hover:text-[#0F172A] cursor-pointer"
            >
              Cold-Chain Audit Log
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Natural Thumb Zone, <15% Sticky Cap) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-15 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-4 items-center px-2"
      >
        <button
          type="button"
          onClick={() => setActiveTab('dispatch')}
          className={`min-h-[48px] flex flex-col items-center justify-center cursor-pointer ${
            activeTab === 'dispatch' ? 'text-[#15803D] font-bold' : 'text-[#64748B] font-medium'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Dispatch</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('routes')}
          className={`min-h-[48px] flex flex-col items-center justify-center cursor-pointer ${
            activeTab === 'routes' ? 'text-[#15803D] font-bold' : 'text-[#64748B] font-medium'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">
            Routes ({claimedBatches.length})
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('post')}
          className={`min-h-[48px] flex flex-col items-center justify-center cursor-pointer ${
            activeTab === 'post' ? 'text-[#15803D] font-bold' : 'text-[#64748B] font-medium'
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Post Batch</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ledger')}
          className={`min-h-[48px] flex flex-col items-center justify-center cursor-pointer ${
            activeTab === 'ledger' ? 'text-[#15803D] font-bold' : 'text-[#64748B] font-medium'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Ledger</span>
        </button>
      </nav>

      {/* Claim & Cold-Chain Verification Modal */}
      <ClaimRescueModal
        batch={claimModalBatch}
        onClose={() => setClaimModalBatch(null)}
        onConfirmClaim={handleConfirmClaim}
        formatCountdown={formatCountdown}
      />
    </div>
  );
}
