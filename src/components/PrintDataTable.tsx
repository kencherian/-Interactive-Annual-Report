import React from 'react';
import { BOROUGHS_DATA, SECTOR_DATA } from '../data/reportData';

export const PrintDataTable: React.FC = () => {
  return (
    <div className="print-only hidden print-avoid-break w-full my-8 text-black font-sans">
      <h3 className="font-serif text-2xl font-bold mb-2 pb-1 border-b-2 border-black">
        Comprehensive Data Index: Borough & Sector Allocations
      </h3>
      <p className="text-xs text-neutral-700 mb-4">
        Official figures audited for the 2025/2026 reporting cycle across all 11 active boroughs.
      </p>

      {/* Borough Summary Table */}
      <table className="w-full text-xs border-collapse border-2 border-black mb-6">
        <thead>
          <tr className="border-b-2 border-black bg-neutral-100">
            <th className="p-2 border-r border-black text-left font-bold font-mono">Borough Name</th>
            <th className="p-2 border-r border-black text-center font-bold font-mono">Active Sites</th>
            <th className="p-2 border-r border-black text-center font-bold font-mono">Active Hives</th>
            <th className="p-2 border-r border-black text-right font-bold font-mono">Meadow Canopy</th>
            <th className="p-2 text-right font-bold font-mono">Donated Jars</th>
          </tr>
        </thead>
        <tbody>
          {BOROUGHS_DATA.map((b, idx) => (
            <tr key={b.borough} className={`border-b border-black ${idx % 2 === 1 ? 'bg-neutral-50' : ''}`}>
              <td className="p-2 border-r border-black font-medium">{b.borough}</td>
              <td className="p-2 border-r border-black text-center font-mono">{b.sites}</td>
              <td className="p-2 border-r border-black text-center font-mono font-bold">{b.hives}</td>
              <td className="p-2 border-r border-black text-right font-mono">{(b.hives * 92).toLocaleString()} m²</td>
              <td className="p-2 text-right font-mono">{(b.hives * 20).toLocaleString()}</td>
            </tr>
          ))}
          <tr className="border-t-2 border-black font-bold bg-neutral-100">
            <td className="p-2 border-r border-black">Greater London Totals (11 Boroughs)</td>
            <td className="p-2 border-r border-black text-center font-mono">52</td>
            <td className="p-2 border-r border-black text-center font-mono">194</td>
            <td className="p-2 border-r border-black text-right font-mono">17,889 m²</td>
            <td className="p-2 text-right font-mono">3,840</td>
          </tr>
        </tbody>
      </table>

      {/* Sector Summary Table */}
      <h4 className="font-serif text-lg font-bold mb-2 pb-1 border-b border-black">
        Sector Allocation & Economic Self-Sufficiency
      </h4>
      <table className="w-full text-xs border-collapse border border-black">
        <thead>
          <tr className="border-b border-black bg-neutral-100 font-mono">
            <th className="p-2 border-r border-black text-left font-bold">Building Sector</th>
            <th className="p-2 border-r border-black text-center font-bold">Sites</th>
            <th className="p-2 border-r border-black text-center font-bold">Hives</th>
            <th className="p-2 border-r border-black text-right font-bold">Meadow (m²)</th>
            <th className="p-2 border-r border-black text-right font-bold">Harvest (kg)</th>
            <th className="p-2 text-right font-bold">Funding Generated</th>
          </tr>
        </thead>
        <tbody>
          {SECTOR_DATA.map((s, idx) => (
            <tr key={s.buildingType} className={`border-b border-black ${idx % 2 === 1 ? 'bg-neutral-50' : ''}`}>
              <td className="p-2 border-r border-black font-medium">{s.buildingType}</td>
              <td className="p-2 border-r border-black text-center font-mono">{s.sites}</td>
              <td className="p-2 border-r border-black text-center font-mono">{s.hives}</td>
              <td className="p-2 border-r border-black text-right font-mono">{s.wildflowerArea.toLocaleString()}</td>
              <td className="p-2 border-r border-black text-right font-mono">{s.honeyHarvestKg.toFixed(1)}</td>
              <td className="p-2 text-right font-mono font-bold">£{s.corporateSponsorship.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
