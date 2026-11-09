import * as d3 from 'd3';
import { BoroughSummaryMetrics } from '../data/londonMapData';
import { RooftopSite } from '../types';

export type DistributionMetric = 'hives' | 'sites' | 'meadow' | 'honey' | 'stormwater';

export interface MetricConfig {
  id: DistributionMetric;
  label: string;
  shortLabel: string;
  unit: string;
  shortUnit: string;
  getValue: (metrics: BoroughSummaryMetrics) => number;
  formatValue: (val: number) => string;
  minMax: [number, number];
}

export const DISTRIBUTION_METRICS: Record<DistributionMetric, MetricConfig> = {
  hives: {
    id: 'hives',
    label: 'Active Bee Colonies',
    shortLabel: 'Colonies',
    unit: 'Active Hives',
    shortUnit: 'hives',
    getValue: (m) => m.hives,
    formatValue: (v) => `${v} hives`,
    minMax: [0, 27],
  },
  sites: {
    id: 'sites',
    label: 'Rooftop Sanctuaries',
    shortLabel: 'Sanctuaries',
    unit: 'Partner Rooftops',
    shortUnit: 'sites',
    getValue: (m) => m.sites,
    formatValue: (v) => `${v} sites`,
    minMax: [0, 7],
  },
  meadow: {
    id: 'meadow',
    label: 'Wildflower Meadow Canopy',
    shortLabel: 'Meadow m²',
    unit: 'Square Metres',
    shortUnit: 'm²',
    getValue: (m) => m.wildflowerAreaSqM,
    formatValue: (v) => `${v.toLocaleString()} m²`,
    minMax: [0, 2400],
  },
  honey: {
    id: 'honey',
    label: 'Raw Honey Yield',
    shortLabel: 'Harvest kg',
    unit: 'Kilograms Extracted',
    shortUnit: 'kg',
    getValue: (m) => Math.round(m.hives * 13.8), // Average 13.8 kg / hive
    formatValue: (v) => `${v.toLocaleString()} kg`,
    minMax: [0, 380],
  },
  stormwater: {
    id: 'stormwater',
    label: 'Stormwater Infiltration',
    shortLabel: 'Water Litres',
    unit: 'Litres Absorbed',
    shortUnit: 'L',
    getValue: (m) => Math.round(m.wildflowerAreaSqM * 55), // 55 L / m² retention
    formatValue: (v) => `${(v / 1000).toFixed(0)}k L`,
    minMax: [0, 140000],
  },
};

/**
 * Creates a D3 sequential color scale for choropleth rendering.
 */
export function createChoroplethScale(
  metric: DistributionMetric,
  isDark: boolean,
  maxValue: number
): d3.ScaleSequential<string, never> {
  // Editorial nature palettes
  const lightRange = ['#F5F2EB', '#D8E5D3', '#9CBF94', '#55824E', '#243324'];
  const darkRange = ['#162315', '#20361E', '#2C4C29', '#3D6839', '#5BA654'];

  const interpolator = isDark
    ? d3.interpolateRgbBasis(darkRange)
    : d3.interpolateRgbBasis(lightRange);

  return d3.scaleSequential(interpolator).domain([0, maxValue || 1]);
}

/**
 * Creates a D3 square-root scale for sizing apiary circles based on hive count.
 */
export function createPinRadiusScale(): d3.ScalePower<number, number> {
  return d3.scaleSqrt().domain([2, 6]).range([3.2, 6.2]);
}

/**
 * Generates pollinator flight corridor bezier curves between nearby rooftop apiaries.
 * Connects sanctuaries within foraging distance (< 42 SVG units).
 */
export interface FlightCorridor {
  id: string;
  path: string;
  source: RooftopSite;
  target: RooftopSite;
  distanceKm: number;
}

export function generateFlightCorridors(sites: RooftopSite[]): FlightCorridor[] {
  const corridors: FlightCorridor[] = [];
  const maxDistance = 46; // SVG coordinate units (~2.3 km flight range)

  for (let i = 0; i < sites.length; i++) {
    for (let j = i + 1; j < sites.length; j++) {
      const a = sites[i];
      const b = sites[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 8 && dist < maxDistance) {
        // Curve the corridor path slightly for an organic flight arc
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        // Perpendicular offset for organic curve
        const offset = Math.sin(a.x * 0.1) * 6;
        const ctrlX = midX + (dy / dist) * offset;
        const ctrlY = midY - (dx / dist) * offset;

        corridors.push({
          id: `corridor-${a.id}-${b.id}`,
          path: `M ${a.x} ${a.y} Q ${ctrlX} ${ctrlY} ${b.x} ${b.y}`,
          source: a,
          target: b,
          distanceKm: parseFloat((dist * 0.05).toFixed(1)), // Scale to km
        });
      }
    }
  }

  return corridors.slice(0, 36); // Keep cleanest, most prominent bio-corridor paths
}
