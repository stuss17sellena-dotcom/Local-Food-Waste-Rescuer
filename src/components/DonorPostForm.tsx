import React, { useState } from 'react';
import { Check, PlusCircle, ThermometerSnowflake, Clock, Sparkles } from 'lucide-react';
import { DonationListing, FoodCategory } from '../data/rescueData';
import { BatchThumbnail } from './BatchThumbnail';

interface DonorPostFormProps {
  onAddDonation: (newBatch: DonationListing) => void;
  onCancel: () => void;
}

const NEIGHBORHOOD_PRESETS = [
  { name: 'Mission District', coords: { x: 32, y: 48 }, recipient: 'Mission Community Market Pantry', recipientAddress: '790 Valencia St', recipientCoords: { x: 48, y: 54 } },
  { name: 'Noe Valley', coords: { x: 38, y: 72 }, recipient: 'St. Anthony Dining Room', recipientAddress: '150 Golden Gate Ave', recipientCoords: { x: 46, y: 24 } },
  { name: 'Western Addition', coords: { x: 58, y: 34 }, recipient: 'Haight Ashbury Food Program', recipientAddress: '1525 Waller St', recipientCoords: { x: 72, y: 46 } },
  { name: 'Dogpatch', coords: { x: 76, y: 68 }, recipient: 'Bayview Senior Nutrition Center', recipientAddress: '1753 Carroll Ave', recipientCoords: { x: 84, y: 84 } },
];

export const DonorPostForm: React.FC<DonorPostFormProps> = ({ onAddDonation, onCancel }) => {
  const [donorName, setDonorName] = useState('Arizmendi Bakery Cooperative');
  const [address, setAddress] = useState('1268 Valencia St, Loading Zone');
  const [neighborhoodIdx, setNeighborhoodIdx] = useState(0);
  const [category, setCategory] = useState<FoodCategory>('Bakery');
  const [itemTitle, setItemTitle] = useState('Warm Sourdough Focaccia Trays & Cornmeal Muffins');
  const [description, setDescription] = useState('Fresh from afternoon bake cycle. Packed in food-safe parchment-lined bakery lugs ready for immediate van transfer.');
  const [weightLbs, setWeightLbs] = useState(54);
  const [crateCount, setCrateCount] = useState(4);
  const [windowMinutes, setWindowMinutes] = useState(25);
  const [requiresColdChain, setRequiresColdChain] = useState(false);
  const [targetTempF, setTargetTempF] = useState(38);
  const [allergenLabeled, setAllergenLabeled] = useState(true);
  const [stackableCrates, setStackableCrates] = useState(true);

  const selectedPreset = NEIGHBORHOOD_PRESETS[neighborhoodIdx];
  const estimatedMeals = Math.round(weightLbs * 0.83);
  const estimatedCo2Kg = +(weightLbs * 0.42).toFixed(1);

  const getIllustrationForCategory = (cat: FoodCategory): DonationListing['illustrationType'] => {
    switch (cat) {
      case 'Bakery':
        return 'sourdough';
      case 'Produce':
        return 'heirloom_produce';
      case 'Prepared Meals':
        return 'prepared_trays';
      case 'Cold Chain Dairy':
        return 'cultured_dairy';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomId = `RES-${Math.floor(820 + Math.random() * 170)}`;
    const randomPin = String(Math.floor(1000 + Math.random() * 9000));

    const newBatch: DonationListing = {
      id: randomId,
      donorName: donorName.trim() || 'Neighborhood Food Partner',
      donorType: category === 'Bakery' ? 'Artisan Bakery' : category === 'Produce' ? 'Farm Market' : 'Culinary Kitchen',
      neighborhood: selectedPreset.name,
      address: address.trim() || 'Main Loading Bay',
      distanceMiles: +(0.3 + Math.random() * 1.4).toFixed(1),
      category,
      itemTitle: itemTitle.trim() || 'Surplus Harvest Batch',
      description: description.trim() || 'Packaged in sanitized food-grade crates.',
      weightLbs: Number(weightLbs) || 35,
      crateCount: Number(crateCount) || 3,
      remainingSeconds: windowMinutes * 60,
      requiresColdChain,
      targetTempF: requiresColdChain ? Number(targetTempF) : undefined,
      allergenLabeled,
      stackableCrates,
      matchedRecipient: selectedPreset.recipient,
      recipientAddress: selectedPreset.recipientAddress,
      handoffPin: randomPin,
      status: 'available',
      mapCoords: selectedPreset.coords,
      recipientCoords: selectedPreset.recipientCoords,
      illustrationType: getIllustrationForCategory(category),
    };

    onAddDonation(newBatch);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-harvest-1 border border-slate-900/5 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold text-[#15803D] tracking-wide">
            Donor Dispatch Portal · Instant Pantry Matching
          </span>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#0F172A] tracking-[-0.02em] mt-1">
            Post Surplus Perishable Batch
          </h1>
          <p className="text-sm text-[#3F493F] mt-1">
            Broadcast available food to nearby vetted volunteer drivers and receiving community kitchens.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <BatchThumbnail type={getIllustrationForCategory(category)} className="w-16 h-16" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="pt-6 space-y-6">
        {/* Category Segmented Control */}
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-2">
            Perishable Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-[#F1F5F9] rounded-2xl">
            {(['Bakery', 'Produce', 'Prepared Meals', 'Cold Chain Dairy'] as FoodCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  if (cat === 'Cold Chain Dairy' || cat === 'Prepared Meals') {
                    setRequiresColdChain(true);
                  }
                }}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  category === cat
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Donor Name & Neighborhood */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="donor-name" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Donor Bakery, Grocer, or Kitchen Name
            </label>
            <input
              id="donor-name"
              type="text"
              required
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="e.g. Tartine Manufactory"
              className="w-full min-h-[48px] px-4 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#15803D] focus:ring-3 focus:ring-[#15803D]/15"
            />
          </div>

          <div>
            <label htmlFor="neighborhood-select" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Neighborhood Sector (Auto-Pairs Receiving Pantry)
            </label>
            <select
              id="neighborhood-select"
              value={neighborhoodIdx}
              onChange={(e) => setNeighborhoodIdx(Number(e.target.value))}
              className="w-full min-h-[48px] px-4 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-none focus:border-[#15803D] focus:ring-3 focus:ring-[#15803D]/15"
            >
              {NEIGHBORHOOD_PRESETS.map((preset, idx) => (
                <option key={preset.name} value={idx}>
                  {preset.name} → {preset.recipient}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pickup Street Address & Item Headline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pickup-address" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Pickup Street Address &amp; Dock Instructions
            </label>
            <input
              id="pickup-address"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street address and bay/door number"
              className="w-full min-h-[48px] px-4 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#15803D] focus:ring-3 focus:ring-[#15803D]/15"
            />
          </div>

          <div>
            <label htmlFor="item-title" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Batch Contents Summary
            </label>
            <input
              id="item-title"
              type="text"
              required
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              placeholder="e.g. 30 Country Sourdough Loaves & Pastries"
              className="w-full min-h-[48px] px-4 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#15803D] focus:ring-3 focus:ring-[#15803D]/15"
            />
          </div>
        </div>

        {/* Weight, Crates, and Pickup Window */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="weight-lbs" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Estimated Weight (lbs)
            </label>
            <input
              id="weight-lbs"
              type="number"
              min="5"
              max="2000"
              required
              value={weightLbs}
              onChange={(e) => setWeightLbs(Number(e.target.value))}
              className="w-full min-h-[48px] px-4 rounded-xl bg-white border border-[#CBD5E1] text-base font-bold tabular-nums text-[#0F172A] focus:outline-none focus:border-[#15803D] focus:ring-3 focus:ring-[#15803D]/15"
            />
          </div>

          <div>
            <label htmlFor="crate-count" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Total Crates / Trays
            </label>
            <input
              id="crate-count"
              type="number"
              min="1"
              max="60"
              required
              value={crateCount}
              onChange={(e) => setCrateCount(Number(e.target.value))}
              className="w-full min-h-[48px] px-4 rounded-xl bg-white border border-[#CBD5E1] text-base font-bold tabular-nums text-[#0F172A] focus:outline-none focus:border-[#15803D] focus:ring-3 focus:ring-[#15803D]/15"
            />
          </div>

          <div>
            <label htmlFor="window-select" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Pickup Closing Window
            </label>
            <select
              id="window-select"
              value={windowMinutes}
              onChange={(e) => setWindowMinutes(Number(e.target.value))}
              className="w-full min-h-[48px] px-4 rounded-xl bg-white border border-[#CBD5E1] text-sm font-semibold tabular-nums text-[#0F172A] focus:outline-none focus:border-[#15803D] focus:ring-3 focus:ring-[#15803D]/15"
            >
              <option value={20}>20 mins (Critical Alert &lt;30m)</option>
              <option value={25}>25 mins (Critical Alert &lt;30m)</option>
              <option value={45}>45 mins (Standard Window)</option>
              <option value={75}>75 mins (Standard Window)</option>
              <option value={120}>120 mins (Flexible Pickup)</option>
            </select>
          </div>
        </div>

        {/* Handling Notes */}
        <div>
          <label htmlFor="batch-notes" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
            Packaging &amp; Handling Notes
          </label>
          <textarea
            id="batch-notes"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#15803D] focus:ring-3 focus:ring-[#15803D]/15"
          />
        </div>

        {/* Checkboxes (20px squares with rounded-md and #15803D checked state) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-semibold text-[#0F172A] uppercase tracking-[0.04em] mb-3">
            Cold-Chain &amp; Safety Verification Flags
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setRequiresColdChain(!requiresColdChain)}
              className="min-h-[48px] p-3 rounded-xl border border-slate-200 hover:bg-[#F8FAFC] flex items-center gap-3 text-left transition-colors cursor-pointer"
            >
              <span
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                  requiresColdChain ? 'bg-[#15803D] text-white' : 'bg-white border border-[#CBD5E1]'
                }`}
              >
                {requiresColdChain && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </span>
              <span className="text-xs font-medium text-[#0F172A]">
                Requires Cold-Chain (&le;{targetTempF}°F)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAllergenLabeled(!allergenLabeled)}
              className="min-h-[48px] p-3 rounded-xl border border-slate-200 hover:bg-[#F8FAFC] flex items-center gap-3 text-left transition-colors cursor-pointer"
            >
              <span
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                  allergenLabeled ? 'bg-[#15803D] text-white' : 'bg-white border border-[#CBD5E1]'
                }`}
              >
                {allergenLabeled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </span>
              <span className="text-xs font-medium text-[#0F172A]">
                Allergens &amp; Prep Time Labeled
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStackableCrates(!stackableCrates)}
              className="min-h-[48px] p-3 rounded-xl border border-slate-200 hover:bg-[#F8FAFC] flex items-center gap-3 text-left transition-colors cursor-pointer"
            >
              <span
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                  stackableCrates ? 'bg-[#15803D] text-white' : 'bg-white border border-[#CBD5E1]'
                }`}
              >
                {stackableCrates && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </span>
              <span className="text-xs font-medium text-[#0F172A]">
                Stackable Transport Crates Ready
              </span>
            </button>
          </div>
        </div>

        {/* Live Impact Preview & Submit Row */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-[#3F493F] flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[#15803D]">Projected Rescue Impact:</span>
            <span className="font-bold text-[#0F172A] tabular-nums">{estimatedMeals} meals</span>
            <span aria-hidden="true">·</span>
            <span className="font-bold text-[#0F172A] tabular-nums">{estimatedCo2Kg} kg CO₂e averted</span>
            <span aria-hidden="true">·</span>
            <span>Auto-matched to {selectedPreset.recipient}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onCancel}
              className="min-h-[52px] px-6 rounded-full bg-white border-[1.5px] border-[#E2E8F0] text-sm font-semibold text-[#0F172A] hover:bg-[#F1F5F9] active:scale-[0.98] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[52px] px-7 rounded-full bg-[#15803D] hover:bg-[#14532D] text-sm font-bold text-white flex items-center gap-2 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              Broadcast Rescue Batch
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
