import {
  BIODIVERSITY_CATEGORIES,
  SpeciesCategoryConfig,
  SpeciesCategoryId,
} from '../data/biodiversityData';

/**
 * Escapes a cell value for standard RFC 4180 CSV export.
 */
function escapeCsvValue(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const stringVal = String(val);
  if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
    return `"${stringVal.replace(/"/g, '""')}"`;
  }
  return `"${stringVal}"`;
}

/**
 * Initiates an automatic client-side file download of CSV content with UTF-8 BOM.
 */
function downloadCsv(filename: string, csvContent: string): void {
  // \uFEFF is UTF-8 Byte Order Mark for seamless Excel compatibility
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports data for a single selected species category (including sector breakdown and trajectory).
 */
export function exportCategoryCSV(category: SpeciesCategoryConfig): string {
  const rows: string[][] = [];

  // Metadata headers
  rows.push(['# THE URBAN HIVE PROJECT: 2026 ANNUAL REPORT']);
  rows.push(['# BIODIVERSITY MONITORING DATASET']);
  rows.push(['Category', category.label]);
  rows.push(['Scientific Scope', category.scientificScope]);
  rows.push(['Conservation Status', category.conservationStatus]);
  rows.push(['Audited Timeframe', '2022 Baseline - August 2026 Audited Survey']);
  rows.push([]);

  // Section 1: Sector Breakdown
  rows.push([
    'Building Sector',
    'Sector Abbreviation',
    'Pre-Retrofit Baseline (2022 Species Count)',
    'Audited Richness (2026 Species Count)',
    'Net Growth (%)',
    'Peak Activity Rate (Visits/hr/100m²)',
    'Key Bio-Indicator Species Documented',
  ]);

  for (const item of category.sectorMetrics) {
    rows.push([
      item.sector,
      item.shortSector,
      String(item.baseline),
      String(item.current),
      `+${item.growthPct}%`,
      String(item.activityRate),
      item.keySpeciesFound,
    ]);
  }

  rows.push([]);
  rows.push(['# MULTI-YEAR RECOVERY TRAJECTORY']);
  rows.push([
    'Survey Milestone',
    'Observed Species Richness',
    'Biodiversity Target Curve',
    'Corridor Connectivity Index (%)',
  ]);

  for (const point of category.trajectory) {
    rows.push([
      point.year,
      String(point.count),
      String(point.projectedTarget),
      `${point.corridorConnectivityIndex}%`,
    ]);
  }

  rows.push([]);
  rows.push(['# KEY FIELD FINDINGS']);
  category.notableFindings.forEach((finding, idx) => {
    rows.push([`Finding ${idx + 1}`, finding]);
  });

  const csvString = rows.map((r) => r.map(escapeCsvValue).join(',')).join('\r\n');
  const filename = `urban_hive_${category.id}_biodiversity_2026.csv`;
  downloadCsv(filename, csvString);
  return filename;
}

/**
 * Exports the comprehensive master dataset across all 5 species categories and sectors.
 */
export function exportCompleteBiodiversityCSV(): string {
  const rows: string[][] = [];

  // Metadata headers
  rows.push(['# THE URBAN HIVE PROJECT: 2026 ANNUAL REPORT']);
  rows.push(['# COMPLETE PAN-LONDON BIODIVERSITY MASTER DATASET']);
  rows.push(['Survey Locations', '52 Rooftop Sanctuaries across 11 London Boroughs']);
  rows.push(['Published', 'August 2026']);
  rows.push(['Methodology', 'Acoustic bio-sensors, pan traps, and monthly pan-London ecologist sweep surveys']);
  rows.push([]);

  // Master Table: All Categories by Sector
  rows.push([
    'Species Category',
    'Scientific Scope',
    'Building Sector',
    '2022 Pre-Retrofit Baseline',
    '2026 Audited Richness',
    'Growth Percentage',
    'Peak Activity Rate (Visits/hr/100m²)',
    'Key Bio-Indicator Species',
  ]);

  const categoryKeys = Object.keys(BIODIVERSITY_CATEGORIES) as SpeciesCategoryId[];

  for (const catId of categoryKeys) {
    const cat = BIODIVERSITY_CATEGORIES[catId];
    for (const metric of cat.sectorMetrics) {
      rows.push([
        cat.label,
        cat.scientificScope,
        metric.sector,
        String(metric.baseline),
        String(metric.current),
        `+${metric.growthPct}%`,
        String(metric.activityRate),
        metric.keySpeciesFound,
      ]);
    }
  }

  rows.push([]);
  rows.push(['# ALL-CATEGORY MULTI-YEAR TRAJECTORIES (2023 - 2026)']);
  rows.push([
    'Species Category',
    'Year / Milestone',
    'Observed Species Count',
    'Projected Target',
    'Corridor Connectivity Index (%)',
  ]);

  for (const catId of categoryKeys) {
    const cat = BIODIVERSITY_CATEGORIES[catId];
    for (const traj of cat.trajectory) {
      rows.push([
        cat.label,
        traj.year,
        String(traj.count),
        String(traj.projectedTarget),
        `${traj.corridorConnectivityIndex}%`,
      ]);
    }
  }

  const csvString = rows.map((r) => r.map(escapeCsvValue).join(',')).join('\r\n');
  const filename = 'urban_hive_complete_biodiversity_dataset_2026.csv';
  downloadCsv(filename, csvString);
  return filename;
}
