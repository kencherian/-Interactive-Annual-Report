import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { AnimatedNumber } from './AnimatedNumber';
import { REPORT_METADATA } from '../data/reportData';
import { IMAGES } from '../assets/images';
import {
  staggerContainer,
  fadeInUp,
  fadeInScale,
  defaultViewport,
} from '../utils/animationVariants';

export const OverviewSection: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Smooth parallax scroll tracking mapped safely to card entry and exit
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // Clamped parallax ensures the image is always 100% visible and anchored
  const imageY = useTransform(scrollYProgress, [0, 1], ['-22%', '0%'], { clamp: true });

  return (
    <section
      id="overview-section"
      className="relative bg-[#FBF9F5] dark:bg-[#131D12] text-[#243324] dark:text-[#F4EFE6] pt-14 sm:pt-20 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-12 flex flex-col justify-between overflow-hidden transition-colors duration-400"
    >
      <div className="max-w-6xl mx-auto w-full space-y-12 sm:space-y-16">
        {/* Visual Showcase Card Container with Strong Parallax & Fluid Reveal */}
        <motion.div
          ref={cardRef}
          variants={fadeInScale}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="relative h-[480px] sm:h-[600px] lg:h-[700px] w-full rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl bg-[#1F2B1D]"
        >
          <motion.img
            style={{ y: imageY }}
            src={IMAGES.fiftyTwoRooftops}
            alt="Fifty-two London rooftops transformed into living biodiversity sanctuaries"
            referrerPolicy="no-referrer"
            className="absolute top-0 left-0 w-full h-[135%] object-cover object-center max-w-none will-change-transform"
          />

          {/* Subtle bottom gradient overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F2B1D]/85 via-[#1F2B1D]/25 to-transparent pointer-events-none z-10" />

          {/* Overlay Insight / "So What" - Staggered fade in */}
          <motion.div
            variants={fadeInUp}
            className="absolute bottom-8 left-8 right-8 sm:bottom-12 sm:left-12 sm:right-12 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-[#F4EFE6]"
          >
            <div className="max-w-2xl">
              <p className="font-display text-2xl sm:text-4xl lg:text-5xl leading-tight font-light text-[#F4EFE6] drop-shadow-md">
                Fifty-two rooftops transformed into blooming, living havens for London’s wildlife.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Quantitative Impact Highlights - Fluid Staggered Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25, margin: '-40px' }}
          className="w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-4 pb-4 border-t border-[#243324]/10 dark:border-white/10">
            <motion.div variants={fadeInUp} className="space-y-1">
              <div className="font-display text-4xl sm:text-6xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light tracking-tight">
                <AnimatedNumber value={9.7} decimals={1} suffix="M" />
              </div>
              <p className="text-base text-[#4A5D44] dark:text-[#CBD7C7] font-medium">Estimated Honeybees Supported</p>
              <p className="text-sm text-[#657351] dark:text-[#A3B59E] font-light">
                Buzzing happily across London neighborhoods
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-1">
              <div className="font-display text-4xl sm:text-6xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light tracking-tight">
                <AnimatedNumber value={REPORT_METADATA.totalHives} />
              </div>
              <p className="text-base text-[#4A5D44] dark:text-[#CBD7C7] font-medium">Active Rooftop Apiaries</p>
              <p className="text-sm text-[#657351] dark:text-[#A3B59E] font-light">
                Maintained across 52 partner buildings
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-1">
              <div className="font-display text-4xl sm:text-6xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light tracking-tight">
                <AnimatedNumber value={17889} suffix=" m²" />
              </div>
              <p className="text-base text-[#4A5D44] dark:text-[#CBD7C7] font-medium">Engineered Wildflower Meadow</p>
              <p className="text-sm text-[#657351] dark:text-[#A3B59E] font-light">
                Rich with 24+ native species per site
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

