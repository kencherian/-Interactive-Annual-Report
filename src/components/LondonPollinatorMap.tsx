import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as d3 from 'd3';
import {
  X,
  Droplets,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Sparkles,
  MapPin,
  TrendingUp,
  Compass,
  Info,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import {
  ACTIVE_BOROUGHS,
  RIVER_THAMES_PATH,
  ALL_ROOFTOP_SITES,
  MAP_DIMENSIONS,
  BOROUGH_METRICS,
  BoroughGeoData,
} from '../data/londonMapData';
import { RooftopSite } from '../types';
import {
  EXPANSION_MILESTONES,
  ExpansionYear,
  getSiteExpansionYear,
} from '../data/expansionData';
import {
  DISTRIBUTION_METRICS,
  DistributionMetric,
  createChoroplethScale,
  createPinRadiusScale,
  generateFlightCorridors,
  FlightCorridor,
} from '../utils/d3MapUtils';

interface LondonPollinatorMapProps {
  selectedBoroughName?: string | null;
  onSelectBorough?: (boroughName: string | null) => void;
  onHoverBorough?: (boroughName: string | null) => void;
  zoomLevel?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export const LondonPollinatorMap: React.FC<LondonPollinatorMapProps> = ({
  selectedBoroughName,
  onSelectBorough,
  onHoverBorough,
}) => {
  const { isDark } = useTheme();

  // Active borough tracking
  const [selectedBoroughId, setSelectedBoroughId] = useState<string | null>(
    selectedBoroughName
      ? ACTIVE_BOROUGHS.find(
          (b) => b.name.toLowerCase() === selectedBoroughName.toLowerCase()
        )?.id || null
      : null
  );

  useEffect(() => {
    if (selectedBoroughName === null || selectedBoroughName === undefined) {
      setSelectedBoroughId(null);
    } else {
      const match = ACTIVE_BOROUGHS.find(
        (b) => b.name.toLowerCase() === selectedBoroughName.toLowerCase()
      );
      setSelectedBoroughId(match ? match.id : null);
    }
  }, [selectedBoroughName]);

  const [hoveredBoroughId, setHoveredBoroughId] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<RooftopSite | null>(null);
  const [hoveredSite, setHoveredSite] = useState<RooftopSite | null>(null);

  // D3 Visualization State Controls
  const [selectedMetric, setSelectedMetric] = useState<DistributionMetric>('hives');
  const [selectedYear, setSelectedYear] = useState<ExpansionYear | 'all'>('all');
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [showFlightCorridors, setShowFlightCorridors] = useState(true);
  const [currentZoomK, setCurrentZoomK] = useState<number>(1);

  // SVG & Zoom Refs
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomGroupRef = useRef<SVGGElement>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Enrich sites with expansion years
  const enrichedSites = useMemo(() => {
    return ALL_ROOFTOP_SITES.map((site) => ({
      ...site,
      expansionYear: getSiteExpansionYear(site.id),
    }));
  }, []);

  // Filter sites based on expansion timeline year and borough filter
  const visibleSites = useMemo(() => {
    return enrichedSites.filter((site) => {
      // Timeline filter
      if (selectedYear !== 'all' && site.expansionYear > selectedYear) {
        return false;
      }
      // Borough filter
      if (selectedBoroughId) {
        const borough = ACTIVE_BOROUGHS.find((b) => b.id === selectedBoroughId);
        if (borough && site.borough.toLowerCase() !== borough.name.toLowerCase()) {
          return false;
        }
      }
      return true;
    });
  }, [enrichedSites, selectedYear, selectedBoroughId]);

  // Compute flight corridors between active visible sites using D3
  const flightCorridors: FlightCorridor[] = useMemo(() => {
    if (!showFlightCorridors) return [];
    return generateFlightCorridors(visibleSites);
  }, [visibleSites, showFlightCorridors]);

  // D3 Proportional Pin Radius Scale
  const pinRadiusScale = useMemo(() => createPinRadiusScale(), []);

  // D3 Choropleth Color Scale based on selected metric
  const metricConfig = DISTRIBUTION_METRICS[selectedMetric];
  const maxMetricValue = useMemo(() => {
    return d3.max(Object.values(BOROUGH_METRICS), (d) => metricConfig.getValue(d)) || 25;
  }, [metricConfig]);

  const choroplethScale = useMemo(() => {
    return createChoroplethScale(selectedMetric, isDark, maxMetricValue);
  }, [selectedMetric, isDark, maxMetricValue]);

  // Setup D3 Zoom & Pan Behavior
  useEffect(() => {
    if (!svgRef.current || !zoomGroupRef.current) return;

    const svg = d3.select(svgRef.current);
    const zoomGroup = d3.select(zoomGroupRef.current);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.85, 4.0])
      .translateExtent([
        [150, 80],
        [850, 650],
      ])
      .on('zoom', (event) => {
        zoomGroup.attr('transform', event.transform.toString());
        setCurrentZoomK(event.transform.k);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    return () => {
      svg.on('.zoom', null);
    };
  }, []);

  // Zoom control helpers using D3 transition
  const handleD3ZoomIn = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(400)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.scaleBy, 1.3);
  }, []);

  const handleD3ZoomOut = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(400)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.scaleBy, 0.75);
  }, []);

  const handleD3ResetZoom = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(650)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  }, []);

  // Timeline Autoplay player
  useEffect(() => {
    if (!isPlayingTimeline) return;

    const years: ExpansionYear[] = [2023, 2024, 2025, 2026];
    const timer = setInterval(() => {
      setSelectedYear((prev) => {
        if (prev === 'all' || prev === 2026) {
          return 2023;
        }
        const nextIndex = years.indexOf(prev as ExpansionYear) + 1;
        return nextIndex < years.length ? years[nextIndex] : 'all';
      });
    }, 2200);

    return () => clearInterval(timer);
  }, [isPlayingTimeline]);

  // Borough click interaction
  const handleBoroughClick = (borough: BoroughGeoData) => {
    if (selectedBoroughId === borough.id) {
      setSelectedBoroughId(null);
      setSelectedSite(null);
      if (onSelectBorough) onSelectBorough(null);
    } else {
      setSelectedBoroughId(borough.id);
      setSelectedSite(null);
      if (onSelectBorough) onSelectBorough(borough.name);

      // Smoothly pan & focus D3 zoom toward the borough centroid
      if (svgRef.current && zoomBehaviorRef.current) {
        const cx = borough.centroid.x;
        const cy = borough.centroid.y;
        const viewMidX = MAP_DIMENSIONS.minX + MAP_DIMENSIONS.width / 2;
        const viewMidY = MAP_DIMENSIONS.minY + MAP_DIMENSIONS.height / 2;
        const dx = (viewMidX - cx) * 1.3;
        const dy = (viewMidY - cy) * 1.3;

        const transform = d3.zoomIdentity.translate(dx, dy).scale(1.3);

        d3.select(svgRef.current)
          .transition()
          .duration(700)
          .ease(d3.easeCubicOut)
          .call(zoomBehaviorRef.current.transform, transform);
      }
    }
  };

  const handleBoroughMouseEnter = (borough: BoroughGeoData) => {
    setHoveredBoroughId(borough.id);
    if (onHoverBorough) onHoverBorough(borough.name);
  };

  const handleBoroughMouseLeave = () => {
    setHoveredBoroughId(null);
    if (onHoverBorough) onHoverBorough(null);
  };

  const handleSiteMouseEnter = (site: RooftopSite) => {
    setHoveredSite(site);
    if (onHoverBorough) onHoverBorough(site.borough);
  };

  const handleSiteMouseLeave = () => {
    setHoveredSite(null);
    if (hoveredBoroughId) {
      const b = ACTIVE_BOROUGHS.find((item) => item.id === hoveredBoroughId);
      if (b && onHoverBorough) {
        onHoverBorough(b.name);
        return;
      }
    }
    if (onHoverBorough) onHoverBorough(null);
  };

  const activeMilestone =
    selectedYear !== 'all' ? EXPANSION_MILESTONES[selectedYear] : null;

  return (
    <div className="relative w-full h-[620px] sm:h-[680px] lg:h-[720px] bg-[#FBF9F5] dark:bg-[#152014] overflow-hidden select-none transition-colors duration-400 flex flex-col">
      {/* Top Map Action Strip: D3 Distribution Metric Toggles + Timeline Slider */}
      <div className="z-20 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#243324]/10 dark:border-white/10 bg-white/70 dark:bg-[#182617]/70 backdrop-blur-md">
        {/* Metric Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E] mr-1 hidden sm:inline">
            Metric:
          </span>
          {(Object.keys(DISTRIBUTION_METRICS) as DistributionMetric[]).map((metricId) => {
            const config = DISTRIBUTION_METRICS[metricId];
            const isSelected = selectedMetric === metricId;
            return (
              <button
                key={metricId}
                onClick={() => setSelectedMetric(metricId)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1F2B1D] dark:bg-[#344732] text-white dark:text-[#F4EFE6] shadow-xs'
                    : 'bg-black/5 dark:bg-white/5 text-[#4A5D44] dark:text-[#CBD7C7] hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                {config.shortLabel}
              </button>
            );
          })}
        </div>

        {/* Timeline Expansion Controls */}
        <div className="flex items-center gap-2 bg-[#F5F2EB] dark:bg-[#1C2C1B] p-1 rounded-2xl border border-[#243324]/10 dark:border-white/10">
          <button
            onClick={() => setIsPlayingTimeline((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-600 dark:bg-emerald-700 text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
            title={isPlayingTimeline ? 'Pause Expansion Animation' : 'Play Multi-Year Expansion'}
          >
            {isPlayingTimeline ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="hidden xs:inline">{isPlayingTimeline ? 'Pause' : 'Expand'}</span>
          </button>

          {/* Year Buttons */}
          <div className="flex items-center gap-1">
            {(['all', 2023, 2024, 2025, 2026] as const).map((year) => {
              const isSelected = selectedYear === year;
              return (
                <button
                  key={year}
                  onClick={() => {
                    setIsPlayingTimeline(false);
                    setSelectedYear(year);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-[#2C3F2A] text-[#1F2B1D] dark:text-[#F4EFE6] font-bold shadow-xs'
                      : 'text-[#657351] dark:text-[#A3B59E] hover:text-[#1F2B1D] dark:hover:text-white'
                  }`}
                >
                  {year === 'all' ? 'All' : `'${String(year).slice(2)}`}
                </button>
              );
            })}
          </div>

          {/* Flight Corridors Toggle */}
          <button
            onClick={() => setShowFlightCorridors((prev) => !prev)}
            className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
              showFlightCorridors
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300'
                : 'text-[#657351] dark:text-[#A3B59E] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            title="Toggle Pollinator Flight Corridor Routes"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive SVG Canvas rendered with D3.js */}
      <div className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={MAP_DIMENSIONS.viewBox}
          className="w-full h-full"
          style={{ overflow: 'hidden' }}
        >
          <defs>
            {/* D3 Choropleth Legend Gradient */}
            <linearGradient id="d3ChoroplethGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isDark ? '#162315' : '#F5F2EB'} />
              <stop offset="30%" stopColor={isDark ? '#20361E' : '#D8E5D3'} />
              <stop offset="60%" stopColor={isDark ? '#2C4C29' : '#9CBF94'} />
              <stop offset="85%" stopColor={isDark ? '#3D6839' : '#55824E'} />
              <stop offset="100%" stopColor={isDark ? '#5BA654' : '#243324'} />
            </linearGradient>

            {/* Drop Shadows */}
            <filter id="d3BoroughShadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity={isDark ? 0.35 : 0.08} />
            </filter>
            <filter id="d3ActiveShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={isDark ? '#000000' : '#243324'} floodOpacity={isDark ? 0.55 : 0.22} />
            </filter>
          </defs>

          {/* D3 Zoomable Container Group */}
          <g ref={zoomGroupRef} id="d3-zoom-container">
            {/* 1. Borough Polygons colored by D3 Choropleth Scale */}
            <g id="d3-boroughs">
              {ACTIVE_BOROUGHS.map((borough) => {
                const isSelected = selectedBoroughId === borough.id;
                const isHovered = hoveredBoroughId === borough.id;

                const metrics = BOROUGH_METRICS[borough.name.toLowerCase()] || {
                  sites: borough.sites,
                  hives: borough.hives,
                  wildflowerAreaSqM: 1000,
                  jarsDonated: 150,
                };

                const metricVal = metricConfig.getValue(metrics);
                const d3Color = choroplethScale(metricVal);

                const fillStyle = isSelected
                  ? isDark
                    ? '#385434'
                    : '#243324'
                  : isHovered
                  ? isDark
                    ? '#2C4428'
                    : '#D9E8D4'
                  : d3Color;

                const strokeStyle = isSelected
                  ? isDark
                    ? '#85E7B7'
                    : '#142013'
                  : isHovered
                  ? isDark
                    ? '#688F62'
                    : '#3B4D36'
                  : isDark
                  ? '#2B3D28'
                  : '#243324';

                const strokeWidthVal = isSelected ? 1.4 : isHovered ? 1.0 : 0.75;

                return (
                  <path
                    key={borough.id}
                    d={borough.svgPath}
                    fill={fillStyle}
                    stroke={strokeStyle}
                    strokeWidth={strokeWidthVal}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className="cursor-pointer transition-colors duration-200"
                    filter={isSelected ? 'url(#d3ActiveShadow)' : 'url(#d3BoroughShadow)'}
                    onMouseEnter={() => handleBoroughMouseEnter(borough)}
                    onMouseLeave={handleBoroughMouseLeave}
                    onClick={() => handleBoroughClick(borough)}
                  />
                );
              })}
            </g>

            {/* 2. River Thames Ribbon */}
            <g id="d3-river-thames" className="pointer-events-none select-none">
              <path
                d={RIVER_THAMES_PATH}
                fill="none"
                stroke={isDark ? '#4D6B4A' : '#829c80'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* 3. D3 Generated Pollinator Flight Corridors */}
            {showFlightCorridors && (
              <g id="d3-flight-corridors" className="pointer-events-none">
                {flightCorridors.map((corridor) => (
                  <path
                    key={corridor.id}
                    d={corridor.path}
                    fill="none"
                    stroke={isDark ? '#F59E0B' : '#D97706'}
                    strokeWidth="0.85"
                    strokeDasharray="2 3"
                    className="opacity-60 animate-pulse"
                  />
                ))}
              </g>
            )}

            {/* 4. Borough Labels */}
            <g id="d3-borough-labels" className="pointer-events-none select-none">
              {ACTIVE_BOROUGHS.map((borough) => {
                const isSelected = selectedBoroughId === borough.id;
                const isHovered = hoveredBoroughId === borough.id;

                const displayName =
                  borough.name === 'Hammersmith and Fulham'
                    ? 'Hammersmith & Fulham'
                    : borough.name;

                const textStroke = isDark
                  ? isSelected
                    ? '#1E2C1C'
                    : '#152014'
                  : isSelected
                  ? '#243324'
                  : '#FBF9F5';

                const textFill = isDark
                  ? isSelected
                    ? '#FFFFFF'
                    : isHovered
                    ? '#FFFFFF'
                    : '#E2ECE0'
                  : isSelected
                  ? '#FFFFFF'
                  : isHovered
                  ? '#142013'
                  : '#243324';

                return (
                  <text
                    key={`label-${borough.id}`}
                    x={borough.labelPos.x}
                    y={borough.labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    stroke={textStroke}
                    strokeWidth={isSelected ? '0' : '1.5'}
                    strokeLinejoin="round"
                    paintOrder="stroke fill"
                    className={`font-semibold tracking-tight transition-colors select-none ${
                      isSelected
                        ? 'text-[7.6px] font-bold'
                        : isHovered
                        ? 'text-[7.2px] font-bold'
                        : 'text-[6.8px]'
                    }`}
                    style={{ fill: textFill }}
                  >
                    {displayName}
                  </text>
                );
              })}
            </g>

            {/* 5. Apiary Site Pins with D3 Proportional Radius & Expansion Rings */}
            <g id="d3-apiary-pins">
              {visibleSites.map((site) => {
                const isSelected = selectedSite?.id === site.id;
                const isHovered = hoveredSite?.id === site.id;
                const radius = pinRadiusScale(site.hives);
                const isNewlyEstablished =
                  selectedYear !== 'all' && site.expansionYear === selectedYear;

                return (
                  <g
                    key={site.id}
                    transform={`translate(${site.x}, ${site.y})`}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSite(site);
                      const b = ACTIVE_BOROUGHS.find(
                        (item) => item.name.toLowerCase() === site.borough.toLowerCase()
                      );
                      if (b) {
                        setSelectedBoroughId(b.id);
                        if (onSelectBorough) onSelectBorough(b.name);
                      }
                    }}
                    onMouseEnter={() => handleSiteMouseEnter(site)}
                    onMouseLeave={handleSiteMouseLeave}
                  >
                    {/* Pulsing Ripple Ring for Newly Expanded Sites */}
                    {isNewlyEstablished && (
                      <circle
                        r={radius * 2.8}
                        fill="none"
                        stroke={isDark ? '#F59E0B' : '#D97706'}
                        strokeWidth="1.2"
                        className="animate-ping opacity-75 origin-center"
                      />
                    )}

                    {/* Stationary Selection Ring */}
                    {isSelected && (
                      <circle
                        r={radius + 3.5}
                        fill="none"
                        stroke={isDark ? '#85E7B7' : '#1F2B1D'}
                        strokeWidth="1.4"
                        className="opacity-80"
                      />
                    )}

                    {/* Proportional D3 Circle */}
                    <circle
                      r={isSelected ? radius + 1.2 : isHovered ? radius + 0.8 : radius}
                      className={`transition-all duration-200 ${
                        isDark
                          ? isSelected
                            ? 'fill-[#85E7B7] stroke-[#152014] stroke-[1.5]'
                            : isHovered
                            ? 'fill-[#F4EFE6] stroke-[#152014] stroke-[1.2]'
                            : 'fill-[#F59E0B] stroke-[#152014] stroke-[0.9]'
                          : isSelected
                          ? 'fill-[#1F2B1D] stroke-[#FFFFFF] stroke-[1.5]'
                          : isHovered
                          ? 'fill-[#142013] stroke-[#FFFFFF] stroke-[1.2]'
                          : 'fill-[#D97706] stroke-[#FBF9F5] stroke-[0.9]'
                      }`}
                    />

                    {/* Inner Core Dot */}
                    <circle
                      r={1.2}
                      fill={isDark ? '#152014' : '#FFFFFF'}
                      className="pointer-events-none"
                    />
                  </g>
                );
              })}
            </g>
          </g>
        </svg>

        {/* D3 Zoom & Navigation Control Palette */}
        <div className="absolute bottom-5 right-5 z-20 flex flex-col items-center gap-1.5 bg-white/90 dark:bg-[#1A2819]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#243324]/12 dark:border-white/12 shadow-lg">
          <button
            onClick={handleD3ZoomIn}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-[#1F2B1D] dark:text-[#F4EFE6] hover:bg-[#F5F2EB] dark:hover:bg-[#263A25] font-bold text-sm cursor-pointer transition-colors"
            title="Zoom In (or Scroll Wheel)"
            aria-label="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleD3ZoomOut}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-[#1F2B1D] dark:text-[#F4EFE6] hover:bg-[#F5F2EB] dark:hover:bg-[#263A25] font-bold text-sm cursor-pointer transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            −
          </button>
          <button
            onClick={handleD3ResetZoom}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-[#657351] dark:text-[#A3B59E] hover:text-[#1F2B1D] dark:hover:text-white hover:bg-[#F5F2EB] dark:hover:bg-[#263A25] cursor-pointer transition-colors"
            title="Reset Map Extent"
            aria-label="Reset Map Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="text-[10px] font-mono text-[#657351] dark:text-[#A3B59E] border-t border-[#243324]/10 dark:border-white/10 pt-1 text-center w-full">
            {(currentZoomK * 100).toFixed(0)}%
          </div>
        </div>

        {/* D3 Choropleth Legend Display (Bottom Left) */}
        <div className="absolute bottom-5 left-5 z-20 p-3 rounded-2xl bg-white/90 dark:bg-[#1A2819]/90 backdrop-blur-md border border-[#243324]/12 dark:border-white/12 shadow-lg max-w-[240px] space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">
            <span>{metricConfig.label}</span>
            <span className="font-mono text-[10px] opacity-70">{metricConfig.shortUnit}</span>
          </div>
          <div className="w-full h-2 rounded-full border border-black/10 dark:border-white/10 bg-gradient-to-r from-[#F5F2EB] via-[#9CBF94] to-[#243324] dark:from-[#162315] dark:via-[#2C4C29] dark:to-[#5BA654]" />
          <div className="flex justify-between text-[10px] font-mono text-[#657351] dark:text-[#A3B59E]">
            <span>0</span>
            <span>{Math.round(maxMetricValue / 2)}</span>
            <span>{maxMetricValue}</span>
          </div>
        </div>

        {/* Expansion Milestone Banner (When Timeline Year Active) */}
        <AnimatePresence>
          {activeMilestone && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-md z-20 p-3.5 rounded-2xl bg-[#1F2B1D]/95 dark:bg-[#0E170E]/95 text-white backdrop-blur-md border border-white/15 shadow-xl space-y-1.5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {activeMilestone.year} Expansion Milestone
                </span>
                <span className="text-xs font-semibold text-emerald-300">
                  +{activeMilestone.newSitesCount} Sanctuaries Added
                </span>
              </div>
              <p className="text-xs font-medium text-white leading-snug">
                {activeMilestone.narrativeHeadline}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-[#CBD7C7] pt-0.5">
                <span>{activeMilestone.cumulativeSites} Total Sites</span>
                <span>•</span>
                <span>{activeMilestone.cumulativeHives} Total Hives</span>
                <span>•</span>
                <span>{activeMilestone.activeBoroughCount} Boroughs Active</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover Tooltip for Sites */}
        <AnimatePresence>
          {hoveredSite && !selectedSite && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute pointer-events-none z-30 bg-[#1F2B1D] dark:bg-[#0D150C] text-white px-3 py-2 rounded-xl text-xs shadow-xl space-y-0.5 border border-white/15"
              style={{
                left: `${((hoveredSite.x - MAP_DIMENSIONS.minX) / MAP_DIMENSIONS.width) * 100}%`,
                top: `${((hoveredSite.y - MAP_DIMENSIONS.minY) / MAP_DIMENSIONS.height) * 100}%`,
                transform: 'translate(-50%, -130%)',
              }}
            >
              <div className="font-semibold text-white">{hoveredSite.name}</div>
              <div className="flex items-center justify-between gap-3 text-[11px] text-[#CBD7C7]">
                <span>
                  {hoveredSite.buildingType} • {hoveredSite.borough}
                </span>
                <span className="font-semibold text-amber-300">
                  Est. {getSiteExpansionYear(hoveredSite.id)}
                </span>
              </div>
              <div className="text-[11px] text-emerald-300 font-medium">
                {hoveredSite.hives} Hives • {hoveredSite.wildflowerAreaSqM} m² Meadow
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Site Details Card */}
        <AnimatePresence>
          {selectedSite && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="absolute top-4 right-4 max-h-[92%] w-[90%] sm:w-[340px] z-30 bg-white/95 dark:bg-[#1C291B]/95 backdrop-blur-md rounded-3xl border border-[#243324]/12 dark:border-white/15 shadow-2xl p-5 overflow-y-auto flex flex-col space-y-4 transition-colors duration-400"
            >
              {/* Header & Close Icon */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-[#3B4D36]/10 dark:bg-white/10 text-[#3B4D36] dark:text-[#85E7B7]">
                      {selectedSite.buildingType}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 font-mono">
                      Est. {getSiteExpansionYear(selectedSite.id)}
                    </span>
                  </div>
                  <h4 className="font-display text-xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-snug">
                    {selectedSite.name}
                  </h4>
                  {selectedSite.addressSnippet && (
                    <p className="text-xs text-[#657351] dark:text-[#A3B59E] font-light">
                      {selectedSite.addressSnippet} • {selectedSite.borough}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedSite(null)}
                  className="p-1.5 rounded-full hover:bg-[#243324]/8 dark:hover:bg-white/10 text-[#657351] dark:text-[#A3B59E] cursor-pointer shrink-0 transition-colors"
                  aria-label="Close site details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-[#FBF9F5] dark:bg-[#141E13] border border-[#243324]/6 dark:border-white/10">
                  <div className="font-display text-2xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal">
                    {selectedSite.hives}
                  </div>
                  <div className="text-[11px] text-[#657351] dark:text-[#A3B59E]">Active Hives</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#FBF9F5] dark:bg-[#141E13] border border-[#243324]/6 dark:border-white/10">
                  <div className="font-display text-2xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal">
                    {selectedSite.wildflowerAreaSqM}{' '}
                    <span className="text-xs font-sans font-light">m²</span>
                  </div>
                  <div className="text-[11px] text-[#657351] dark:text-[#A3B59E]">Wildflower Meadow</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#FBF9F5] dark:bg-[#141E13] border border-[#243324]/6 dark:border-white/10">
                  <div className="font-display text-2xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal">
                    {selectedSite.honeyHarvestKg}{' '}
                    <span className="text-xs font-sans font-light">kg</span>
                  </div>
                  <div className="text-[11px] text-[#657351] dark:text-[#A3B59E]">Raw Honey Yield</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#FBF9F5] dark:bg-[#141E13] border border-[#243324]/6 dark:border-white/10">
                  <div className="font-display text-2xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal">
                    {selectedSite.jarsDonated}
                  </div>
                  <div className="text-[11px] text-[#657351] dark:text-[#A3B59E]">Jars to Food Banks</div>
                </div>
              </div>

              {/* Environmental Co-Benefit: Stormwater */}
              <div className="p-3.5 rounded-2xl bg-[#E8EFE6]/70 dark:bg-[#233421] border border-[#3B4D36]/15 dark:border-white/10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white dark:bg-[#141E13] text-[#3B4D36] dark:text-[#85E7B7] shadow-xs">
                  <Droplets className="w-4 h-4 text-emerald-700 dark:text-[#85E7B7]" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">
                    {selectedSite.rainwaterL.toLocaleString()} Litres
                  </div>
                  <div className="text-[#657351] dark:text-[#CBD7C7]">Stormwater absorbed from London sewers</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
