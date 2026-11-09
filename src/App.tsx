/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { PrintBanner } from './components/PrintBanner';
import { PrintReportCover } from './components/PrintReportCover';
import { PrintDataTable } from './components/PrintDataTable';
import { HeroSection } from './components/HeroSection';
import { OverviewSection } from './components/OverviewSection';
import { BoroughCorridorSection } from './components/BoroughCorridorSection';
import { StormwaterClimateSection } from './components/StormwaterClimateSection';
import { SectorImpactSection } from './components/SectorImpactSection';
import { FoodSharingSection } from './components/FoodSharingSection';
import { EducationSection } from './components/EducationSection';
import { RoadmapGratitudeSection } from './components/RoadmapGratitudeSection';

function MainContent() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <div className="relative min-h-screen bg-[#FBF9F5] dark:bg-[#131D12] text-[#243324] dark:text-[#F4EFE6] font-sans antialiased selection:bg-[#E8DCC4] dark:selection:bg-[#384F35] selection:text-[#1F2B1D] dark:selection:text-[#F4EFE6] transition-colors duration-400">
      {/* On-Screen High-Contrast Print Preview Banner (Hidden during actual print) */}
      <PrintBanner />

      {/* Top Floating Navigation with Sun/Moon Toggle & Print Button */}
      <Navbar />

      {/* Top Reading Progress Bar (Hidden during print) */}
      <motion.div
        style={{ scaleX }}
        className="print-hide fixed top-0 left-0 right-0 h-1 bg-[#3B4D36] dark:bg-[#4A6D47] origin-left z-50 pointer-events-none transition-colors duration-300"
      />

      {/* Main Report Flow */}
      <main className="w-full overflow-x-hidden">
        {/* Formal High-Contrast Monograph Cover Page for Print & PDF */}
        <PrintReportCover />

        <HeroSection />
        <OverviewSection />
        <BoroughCorridorSection />
        <StormwaterClimateSection />
        <SectorImpactSection />

        {/* Formal Consolidated Data Index Table for Print & PDF */}
        <PrintDataTable />

        <FoodSharingSection />
        <EducationSection />
        <RoadmapGratitudeSection />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}


