export type SpeciesCategoryId = 'all' | 'solitary' | 'bumblebee' | 'lepidoptera' | 'flora';

export interface SectorBiodiversityRecord {
  sector: string;
  shortSector: string;
  baseline: number; // 2022 pre-retrofit
  current: number;  // 2026 audited
  growthPct: number;
  activityRate: number; // visits/hr/100m²
  keySpeciesFound: string;
}

export interface TrajectoryPoint {
  year: string;
  count: number;
  projectedTarget: number;
  corridorConnectivityIndex: number; // 0-100 scale
}

export interface SpeciesCategoryConfig {
  id: SpeciesCategoryId;
  label: string;
  shortLabel: string;
  scientificScope: string;
  iconType: 'bug' | 'flower' | 'sparkles' | 'feather' | 'shield';
  description: string;
  conservationStatus: string;
  primaryColor: string;
  baselineColor: string;
  chartUnit: string;
  summaryStat: {
    label: string;
    value: string;
    subtitle: string;
  };
  sectorMetrics: SectorBiodiversityRecord[];
  trajectory: TrajectoryPoint[];
  notableFindings: string[];
}

export const BIODIVERSITY_CATEGORIES: Record<SpeciesCategoryId, SpeciesCategoryConfig> = {
  all: {
    id: 'all',
    label: 'All Monitored Pollinators',
    shortLabel: 'All Pollinators',
    scientificScope: 'Apoidea, Lepidoptera, Syrphidae & Anthophila',
    iconType: 'sparkles',
    description: 'Total documented insect pollinator species diversity across 52 verified rooftop sanctuaries, tracked via acoustic sensors, pan traps, and monthly pan-London ecologist sweep surveys.',
    conservationStatus: 'UK Priority Biodiversity Action Plan (BAP) target species group',
    primaryColor: '#10B981', // Emerald green
    baselineColor: '#94A3B8', // Slate grey for baseline
    chartUnit: 'Species Count',
    summaryStat: {
      label: 'Avg Species Increase',
      value: '+395%',
      subtitle: 'From 5.2 baseline to 25.8 species/site',
    },
    sectorMetrics: [
      { sector: 'Hotel Rooftop', shortSector: 'Hotel', baseline: 5.4, current: 31.8, growthPct: 488, activityRate: 84.5, keySpeciesFound: 'Red Mason Bee, Hummingbird Hawk-moth' },
      { sector: 'Cultural Arts Hub', shortSector: 'Arts Hub', baseline: 4.8, current: 29.2, growthPct: 508, activityRate: 78.2, keySpeciesFound: 'Wool Carder Bee, Common Blue Butterfly' },
      { sector: 'Commercial Office', shortSector: 'Corporate Office', baseline: 3.8, current: 26.5, growthPct: 597, activityRate: 72.0, keySpeciesFound: 'Tawny Mining Bee, Red Admiral' },
      { sector: 'Public Market', shortSector: 'Public Market', baseline: 5.8, current: 27.6, growthPct: 375, activityRate: 75.3, keySpeciesFound: 'Buff-tailed Bumblebee, Marmalade Hoverfly' },
      { sector: 'Civic Library', shortSector: 'Civic Library', baseline: 4.2, current: 24.1, growthPct: 473, activityRate: 64.8, keySpeciesFound: 'Field Cuckoo Bee, Small Tortoiseshell' },
      { sector: 'Housing Estate', shortSector: 'Housing Estate', baseline: 5.1, current: 23.4, growthPct: 358, activityRate: 62.5, keySpeciesFound: 'Early Bumblebee, Peacock Butterfly' },
      { sector: 'Secondary School', shortSector: 'Sec. School', baseline: 6.2, current: 25.0, growthPct: 303, activityRate: 69.1, keySpeciesFound: 'Leafcutter Bee, Brimstone Butterfly' },
      { sector: 'Primary School', shortSector: 'Prim. School', baseline: 5.9, current: 21.8, growthPct: 269, activityRate: 58.4, keySpeciesFound: 'Garden Bumblebee, Painted Lady' },
      { sector: 'Community Center', shortSector: 'Community', baseline: 5.5, current: 22.9, growthPct: 316, activityRate: 61.2, keySpeciesFound: 'Common Carder Bee, Large White' },
    ],
    trajectory: [
      { year: '2023 (Launch)', count: 9.4, projectedTarget: 8.0, corridorConnectivityIndex: 32 },
      { year: '2024 (Phase II)', count: 15.6, projectedTarget: 14.5, corridorConnectivityIndex: 56 },
      { year: '2025 (Expansion)', count: 21.3, projectedTarget: 19.0, corridorConnectivityIndex: 78 },
      { year: '2026 (Audited)', count: 25.8, projectedTarget: 22.5, corridorConnectivityIndex: 91 },
    ],
    notableFindings: [
      'Multi-tiered canopy planting increased species richness by 4.8x compared to sedum-only living roofs.',
      'Corridor nodes in Southwark and Islington recorded continuous gene-flow bridging Royal Parks to Thames marshes.',
      'Acoustic bio-sensors logged an average 72 pollinator flight visits per 100m² every sunny hour during July peak.',
    ],
  },

  solitary: {
    id: 'solitary',
    label: 'Solitary & Cavity-Nesting Bees',
    shortLabel: 'Solitary Bees',
    scientificScope: 'Megachilidae, Andrenidae, Colletidae & Halictidae',
    iconType: 'shield',
    description: 'Solitary bees are the most vulnerable urban pollinators. They do not live in colonial hives and require specialized bare-soil mud, hollow reeds, and deep substrate nesting habitats on rooftops.',
    conservationStatus: 'Over 40% of native solitary bee species in England face severe habitat loss',
    primaryColor: '#D97706', // Warm amber / ochre
    baselineColor: '#94A3B8',
    chartUnit: 'Species Count',
    summaryStat: {
      label: 'Solitary Species Surge',
      value: '+520%',
      subtitle: 'From 1.5 baseline to 9.3 species/site',
    },
    sectorMetrics: [
      { sector: 'Hotel Rooftop', shortSector: 'Hotel', baseline: 1.8, current: 11.2, growthPct: 522, activityRate: 34.2, keySpeciesFound: 'Osmia bicornis (Red Mason Bee)' },
      { sector: 'Cultural Arts Hub', shortSector: 'Arts Hub', baseline: 1.4, current: 10.5, growthPct: 650, activityRate: 31.0, keySpeciesFound: 'Anthidium manicatum (Wool Carder Bee)' },
      { sector: 'Commercial Office', shortSector: 'Corporate Office', baseline: 1.0, current: 9.8, growthPct: 880, activityRate: 28.5, keySpeciesFound: 'Andrena fulva (Tawny Mining Bee)' },
      { sector: 'Public Market', shortSector: 'Public Market', baseline: 1.7, current: 9.5, growthPct: 458, activityRate: 29.8, keySpeciesFound: 'Megachile centuncularis (Leafcutter)' },
      { sector: 'Civic Library', shortSector: 'Civic Library', baseline: 1.2, current: 8.9, growthPct: 641, activityRate: 25.4, keySpeciesFound: 'Hylaeus signatus (Yellow-faced Bee)' },
      { sector: 'Housing Estate', shortSector: 'Housing Estate', baseline: 1.5, current: 8.7, growthPct: 480, activityRate: 24.1, keySpeciesFound: 'Lasioglossum calceatum (Furrow Bee)' },
      { sector: 'Secondary School', shortSector: 'Sec. School', baseline: 1.9, current: 9.4, growthPct: 394, activityRate: 27.6, keySpeciesFound: 'Osmia caerulescens (Blue Mason Bee)' },
      { sector: 'Primary School', shortSector: 'Prim. School', baseline: 1.6, current: 7.8, growthPct: 387, activityRate: 22.3, keySpeciesFound: 'Andrena flavipes (Yellow-legged Bee)' },
      { sector: 'Community Center', shortSector: 'Community', baseline: 1.4, current: 8.1, growthPct: 478, activityRate: 23.5, keySpeciesFound: 'Chelostoma campanularum (Harebell Carpenter)' },
    ],
    trajectory: [
      { year: '2023 (Launch)', count: 3.1, projectedTarget: 2.5, corridorConnectivityIndex: 28 },
      { year: '2024 (Phase II)', count: 5.4, projectedTarget: 4.8, corridorConnectivityIndex: 51 },
      { year: '2025 (Expansion)', count: 7.6, projectedTarget: 6.8, corridorConnectivityIndex: 72 },
      { year: '2026 (Audited)', count: 9.3, projectedTarget: 8.2, corridorConnectivityIndex: 88 },
    ],
    notableFindings: [
      'Bee-hotel reeds filled with 98% cap rate by end of June 2026, indicating urgent solitary nesting demand.',
      'Red Mason Bees accounted for 44% of early spring fruit pollination in surrounding market allotment gardens.',
      'Substrate depths above 140mm enabled natural ground-nesting burrowing by mining bees (Andrena spp.).',
    ],
  },

  bumblebee: {
    id: 'bumblebee',
    label: 'Wild Bumblebees (Bombus)',
    shortLabel: 'Wild Bumblebees',
    scientificScope: 'Genus Bombus (Apidae)',
    iconType: 'bug',
    description: 'Long-tongued and short-tongued wild bumblebees that complement honeybees by buzz-pollinating deep tubular wildflowers such as foxgloves, vetch, and comfrey.',
    conservationStatus: 'Several UK species in long-term national decline due to forage deficits',
    primaryColor: '#F59E0B', // Amber
    baselineColor: '#94A3B8',
    chartUnit: 'Species Count',
    summaryStat: {
      label: 'Bumblebee Diversity',
      value: '7 Species',
      subtitle: 'Recorded across 92% of monitored roofs',
    },
    sectorMetrics: [
      { sector: 'Hotel Rooftop', shortSector: 'Hotel', baseline: 2.1, current: 6.8, growthPct: 223, activityRate: 29.4, keySpeciesFound: 'Bombus pascuorum (Common Carder)' },
      { sector: 'Cultural Arts Hub', shortSector: 'Arts Hub', baseline: 1.8, current: 6.4, growthPct: 255, activityRate: 27.2, keySpeciesFound: 'Bombus pratorum (Early Bumblebee)' },
      { sector: 'Commercial Office', shortSector: 'Corporate Office', baseline: 1.3, current: 5.7, growthPct: 338, activityRate: 24.1, keySpeciesFound: 'Bombus lapidarius (Red-tailed)' },
      { sector: 'Public Market', shortSector: 'Public Market', baseline: 2.3, current: 6.5, growthPct: 182, activityRate: 28.0, keySpeciesFound: 'Bombus terrestris (Buff-tailed)' },
      { sector: 'Civic Library', shortSector: 'Civic Library', baseline: 1.6, current: 5.5, growthPct: 243, activityRate: 22.5, keySpeciesFound: 'Bombus hortorum (Garden Bumblebee)' },
      { sector: 'Housing Estate', shortSector: 'Housing Estate', baseline: 2.0, current: 5.3, growthPct: 165, activityRate: 21.8, keySpeciesFound: 'Bombus hypnorum (Tree Bumblebee)' },
      { sector: 'Secondary School', shortSector: 'Sec. School', baseline: 2.4, current: 5.8, growthPct: 141, activityRate: 24.9, keySpeciesFound: 'Bombus vestalis (Vestal Cuckoo Bee)' },
      { sector: 'Primary School', shortSector: 'Prim. School', baseline: 2.2, current: 5.1, growthPct: 131, activityRate: 20.3, keySpeciesFound: 'Bombus pascuorum (Common Carder)' },
      { sector: 'Community Center', shortSector: 'Community', baseline: 2.0, current: 5.4, growthPct: 170, activityRate: 22.0, keySpeciesFound: 'Bombus pratorum (Early Bumblebee)' },
    ],
    trajectory: [
      { year: '2023 (Launch)', count: 2.8, projectedTarget: 2.6, corridorConnectivityIndex: 35 },
      { year: '2024 (Phase II)', count: 4.1, projectedTarget: 3.8, corridorConnectivityIndex: 58 },
      { year: '2025 (Expansion)', count: 5.2, projectedTarget: 4.8, corridorConnectivityIndex: 76 },
      { year: '2026 (Audited)', count: 5.8, projectedTarget: 5.4, corridorConnectivityIndex: 90 },
    ],
    notableFindings: [
      'Tree bumblebees (Bombus hypnorum) adapted readily to sheltered roof eaves and custom nesting boxes.',
      'Late-blooming Viper’s Bugloss extended forage availability into late October, aiding queen overwintering.',
      'Zero reported honeybee competition displacement; niche partitioning occurred as wild bumblebees focused on deep corolla flora.',
    ],
  },

  lepidoptera: {
    id: 'lepidoptera',
    label: 'Butterflies & Day-Flying Moths',
    shortLabel: 'Butterflies & Moths',
    scientificScope: 'Order Lepidoptera (Rhopalocera & Heterocera)',
    iconType: 'feather',
    description: 'Sensitive barometers of urban thermal regulation and air cleanliness. Rooftop sun-traps protected from vehicle exhaust create micro-climates where caterpillars feed and adult butterflies bask.',
    conservationStatus: '75% of UK butterfly species have declined over the past 45 years',
    primaryColor: '#3B82F6', // Vibrant azure blue
    baselineColor: '#94A3B8',
    chartUnit: 'Species Count',
    summaryStat: {
      label: 'Lepidoptera Sightings',
      value: '14 Species',
      subtitle: 'Breeding populations confirmed on 38 roofs',
    },
    sectorMetrics: [
      { sector: 'Hotel Rooftop', shortSector: 'Hotel', baseline: 1.5, current: 7.2, growthPct: 380, activityRate: 18.5, keySpeciesFound: 'Vanessa atalanta (Red Admiral)' },
      { sector: 'Cultural Arts Hub', shortSector: 'Arts Hub', baseline: 1.6, current: 6.8, growthPct: 325, activityRate: 16.8, keySpeciesFound: 'Inachis io (Peacock Butterfly)' },
      { sector: 'Commercial Office', shortSector: 'Corporate Office', baseline: 0.9, current: 5.6, growthPct: 522, activityRate: 14.2, keySpeciesFound: 'Macroglossum stellatarum (Hawk-moth)' },
      { sector: 'Public Market', shortSector: 'Public Market', baseline: 1.8, current: 6.1, growthPct: 238, activityRate: 15.6, keySpeciesFound: 'Polyommatus icarus (Common Blue)' },
      { sector: 'Civic Library', shortSector: 'Civic Library', baseline: 1.1, current: 5.2, growthPct: 372, activityRate: 13.5, keySpeciesFound: 'Aglais urticae (Small Tortoiseshell)' },
      { sector: 'Housing Estate', shortSector: 'Housing Estate', baseline: 1.4, current: 5.0, growthPct: 257, activityRate: 12.8, keySpeciesFound: 'Pieris rapae (Small White)' },
      { sector: 'Secondary School', shortSector: 'Sec. School', baseline: 1.7, current: 5.9, growthPct: 247, activityRate: 15.0, keySpeciesFound: 'Gonepteryx rhamni (Brimstone)' },
      { sector: 'Primary School', shortSector: 'Prim. School', baseline: 1.5, current: 4.8, growthPct: 220, activityRate: 12.1, keySpeciesFound: 'Vanessa cardui (Painted Lady)' },
      { sector: 'Community Center', shortSector: 'Community', baseline: 1.6, current: 5.1, growthPct: 218, activityRate: 13.0, keySpeciesFound: 'Pyrausta aurata (Mint Moth)' },
    ],
    trajectory: [
      { year: '2023 (Launch)', count: 2.2, projectedTarget: 2.0, corridorConnectivityIndex: 30 },
      { year: '2024 (Phase II)', count: 3.8, projectedTarget: 3.4, corridorConnectivityIndex: 54 },
      { year: '2025 (Expansion)', count: 5.1, projectedTarget: 4.6, corridorConnectivityIndex: 75 },
      { year: '2026 (Audited)', count: 5.7, projectedTarget: 5.2, corridorConnectivityIndex: 89 },
    ],
    notableFindings: [
      'Birdsfoot trefoil plantings hosted verified breeding colonies of Common Blue butterflies in Central London.',
      'Migratory Painted Ladies utilized high-altitude rooftop pit-stops during their annual southern transit.',
      'Day-flying Hummingbird Hawk-moths were documented on 28 separate rooftops, hovering over red valerian.',
    ],
  },

  flora: {
    id: 'flora',
    label: 'Native Wildflower & Flora Diversity',
    shortLabel: 'Flora Diversity',
    scientificScope: 'Angiosperms: Native UK Meadow Mixes',
    iconType: 'flower',
    description: 'The foundation of the entire ecological chain. We replaced sterile gravel and standard sedum with 38 species of perennial UK native wildflowers selected for drought resistance and extended bloom intervals.',
    conservationStatus: '97% of UK wildflower meadows have been destroyed since the 1930s',
    primaryColor: '#8B5CF6', // Royal purple
    baselineColor: '#94A3B8',
    chartUnit: 'Species Count',
    summaryStat: {
      label: 'Plant Richness Index',
      value: '38 Wildflowers',
      subtitle: 'Self-reseeding perpetual canopy mix',
    },
    sectorMetrics: [
      { sector: 'Hotel Rooftop', shortSector: 'Hotel', baseline: 3.2, current: 28.5, growthPct: 790, activityRate: 92.0, keySpeciesFound: 'Lotus corniculatus, Echium vulgare' },
      { sector: 'Cultural Arts Hub', shortSector: 'Arts Hub', baseline: 2.8, current: 26.4, growthPct: 842, activityRate: 88.5, keySpeciesFound: 'Origanum vulgare, Knautia arvensis' },
      { sector: 'Commercial Office', shortSector: 'Corporate Office', baseline: 2.1, current: 24.8, growthPct: 1080, activityRate: 81.2, keySpeciesFound: 'Centurea nigra, Galium verum' },
      { sector: 'Public Market', shortSector: 'Public Market', baseline: 3.5, current: 25.1, growthPct: 617, activityRate: 83.4, keySpeciesFound: 'Leucanthemum vulgare, Malva sylvestris' },
      { sector: 'Civic Library', shortSector: 'Civic Library', baseline: 2.4, current: 22.0, growthPct: 816, activityRate: 74.0, keySpeciesFound: 'Salvia pratensis, Linaria vulgaris' },
      { sector: 'Housing Estate', shortSector: 'Housing Estate', baseline: 2.9, current: 21.5, growthPct: 641, activityRate: 71.8, keySpeciesFound: 'Prunella vulgaris, Trifolium pratense' },
      { sector: 'Secondary School', shortSector: 'Sec. School', baseline: 3.6, current: 23.8, growthPct: 561, activityRate: 79.5, keySpeciesFound: 'Silene dioica, Stachys officinalis' },
      { sector: 'Primary School', shortSector: 'Prim. School', baseline: 3.1, current: 19.6, growthPct: 532, activityRate: 67.2, keySpeciesFound: 'Anthyllis vulneraria, Bellis perennis' },
      { sector: 'Community Center', shortSector: 'Community', baseline: 3.0, current: 20.8, growthPct: 593, activityRate: 70.4, keySpeciesFound: 'Verbascum nigrum, Daucus carota' },
    ],
    trajectory: [
      { year: '2023 (Launch)', count: 12.0, projectedTarget: 10.0, corridorConnectivityIndex: 38 },
      { year: '2024 (Phase II)', count: 18.4, projectedTarget: 16.5, corridorConnectivityIndex: 62 },
      { year: '2025 (Expansion)', count: 22.7, projectedTarget: 21.0, corridorConnectivityIndex: 81 },
      { year: '2026 (Audited)', count: 23.6, projectedTarget: 23.0, corridorConnectivityIndex: 94 },
    ],
    notableFindings: [
      'Self-reseeding seed banks achieved 91% germination survival into year three without supplemental chemical fertilizers.',
      'Deeper 160mm pumice-expanded clay substrate retained 68% more moisture during the July heat dome.',
      'Wild Marjoram (Origanum vulgare) emerged as the single highest nectar volume producer per square meter.',
    ],
  },
};
