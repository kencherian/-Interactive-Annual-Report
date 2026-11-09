import React from 'react';
import { REPORT_METADATA } from '../data/reportData';

export const PrintReportCover: React.FC = () => {
  return (
    <div className="print-only hidden print-cover-page w-full p-8 sm:p-12 border-4 border-black my-6 bg-white text-black font-sans">
      {/* Top Formal Double Rule */}
      <div className="border-b-4 border-black pb-6 mb-8">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest font-mono text-black font-bold pb-2 border-b border-black">
          <span>Official Impact Publication</span>
          <span>Reporting Year 2025 / 2026</span>
          <span>Registered UK Charity #{REPORT_METADATA.charityNumber}</span>
        </div>

        <div className="pt-8 space-y-3">
          <p className="text-xs uppercase tracking-widest font-mono text-black font-semibold">
            Environmental & Urban Ecology Monograph
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-black leading-tight">
            The Urban Hive Project
          </h1>
          <p className="font-serif text-2xl sm:text-3xl font-normal text-black italic">
            2026 Annual Ecological & Community Impact Report
          </p>
          <p className="text-base text-neutral-800 font-light max-w-2xl pt-2 leading-relaxed">
            Cultivating engineered rooftop wildflower sanctuaries and continuous ecological pollinator corridors across 11 Greater London boroughs.
          </p>
        </div>
      </div>

      {/* Executive Key Impact Matrix - 6 High-Contrast Boxes */}
      <div className="mb-10">
        <h2 className="text-xs font-mono uppercase tracking-widest font-bold mb-4 border-b-2 border-black pb-1">
          Executive Impact Matrix (Consolidated Metrics)
        </h2>
        <div className="grid grid-cols-3 gap-4 text-left">
          <div className="border-2 border-black p-4">
            <span className="block text-4xl font-serif font-bold text-black leading-none">
              {REPORT_METADATA.totalSites}
            </span>
            <span className="block text-xs uppercase tracking-wider font-bold mt-2">
              Rooftop Sanctuaries
            </span>
            <span className="block text-[11px] text-neutral-700 mt-1">
              Active across 11 municipal boroughs
            </span>
          </div>

          <div className="border-2 border-black p-4">
            <span className="block text-4xl font-serif font-bold text-black leading-none">
              {REPORT_METADATA.totalHives}
            </span>
            <span className="block text-xs uppercase tracking-wider font-bold mt-2">
              Managed Colonies
            </span>
            <span className="block text-[11px] text-neutral-700 mt-1">
              Colonies cared for by certified apiarists
            </span>
          </div>

          <div className="border-2 border-black p-4">
            <span className="block text-4xl font-serif font-bold text-black leading-none">
              {REPORT_METADATA.meadowAreaSqM.toLocaleString()} m²
            </span>
            <span className="block text-xs uppercase tracking-wider font-bold mt-2">
              Wildflower Living Roof
            </span>
            <span className="block text-[11px] text-neutral-700 mt-1">
              Engineered bio-diverse extensive sedum & soil
            </span>
          </div>

          <div className="border-2 border-black p-4">
            <span className="block text-4xl font-serif font-bold text-black leading-none">
              {(REPORT_METADATA.stormwaterLitres / 1000000).toFixed(2)}M L
            </span>
            <span className="block text-xs uppercase tracking-wider font-bold mt-2">
              Stormwater Diverted
            </span>
            <span className="block text-[11px] text-neutral-700 mt-1">
              Absorbed from municipal sewer overflow
            </span>
          </div>

          <div className="border-2 border-black p-4">
            <span className="block text-4xl font-serif font-bold text-black leading-none">
              9.7M
            </span>
            <span className="block text-xs uppercase tracking-wider font-bold mt-2">
              Honeybees Supported
            </span>
            <span className="block text-[11px] text-neutral-700 mt-1">
              Estimated active urban foraging population
            </span>
          </div>

          <div className="border-2 border-black p-4">
            <span className="block text-4xl font-serif font-bold text-black leading-none">
              {REPORT_METADATA.jarsDonated.toLocaleString()}
            </span>
            <span className="block text-xs uppercase tracking-wider font-bold mt-2">
              Food Bank Jars Donated
            </span>
            <span className="block text-[11px] text-neutral-700 mt-1">
              Pure raw honey shared with local food pantries
            </span>
          </div>
        </div>
      </div>

      {/* Table of Contents Summary for Print */}
      <div className="mb-10 border border-black p-4">
        <h3 className="text-xs font-mono uppercase tracking-widest font-bold border-b border-black pb-1 mb-3">
          Document Structure & Table of Contents
        </h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
          <div className="flex justify-between border-b border-dotted border-neutral-400 py-1">
            <span>Section 01: Executive Overview & Wildlife Impact</span>
            <span className="font-mono font-semibold">p. 2</span>
          </div>
          <div className="flex justify-between border-b border-dotted border-neutral-400 py-1">
            <span>Section 02: Ecological Connectivity & Borough Corridors</span>
            <span className="font-mono font-semibold">p. 3</span>
          </div>
          <div className="flex justify-between border-b border-dotted border-neutral-400 py-1">
            <span>Section 03: Climate Resilience & Stormwater Sponge Roofs</span>
            <span className="font-mono font-semibold">p. 4</span>
          </div>
          <div className="flex justify-between border-b border-dotted border-neutral-400 py-1">
            <span>Section 04: Sector Ecosystem & Biodiversity Net Gain</span>
            <span className="font-mono font-semibold">p. 5</span>
          </div>
          <div className="flex justify-between border-b border-dotted border-neutral-400 py-1">
            <span>Section 05: Food Equity & Community Harvest Sharing</span>
            <span className="font-mono font-semibold">p. 6</span>
          </div>
          <div className="flex justify-between border-b border-dotted border-neutral-400 py-1">
            <span>Section 06: Education, Youth Field Labs & Apprenticeships</span>
            <span className="font-mono font-semibold">p. 7</span>
          </div>
          <div className="flex justify-between border-b border-dotted border-neutral-400 py-1 col-span-2">
            <span>Section 07: 2027 Strategic Horizons & Founder Letter</span>
            <span className="font-mono font-semibold">p. 8</span>
          </div>
        </div>
      </div>

      {/* Footer Colophon */}
      <div className="pt-4 border-t-2 border-black flex justify-between items-center text-[11px] font-mono text-neutral-700">
        <div>
          <span>Published by The Urban Hive Project • London, UK</span>
        </div>
        <div>
          <span>Audited Environmental Data • Certified ISO 14001 Standards</span>
        </div>
      </div>
    </div>
  );
};
