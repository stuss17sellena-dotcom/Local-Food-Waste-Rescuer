export type FoodCategory = 'Bakery' | 'Produce' | 'Prepared Meals' | 'Cold Chain Dairy';

export interface DonationListing {
  id: string;
  donorName: string;
  donorType: string;
  neighborhood: string;
  address: string;
  distanceMiles: number;
  category: FoodCategory;
  itemTitle: string;
  description: string;
  weightLbs: number;
  crateCount: number;
  remainingSeconds: number;
  requiresColdChain: boolean;
  targetTempF?: number;
  allergenLabeled: boolean;
  stackableCrates: boolean;
  matchedRecipient: string;
  recipientAddress: string;
  handoffPin: string;
  status: 'available' | 'claimed' | 'completed';
  claimedBy?: string;
  claimedAt?: string;
  verifiedTempF?: number;
  mapCoords: { x: number; y: number };
  recipientCoords: { x: number; y: number };
  illustrationType: 'sourdough' | 'heirloom_produce' | 'prepared_trays' | 'cultured_dairy' | 'citrus_crates' | 'pastries';
}

export interface CompletedRescueRecord {
  id: string;
  timestamp: string;
  donorName: string;
  category: FoodCategory;
  itemSummary: string;
  recipientPantry: string;
  weightLbs: number;
  mealsProvided: number;
  co2AvertedKg: number;
  verifiedTempF: string;
  courierName: string;
}

export const INITIAL_DONATIONS: DonationListing[] = [
  {
    id: 'RES-804',
    donorName: 'Tartine & Hearth Bakehouse',
    donorType: 'Artisan Bakery',
    neighborhood: 'Mission District',
    address: '600 Guerrero St, Bay 2',
    distanceMiles: 0.4,
    category: 'Bakery',
    itemTitle: 'Country Sourdough Loaves & Morning Viennoiserie',
    description: '28 whole country loaves, 36 laminated croissants, and 18 seed baguettes baked at 5:00 AM today. Packed in breathable linen-lined bakery lugs.',
    weightLbs: 48,
    crateCount: 4,
    remainingSeconds: 1420, // ~23 mins (Critical Window <30m)
    requiresColdChain: false,
    allergenLabeled: true,
    stackableCrates: true,
    matchedRecipient: 'St. Anthony Dining Room',
    recipientAddress: '150 Golden Gate Ave',
    handoffPin: '4829',
    status: 'available',
    mapCoords: { x: 28, y: 42 },
    recipientCoords: { x: 46, y: 24 },
    illustrationType: 'sourdough',
  },
  {
    id: 'RES-809',
    donorName: 'Greenleaf Organics Co-op',
    donorType: 'Neighborhood Grocer',
    neighborhood: 'Noe Valley',
    address: '3915 24th St, Loading Dock B',
    distanceMiles: 0.8,
    category: 'Produce',
    itemTitle: 'Hydroponic Baby Greens, Heirloom Tomatoes & Avocados',
    description: 'First-grade surplus farm boxes from Salinas Valley morning harvest. Pre-washed triple-rinsed spinach clamshells and vine-ripened tomatoes.',
    weightLbs: 84,
    crateCount: 6,
    remainingSeconds: 1185, // ~19 mins (Critical Window <30m)
    requiresColdChain: true,
    targetTempF: 38,
    allergenLabeled: true,
    stackableCrates: true,
    matchedRecipient: 'Mission Community Market Pantry',
    recipientAddress: '790 Valencia St',
    handoffPin: '9104',
    status: 'available',
    mapCoords: { x: 35, y: 68 },
    recipientCoords: { x: 52, y: 54 },
    illustrationType: 'heirloom_produce',
  },
  {
    id: 'RES-812',
    donorName: 'Nopa Culinary Commissary',
    donorType: 'Catering Kitchen',
    neighborhood: 'Western Addition',
    address: '560 Divisadero St',
    distanceMiles: 1.2,
    category: 'Prepared Meals',
    itemTitle: 'Blast-Chilled Herb Roasted Chicken & Farro Bowls',
    description: 'Unserved corporate catering hotel pans, blast-chilled to 35°F immediately after kitchen prep. Time-temperature logs attached to each lid.',
    weightLbs: 62,
    crateCount: 5,
    remainingSeconds: 3240, // 54 mins
    requiresColdChain: true,
    targetTempF: 36,
    allergenLabeled: true,
    stackableCrates: true,
    matchedRecipient: 'Haight Ashbury Food Program',
    recipientAddress: '1525 Waller St',
    handoffPin: '6371',
    status: 'available',
    mapCoords: { x: 64, y: 36 },
    recipientCoords: { x: 76, y: 48 },
    illustrationType: 'prepared_trays',
  },
  {
    id: 'RES-815',
    donorName: 'Cowgirl Creamery Depot',
    donorType: 'Dairy & Creamery',
    neighborhood: 'Dogpatch',
    address: '2195 3rd St, Cold Bay 1',
    distanceMiles: 1.7,
    category: 'Cold Chain Dairy',
    itemTitle: 'Organic Whole Milk Gallons, Greek Yogurt & Cultured Butter',
    description: '5 days prior to printed sell-by date. Strictly maintained at 34°F in walk-in cooler. Requires insulated thermal blankets for transport.',
    weightLbs: 96,
    crateCount: 8,
    remainingSeconds: 4680, // 78 mins
    requiresColdChain: true,
    targetTempF: 35,
    allergenLabeled: true,
    stackableCrates: true,
    matchedRecipient: 'Bayview Senior Nutrition Center',
    recipientAddress: '1753 Carroll Ave',
    handoffPin: '3058',
    status: 'available',
    mapCoords: { x: 78, y: 72 },
    recipientCoords: { x: 84, y: 86 },
    illustrationType: 'cultured_dairy',
  },
  {
    id: 'RES-819',
    donorName: 'Alemany Farmers Collective',
    donorType: 'Open-Air Market',
    neighborhood: 'Bernal Heights',
    address: '100 Alemany Blvd, Stall 14',
    distanceMiles: 2.1,
    category: 'Produce',
    itemTitle: 'Navel Oranges, Fuji Apples & Sweet Potatoes',
    description: 'Orchard-packed vented wooden crates from Fresno family farms. Ambient temperature stable and ready for immediate neighborhood distribution.',
    weightLbs: 120,
    crateCount: 8,
    remainingSeconds: 5940, // 99 mins
    requiresColdChain: false,
    allergenLabeled: true,
    stackableCrates: true,
    matchedRecipient: 'Excelsior Family Resource Hub',
    recipientAddress: '4468 Mission St',
    handoffPin: '7721',
    status: 'available',
    mapCoords: { x: 48, y: 84 },
    recipientCoords: { x: 62, y: 78 },
    illustrationType: 'citrus_crates',
  },
  {
    id: 'RES-801',
    donorName: 'B. Patisserie Roastery',
    donorType: 'Artisan Bakery',
    neighborhood: 'Lower Pacific Heights',
    address: '2821 California St',
    distanceMiles: 0.9,
    category: 'Bakery',
    itemTitle: 'Kouign-Amann, Brioche Loaves & Savory Quiche Trays',
    description: 'End-of-morning pastry bake packaged in food-grade parchment boxes. Quiche trays chilled at 37°F.',
    weightLbs: 38,
    crateCount: 3,
    remainingSeconds: 2100, // 35 mins
    requiresColdChain: true,
    targetTempF: 38,
    allergenLabeled: true,
    stackableCrates: false,
    matchedRecipient: 'Booker T. Washington Community Kitchen',
    recipientAddress: '800 Presidio Ave',
    handoffPin: '5512',
    status: 'claimed',
    claimedBy: 'Maya Lin (Volunteer Van #04)',
    claimedAt: '14 mins ago',
    verifiedTempF: 37.2,
    mapCoords: { x: 22, y: 22 },
    recipientCoords: { x: 34, y: 18 },
    illustrationType: 'pastries',
  },
];

export const INITIAL_LEDGER: CompletedRescueRecord[] = [
  {
    id: 'LOG-3942',
    timestamp: 'Today · 1:40 PM',
    donorName: 'Acme Bread Co. Ferry Terminal',
    category: 'Bakery',
    itemSummary: '45 Sweet Batards & Walnut Levain Rounds',
    recipientPantry: 'Glide Memorial Daily Free Meals',
    weightLbs: 64,
    mealsProvided: 53,
    co2AvertedKg: 26.8,
    verifiedTempF: 'Ambient (66°F)',
    courierName: 'Carlos M.',
  },
  {
    id: 'LOG-3941',
    timestamp: 'Today · 12:15 PM',
    donorName: 'Bi-Rite Market 18th St',
    category: 'Prepared Meals',
    itemSummary: 'Chilled Lentil Soup Quarts & Roasted Root Vegetables',
    recipientPantry: 'Mission Neighborhood Resource Center',
    weightLbs: 92,
    mealsProvided: 76,
    co2AvertedKg: 38.6,
    verifiedTempF: '36.4°F Verified',
    courierName: 'Elena R.',
  },
  {
    id: 'LOG-3940',
    timestamp: 'Today · 10:50 AM',
    donorName: 'Rainbow Grocery Cooperative',
    category: 'Produce',
    itemSummary: 'Organic Lacinato Kale, Broccoli Crowns & Bell Peppers',
    recipientPantry: 'La Raza Community Resource Center',
    weightLbs: 138,
    mealsProvided: 115,
    co2AvertedKg: 57.9,
    verifiedTempF: '38.1°F Verified',
    courierName: 'Devon K.',
  },
  {
    id: 'LOG-3939',
    timestamp: 'Today · 9:30 AM',
    donorName: 'Straus Family Creamery Hub',
    category: 'Cold Chain Dairy',
    itemSummary: 'Organic Cream-Top Milk & Plain Yogurt Tubs',
    recipientPantry: 'St. Vincent de Paul Multi-Service Center',
    weightLbs: 110,
    mealsProvided: 91,
    co2AvertedKg: 46.2,
    verifiedTempF: '34.8°F Verified',
    courierName: 'Maya L.',
  },
  {
    id: 'LOG-3938',
    timestamp: 'Yesterday · 5:20 PM',
    donorName: 'Josey Baker Bread & Mill',
    category: 'Bakery',
    itemSummary: 'Whole Grain Rye Loaves & Seeded Country Bread',
    recipientPantry: 'Haight Ashbury Food Program',
    weightLbs: 52,
    mealsProvided: 43,
    co2AvertedKg: 21.8,
    verifiedTempF: 'Ambient (68°F)',
    courierName: 'Samir P.',
  },
];
