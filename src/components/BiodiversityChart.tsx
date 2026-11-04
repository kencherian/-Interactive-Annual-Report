import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import {
  Sparkles,
  Bug,
  Flower2,
  Feather,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Activity,
  Layers,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import {
  BIODIVERSITY_CATEGORIES,
  SpeciesCategoryId,
  SectorBiodiversityRecord,
} from '../data/biodiversityData';

interface BiodiversityChartProps {
  selectedSectorName?: string;
  onSelectSector?: (sectorName: string) => void;
}

type ViewMode = 'comparison' | 'trajectory' | 'activity';

export const BiodiversityChart: React.FC<BiodiversityChartProps> = ({
  selectedSectorName,
  onSelectSector,
}) => {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<SpeciesCategoryId>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('comparison');

  const category = BIODIVERSITY_CATEGORIES[selectedCategory];

  // Colors dynamically adapted to dark / light theme
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(36, 51, 36, 0.08)';
  const textColor = isDark ? '#A3B59E' : '#4A5D44';
  const baselineFill = isDark ? '#3D4F3C' : '#94A3B8';
  const highlightStroke = isDark ? '#F59E0B' : '#D97706';

  const categoryIcons: Record<SpeciesCategoryId, React.ReactNode> = {
    all: <Sparkles className="w-4 h-4" />,
    solitary: <ShieldCheck className="w-4 h-4" />,
    bumblebee: <Bug className="w-4 h-4" />,
    lepidoptera: <Feather className="w-4 h-4" />,
    flora: <Flower2 className="w-4 h-4" />,
  };

  // Custom tooltips with high editorial polish matching report aesthetic
  const renderComparisonTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data: SectorBiodiversityRecord = payload[0]?.payload;
    if (!data) return null;

    return (
      <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#1A2819]/95 backdrop-blur-md border border-[#243324]/15 dark:border-white/15 shadow-xl text-left max-w-xs space-y-2.5">
        <div className="flex items-center justify-between border-b border-[#243324]/10 dark:border-white/10 pb-2">
          <span className="font-display font-medium text-base text-[#1F2B1D] dark:text-[#F4EFE6]">
            {data.sector}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
            +{data.growthPct}%
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center text-[#4A5D44] dark:text-[#CBD7C7]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500 inline-block" />
              2022 Pre-Retrofit:
            </span>
            <span className="font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">
              {data.baseline} species
            </span>
          </div>

          <div className="flex justify-between items-center text-[#4A5D44] dark:text-[#CBD7C7]">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: category.primaryColor }}
              />
              2026 Audited Survey:
            </span>
            <span className="font-bold text-[#1F2B1D] dark:text-[#F4EFE6]">
              {data.current} species
            </span>
          </div>

          <div className="flex justify-between items-center text-[#4A5D44] dark:text-[#CBD7C7] pt-1 border-t border-[#243324]/10 dark:border-white/10">
            <span>Peak Activity Rate:</span>
            <span className="font-medium text-[#1F2B1D] dark:text-[#F4EFE6]">
              {data.activityRate} visits/hr/100m²
            </span>
          </div>
        </div>

        {data.keySpeciesFound && (
          <div className="pt-1.5 text-[11px] text-[#657351] dark:text-[#A3B59E] italic border-t border-[#243324]/10 dark:border-white/10">
            <span className="font-sans font-medium not-italic text-[#4A5D44] dark:text-[#CBD7C7]">
              Key Bio-indicator:
            </span>{' '}
            {data.keySpeciesFound}
          </div>
        )}
      </div>
    );
  };

  const renderTrajectoryTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0]?.payload;
    if (!data) return null;

    return (
      <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#1A2819]/95 backdrop-blur-md border border-[#243324]/15 dark:border-white/15 shadow-xl text-left min-w-[200px] space-y-2">
        <div className="font-display font-medium text-base text-[#1F2B1D] dark:text-[#F4EFE6] border-b border-[#243324]/10 dark:border-white/10 pb-1.5">
          {label}
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center text-[#4A5D44] dark:text-[#CBD7C7]">
            <span>Species Documented:</span>
            <span className="font-bold text-sm text-[#1F2B1D] dark:text-[#F4EFE6]">
              {data.count} species
            </span>
          </div>
          <div className="flex justify-between items-center text-[#4A5D44] dark:text-[#CBD7C7]">
            <span>Ecological Target:</span>
            <span className="font-medium text-[#1F2B1D] dark:text-[#F4EFE6]">
              {data.projectedTarget} species
            </span>
          </div>
          <div className="flex justify-between items-center text-[#4A5D44] dark:text-[#CBD7C7] pt-1 border-t border-[#243324]/10 dark:border-white/10">
            <span>Corridor Connectivity:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {data.corridorConnectivityIndex}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderActivityTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0]?.payload;
    if (!data) return null;

    return (
      <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-[#1A2819]/95 backdrop-blur-md border border-[#243324]/15 dark:border-white/15 shadow-xl text-left min-w-[200px] space-y-1.5">
        <div className="font-display font-medium text-base text-[#1F2B1D] dark:text-[#F4EFE6]">
          {data.sector}
        </div>
        <div className="text-xs text-[#4A5D44] dark:text-[#CBD7C7] flex justify-between items-center">
          <span>Observed Forage Flight:</span>
          <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
            {data.activityRate} visits/hr/100m²
          </span>
        </div>
        <div className="text-[11px] text-[#657351] dark:text-[#A3B59E]">
          Monitored during peak June–August flight windows
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 sm:p-10 rounded-[2.5rem] bg-white dark:bg-[#20321F] border border-[#243324]/10 dark:border-white/12 shadow-xl space-y-8 transition-colors duration-400">
      {/* Header and Summary Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#243324]/10 dark:border-white/10 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Empirical Field Data
            </span>
            <span className="text-xs text-[#657351] dark:text-[#A3B59E]">
              Audited 2022–2026
            </span>
          </div>
          <h3 className="font-display text-2xl sm:text-4xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal tracking-tight">
            Biodiversity Growth by Species Group
          </h3>
          <p className="text-sm sm:text-base text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Quick Headline Stat Callout */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F5F2EB] dark:bg-[#182617] border border-[#243324]/10 dark:border-white/10 self-start lg:self-auto min-w-[220px]">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ backgroundColor: `${category.primaryColor}25`, color: category.primaryColor }}
          >
            {categoryIcons[selectedCategory]}
          </div>
          <div>
            <div className="font-display text-2xl sm:text-3xl font-semibold text-[#1F2B1D] dark:text-[#F4EFE6] leading-none">
              {category.summaryStat.value}
            </div>
            <div className="text-xs font-medium text-[#1F2B1D] dark:text-[#F4EFE6] pt-1">
              {category.summaryStat.label}
            </div>
            <div className="text-[11px] text-[#657351] dark:text-[#A3B59E] leading-tight">
              {category.summaryStat.subtitle}
            </div>
          </div>
        </div>
      </div>

      {/* Control Strip: Species Category Selector + View Mode Switch */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Species Category Toggle Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(BIODIVERSITY_CATEGORIES) as SpeciesCategoryId[]).map((catId) => {
            const cat = BIODIVERSITY_CATEGORIES[catId];
            const isSelected = selectedCategory === catId;
            return (
              <button
                key={catId}
                onClick={() => setSelectedCategory(catId)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1F2B1D] dark:bg-[#384E36] text-white dark:text-[#F4EFE6] shadow-md scale-[1.02]'
                    : 'bg-[#F5F2EB] dark:bg-[#283C27] text-[#3B4D36] dark:text-[#CBD7C7] hover:bg-[#EBE6DC] dark:hover:bg-[#324B31] border border-[#243324]/10 dark:border-white/10'
                }`}
                title={cat.scientificScope}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.primaryColor }}
                />
                {categoryIcons[catId]}
                <span>{cat.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center rounded-xl p-1 bg-[#F5F2EB] dark:bg-[#182617] border border-[#243324]/10 dark:border-white/10 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setViewMode('comparison')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'comparison'
                ? 'bg-white dark:bg-[#283C27] text-[#1F2B1D] dark:text-[#F4EFE6] shadow-sm font-semibold'
                : 'text-[#657351] dark:text-[#A3B59E] hover:text-[#1F2B1D] dark:hover:text-[#F4EFE6]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Before vs 2026</span>
          </button>

          <button
            onClick={() => setViewMode('trajectory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'trajectory'
                ? 'bg-white dark:bg-[#283C27] text-[#1F2B1D] dark:text-[#F4EFE6] shadow-sm font-semibold'
                : 'text-[#657351] dark:text-[#A3B59E] hover:text-[#1F2B1D] dark:hover:text-[#F4EFE6]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>4-Year Trend</span>
          </button>

          <button
            onClick={() => setViewMode('activity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'activity'
                ? 'bg-white dark:bg-[#283C27] text-[#1F2B1D] dark:text-[#F4EFE6] shadow-sm font-semibold'
                : 'text-[#657351] dark:text-[#A3B59E] hover:text-[#1F2B1D] dark:hover:text-[#F4EFE6]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Activity Density</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Recharts Chart Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedCategory}-${viewMode}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="relative w-full h-[380px] sm:h-[420px] pt-4"
        >
          {viewMode === 'comparison' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={category.sectorMetrics}
                margin={{ top: 20, right: 10, left: -10, bottom: 40 }}
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis
                  dataKey="shortSector"
                  stroke={textColor}
                  fontSize={11}
                  tickLine={false}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis
                  stroke={textColor}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  unit=""
                />
                <Tooltip content={renderComparisonTooltip} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '14px', fontSize: '12px' }}
                  formatter={(value: string) => (
                    <span className="text-xs font-medium text-[#3B4D36] dark:text-[#CBD7C7] mr-3">
                      {value}
                    </span>
                  )}
                />
                <Bar
                  dataKey="baseline"
                  name="2022 Pre-Installation Baseline"
                  fill={baselineFill}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="current"
                  name="2026 Monitored Species Richness"
                  fill={category.primaryColor}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                  cursor="pointer"
                  onClick={(data) => {
                    if (data?.sector && onSelectSector) {
                      onSelectSector(data.sector);
                    }
                  }}
                >
                  {category.sectorMetrics.map((entry) => {
                    const isSelected = selectedSectorName === entry.sector;
                    return (
                      <Cell
                        key={`cell-${entry.sector}`}
                        fill={category.primaryColor}
                        stroke={isSelected ? highlightStroke : 'none'}
                        strokeWidth={isSelected ? 2.5 : 0}
                        opacity={selectedSectorName && !isSelected ? 0.75 : 1}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {viewMode === 'trajectory' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={category.trajectory}
                margin={{ top: 20, right: 20, left: -10, bottom: 20 }}
              >
                <defs>
                  <linearGradient id={`grad-${selectedCategory}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={category.primaryColor} stopOpacity={0.45} />
                    <stop offset="95%" stopColor={category.primaryColor} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis
                  dataKey="year"
                  stroke={textColor}
                  fontSize={12}
                  tickLine={false}
                  padding={{ left: 20, right: 20 }}
                />
                <YAxis
                  stroke={textColor}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  unit=" sp"
                />
                <Tooltip content={renderTrajectoryTooltip} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '14px', fontSize: '12px' }}
                  formatter={(value: string) => (
                    <span className="text-xs font-medium text-[#3B4D36] dark:text-[#CBD7C7] mr-3">
                      {value}
                    </span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Observed Species Richness"
                  stroke={category.primaryColor}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill={`url(#grad-${selectedCategory})`}
                  dot={{ r: 5, fill: category.primaryColor, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
                <Area
                  type="monotone"
                  dataKey="projectedTarget"
                  name="Biodiversity Target Curve"
                  stroke={baselineFill}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="transparent"
                  dot={{ r: 3, fill: baselineFill }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {viewMode === 'activity' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={category.sectorMetrics}
                margin={{ top: 20, right: 10, left: -10, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis
                  dataKey="shortSector"
                  stroke={textColor}
                  fontSize={11}
                  tickLine={false}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis
                  stroke={textColor}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  unit=" /hr"
                />
                <Tooltip content={renderActivityTooltip} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '14px', fontSize: '12px' }}
                  formatter={(value: string) => (
                    <span className="text-xs font-medium text-[#3B4D36] dark:text-[#CBD7C7]">
                      {value}
                    </span>
                  )}
                />
                <Bar
                  dataKey="activityRate"
                  name="Hourly Pollinator Flight Frequency (Visits / hr / 100m²)"
                  fill={category.primaryColor}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                  cursor="pointer"
                  onClick={(data) => {
                    if (data?.sector && onSelectSector) {
                      onSelectSector(data.sector);
                    }
                  }}
                >
                  {category.sectorMetrics.map((entry) => {
                    const isSelected = selectedSectorName === entry.sector;
                    return (
                      <Cell
                        key={`cell-act-${entry.sector}`}
                        fill={category.primaryColor}
                        stroke={isSelected ? highlightStroke : 'none'}
                        strokeWidth={isSelected ? 2.5 : 0}
                        opacity={selectedSectorName && !isSelected ? 0.75 : 1}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Selected Sector Context / Highlighting Notice */}
      {selectedSectorName && (
        <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-2.5 rounded-xl bg-[#F5F2EB] dark:bg-[#182617] text-xs text-[#4A5D44] dark:text-[#CBD7C7] border border-[#243324]/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span>
              Currently Spotlighting:{' '}
              <strong className="text-[#1F2B1D] dark:text-[#F4EFE6] font-semibold">
                {selectedSectorName}
              </strong>{' '}
              (highlighted with gold border above)
            </span>
          </div>
          <span className="text-[11px] text-[#657351] dark:text-[#A3B59E]">
            Click any bar in chart to inspect
          </span>
        </div>
      )}

      {/* Contextual Ecological Findings & Scientific Scope */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#243324]/10 dark:border-white/10">
        <div className="p-4 rounded-2xl bg-[#F5F2EB]/80 dark:bg-[#182617]/80 space-y-1.5 border border-[#243324]/5 dark:border-white/5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">
            <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Scientific Scope</span>
          </div>
          <p className="text-xs text-[#4A5D44] dark:text-[#CBD7C7] italic leading-relaxed">
            {category.scientificScope}
          </p>
          <p className="text-[11px] text-[#657351] dark:text-[#A3B59E] leading-normal pt-1">
            {category.conservationStatus}
          </p>
        </div>

        <div className="md:col-span-2 p-4 rounded-2xl bg-[#F5F2EB]/80 dark:bg-[#182617]/80 space-y-2 border border-[#243324]/5 dark:border-white/5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Key Field Observations for {category.shortLabel}</span>
          </div>
          <ul className="space-y-1 text-xs text-[#4A5D44] dark:text-[#CBD7C7] leading-relaxed">
            {category.notableFindings.map((finding, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">•</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
