import { GlossaryTerm } from '../types';

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'bio-corridors',
    term: 'Bio-corridors',
    aliases: ['bio-corridor', 'biodiversity corridor', 'biodiversity corridors', 'wildlife corridors', 'green corridors', 'bio-corridors into underserved neighborhoods'],
    category: 'Urban Ecology',
    definition: 'Continuous ribbons of vegetated space or interconnected elevated stepping stones that allow wildlife, birds, and pollinators to migrate, forage, and disperse safely across dense urban developments.',
    projectContext: 'The Urban Hive Project establishes elevated bio-corridors linking 52 rooftop sites across 11 London boroughs, bridging isolated urban green spaces.',
    metricReference: '52 Sites Across 11 Boroughs',
  },
  {
    id: 'urban-sponge-roofs',
    term: 'Urban Sponge Roofs',
    aliases: ['sponge roofs', 'urban sponge roof', 'sponge roof', 'sponge city'],
    category: 'Hydrology & Climate',
    definition: 'Engineered green roofs utilizing permeable lightweight substrates, sedum mats, and moisture retention reservoirs to absorb rainfall on impact, filtering and slowly releasing stormwater.',
    projectContext: 'Project roofs captured and attenuated over 983,000 litres of rainwater during 2025/2026, shielding local London drainage systems from flash flooding.',
    metricReference: '983,296 Litres Captured',
  },
  {
    id: 'stormwater-attenuation',
    term: 'Stormwater Attenuation',
    aliases: ['stormwater', 'attenuation', 'runoff attenuation', 'stormwater runoff', 'rainwater capture'],
    category: 'Hydrology & Climate',
    definition: 'The intentional slowing, storing, and gradual release of rainwater runoff to prevent sewer network surges, urban street flooding, and river pollution during intense storms.',
    projectContext: 'Rooftop bio-swales and porous soil layers delay peak runoff discharge by up to 3.5 hours during heavy rainfall.',
    metricReference: '3.5 Hour Peak Delay',
  },
  {
    id: 'urban-heat-island',
    term: 'Urban Heat Island (UHI)',
    aliases: ['urban heat island', 'UHI', 'heat island effect', 'city air'],
    category: 'Hydrology & Climate',
    definition: 'The microclimatic phenomenon where densely built metropolitan areas experience significantly higher temperatures than rural fringes due to heat-absorbing asphalt, concrete, and energy emissions.',
    projectContext: 'Planting living meadows over bare black roof membranes cooled ambient air above buildings by 3.8°C during peak summer heat waves.',
    metricReference: '3.8°C Ambient Cooling',
  },
  {
    id: 'thermal-gain',
    term: 'Building Thermal Gain',
    aliases: ['thermal gain', 'solar thermal gain', 'heat gain', 'cooling load'],
    category: 'Architecture & Planning',
    definition: 'The net increase in temperature within a building caused by solar radiation absorbed by external envelope surfaces, roofs, and windows, driving up air-conditioning power consumption.',
    projectContext: 'Living rooftop vegetative mats prevent direct sun exposure on waterproof membranes, cutting summertime roof surface temperatures by up to 14°C.',
    metricReference: 'Up to 14°C Surface Reduction',
  },
  {
    id: 'apiary',
    term: 'Rooftop Apiary',
    aliases: ['apiary', 'apiaries', 'micro-apiary', 'micro-apiaries', 'hives'],
    category: 'Apiculture',
    definition: 'A managed yard or rooftop installation where honeybee colonies are housed in hives, inspected for colony welfare, and studied for urban pollination trends.',
    projectContext: '194 active hives are distributed across London rooftops, with digital telemetry tracking internal hive temperatures and colony weight trends.',
    metricReference: '194 Active Hives',
  },
  {
    id: 'solitary-bees',
    term: 'Solitary Pollinators',
    aliases: ['solitary bees', 'solitary pollinators', 'native pollinators', 'native bee species'],
    category: 'Urban Ecology',
    definition: 'Non-social bee species (such as red mason bees, leafcutter bees, and mining bees) that nest individually without worker castes, responsible for a substantial portion of wildflower pollination.',
    projectContext: 'Each apiary features dedicated nesting hurdles and hollow stem bundles alongside honeybee hives to ensure native solitary bees flourish.',
    metricReference: '16+ Native Solitary Species',
  },
  {
    id: 'extensive-green-roof',
    term: 'Extensive Green Roof',
    aliases: ['extensive green roof', 'extensive green roofs', 'living roof', 'bio-roofs', 'green roof'],
    category: 'Architecture & Planning',
    definition: 'A low-profile living roof system characterized by a shallow substrate layer (typically 60–150 mm) supporting drought-resilient sedums, herbs, and wildflowers with low structural load.',
    projectContext: 'Over 17,800 square meters of certified extensive wildflower meadows have been seeded across commercial, civic, and educational roofs.',
    metricReference: '17,889 m² Meadow Area',
  },
  {
    id: 'apiculture',
    term: 'Urban Apiculture',
    aliases: ['apiculture', 'beekeeping', 'urban beekeeping', 'colony management'],
    category: 'Apiculture',
    definition: 'The science, craft, and ecological management of honeybee colonies in metropolitan environments, balanced against native flora availability.',
    projectContext: 'The project adheres to carrying-capacity guidelines to ensure managed honeybees do not outcompete wild pollinator populations.',
    metricReference: 'Carrying-Capacity Audited',
  },
  {
    id: 'foraging-radius',
    term: 'Foraging Radius',
    aliases: ['foraging radius', 'foraging zone', 'flight range'],
    category: 'Apiculture',
    definition: 'The territorial distance (typically 1.5 to 3 kilometers) that honeybees travel from their hive to collect pollen, nectar, propolis, and water.',
    projectContext: 'Carefully spaced rooftop sites form overlapping foraging radii, creating continuous biological stepping stones from Westminster to Tower Hamlets.',
    metricReference: '2.0 km Overlapping Radii',
  },
  {
    id: 'biodiversity-net-gain',
    term: 'Biodiversity Net Gain (BNG)',
    aliases: ['biodiversity net gain', 'BNG', 'biodiversity increase', 'species richness'],
    category: 'Urban Ecology',
    definition: 'A planning and conservation standard requiring land development to measurably improve natural habitat and species richness compared to pre-construction baselines.',
    projectContext: 'Monitored rooftop sites demonstrated an average +42% increase in pollinator species richness within 24 months of seeding.',
    metricReference: '+42% Species Richness',
  },
  {
    id: 'bio-swales',
    term: 'Bio-swales',
    aliases: ['bio-swale', 'bioswale', 'bioswales', 'vegetated swales'],
    category: 'Hydrology & Climate',
    definition: 'Gently sloped, vegetated drainage channels engineered to convey, filter, and infiltrate stormwater runoff, trapping particulates before discharge.',
    projectContext: 'Terraced bio-swales on public market roofs guide heavy runoff into gravel infiltration trenches instead of storm sewers.',
    metricReference: 'Integrated Roof Drainage',
  },
  {
    id: 'colony-genetics',
    term: 'Colony Genetics',
    aliases: ['colony genetics', 'queen genetics', 'colony health'],
    category: 'Apiculture',
    definition: 'The hereditary characteristics and genetic diversity of honeybee colonies, which govern disease resistance, gentle temperament, and overwinter survival.',
    projectContext: 'Students and research partners conduct non-invasive DNA and microscope analysis on nurse bees in school rooftop labs.',
    metricReference: 'Accredited Lab Studies',
  },
  {
    id: 'food-equity',
    term: 'Food Equity',
    aliases: ['food equity', 'food sharing', 'community food sharing', 'food pantries'],
    category: 'Social Impact',
    definition: 'The principle that all individuals and neighborhood communities deserve equitable access to fresh, wholesome, and ethically produced food, regardless of socio-economic barriers.',
    projectContext: 'Over 2,500 jars of cold-extracted rooftop honey were routed directly to neighborhood food banks across Southwark, Hackney, and Islington.',
    metricReference: '2,599 Jars Donated',
  },
  {
    id: 'green-apprenticeships',
    term: 'Green Apprenticeships',
    aliases: ['green apprenticeships', 'apprenticeship', 'accredited green apprenticeships', 'vocational training'],
    category: 'Social Impact',
    definition: 'Structured vocational training pathways equipping young people with practical skills, credentials, and paid employment in urban ecological infrastructure and horticulture.',
    projectContext: 'The project’s 2027 Strategic Horizon commits to training 60 accredited youth apprentices from historically underrepresented London boroughs.',
    metricReference: '60 Pledged Apprentices',
  },
];

/**
 * Normalizes strings for robust case- and punctuation-insensitive matching.
 */
function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Pre-computed lookup dictionary for fast resolution by ID, term, or aliases
const LOOKUP_MAP = new Map<string, GlossaryTerm>();

GLOSSARY_TERMS.forEach((item) => {
  LOOKUP_MAP.set(normalizeKey(item.id), item);
  LOOKUP_MAP.set(normalizeKey(item.term), item);
  if (item.aliases) {
    item.aliases.forEach((alias) => {
      LOOKUP_MAP.set(normalizeKey(alias), item);
    });
  }
});

/**
 * Find a glossary term by ID, term string, or any configured alias.
 */
export function findGlossaryTerm(query: string): GlossaryTerm | undefined {
  if (!query) return undefined;
  return LOOKUP_MAP.get(normalizeKey(query));
}

export const GLOSSARY_CATEGORIES = [
  'All',
  'Urban Ecology',
  'Hydrology & Climate',
  'Apiculture',
  'Architecture & Planning',
  'Social Impact',
] as const;
