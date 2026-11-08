export type ExpansionYear = 2023 | 2024 | 2025 | 2026;

export interface ExpansionMilestone {
  year: ExpansionYear;
  phaseName: string;
  subtitle: string;
  cumulativeSites: number;
  cumulativeHives: number;
  cumulativeMeadowSqM: number;
  newSitesCount: number;
  activeBoroughCount: number;
  boroughsUnlocked: string[];
  narrativeHeadline: string;
}

export const EXPANSION_MILESTONES: Record<ExpansionYear, ExpansionMilestone> = {
  2023: {
    year: 2023,
    phaseName: 'Phase I: Launch & Pilot Corridor',
    subtitle: 'Foundational apiaries established on heritage and commercial roofs along the River Thames.',
    cumulativeSites: 12,
    cumulativeHives: 46,
    cumulativeMeadowSqM: 4280,
    newSitesCount: 12,
    activeBoroughCount: 3,
    boroughsUnlocked: ['City of London', 'Southwark', 'Westminster'],
    narrativeHeadline: 'Pilot sanctuaries connected Southwark Open Market to central City financial towers.',
  },
  2024: {
    year: 2024,
    phaseName: 'Phase II: River Linkage & Hotels',
    subtitle: 'Expanded westward into Hammersmith and eastward along Thames canal links.',
    cumulativeSites: 26,
    cumulativeHives: 98,
    cumulativeMeadowSqM: 9140,
    newSitesCount: 14,
    activeBoroughCount: 6,
    boroughsUnlocked: ['Hammersmith & Fulham', 'Lambeth', 'Tower Hamlets'],
    narrativeHeadline: 'Luxury hotel partnerships funded first public housing and school apiaries.',
  },
  2025: {
    year: 2025,
    phaseName: 'Phase III: North & South Stepping Stones',
    subtitle: 'Crossed the Regent’s Canal into Islington and Camden, bridging Regent’s Park to the Thames.',
    cumulativeSites: 41,
    cumulativeHives: 154,
    cumulativeMeadowSqM: 14450,
    newSitesCount: 15,
    activeBoroughCount: 9,
    boroughsUnlocked: ['Islington', 'Camden', 'Wandsworth'],
    narrativeHeadline: 'Secondary school bio-labs integrated acoustic sensor monitoring.',
  },
  2026: {
    year: 2026,
    phaseName: 'Phase IV: Pan-London Bio-Highway',
    subtitle: 'Full 11-borough audited network achieving continuous genetic flow across Greater London.',
    cumulativeSites: 52,
    cumulativeHives: 194,
    cumulativeMeadowSqM: 17889,
    newSitesCount: 11,
    activeBoroughCount: 11,
    boroughsUnlocked: ['Greenwich', 'Hackney'],
    narrativeHeadline: 'All 52 sanctuaries active, yielding 2.6 tonnes of honey and 17,889 m² wildflower canopy.',
  },
};

/**
 * Deterministic mapping of site ID to the expansion year in which it was constructed.
 */
export const SITE_EXPANSION_YEARS: Record<string, ExpansionYear> = {
  // 2023 (12 sites: City, Southwark, Westminster)
  'cit-1': 2023,
  'cit-2': 2023,
  'cit-3': 2023,
  'stk-1': 2023, // Southwark Open Market
  'stk-2': 2023,
  'stk-3': 2023,
  'stk-4': 2023,
  'wst-1': 2023,
  'wst-2': 2023,
  'cit-4': 2023,
  'stk-5': 2023,
  'wst-3': 2023,

  // 2024 (14 sites: Hammersmith, Lambeth, Tower Hamlets)
  'hmf-1': 2024,
  'hmf-2': 2024,
  'hmf-3': 2024,
  'hmf-4': 2024,
  'lmb-1': 2024,
  'lmb-2': 2024,
  'twh-1': 2024,
  'twh-2': 2024,
  'cit-5': 2024,
  'stk-6': 2024,
  'lmb-3': 2024,
  'twh-3': 2024,
  'hmf-5': 2024,
  'twh-4': 2024,

  // 2025 (15 sites: Islington, Camden, Wandsworth)
  'isl-1': 2025,
  'isl-2': 2025,
  'isl-3': 2025,
  'cmd-1': 2025,
  'cmd-2': 2025,
  'cmd-3': 2025,
  'wnd-1': 2025,
  'wnd-2': 2025,
  'lmb-4': 2025,
  'hmf-6': 2025,
  'stk-7': 2025,
  'isl-4': 2025,
  'cmd-4': 2025,
  'wnd-3': 2025,
  'twh-5': 2025,

  // 2026 (11 sites: Greenwich, Hackney, completion)
  'grn-1': 2026,
  'grn-2': 2026,
  'grn-3': 2026,
  'grn-4': 2026,
  'hck-1': 2026,
  'hck-2': 2026,
  'isl-5': 2026,
  'isl-6': 2026,
  'cmd-5': 2026,
  'hmf-7': 2026,
  'wnd-4': 2026,
};

/**
 * Returns the expansion year of any site (defaults to 2023 if unlisted).
 */
export function getSiteExpansionYear(siteId: string): ExpansionYear {
  return SITE_EXPANSION_YEARS[siteId] || 2023;
}
