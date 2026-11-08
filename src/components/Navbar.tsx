import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { Sun, Moon, ChevronDown, Check, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { GlossaryModal } from './GlossaryModal';

export interface NavSection {
  id: string;
  label: string;
  shortLabel: string;
  number: string;
}

export const NAV_SECTIONS: NavSection[] = [
  { id: 'overview-section', label: 'Overview', shortLabel: 'Overview', number: '01' },
  { id: 'ecological-connectivity', label: 'Corridors', shortLabel: 'Corridors', number: '02' },
  { id: 'climate-resilience', label: 'Climate', shortLabel: 'Climate', number: '03' },
  { id: 'sector-ecosystem', label: 'Sectors & Bio', shortLabel: 'Sectors', number: '04' },
  { id: 'food-equity', label: 'Food Equity', shortLabel: 'Food', number: '05' },
  { id: 'education-youth', label: 'Education', shortLabel: 'Education', number: '06' },
  { id: 'strategic-horizons', label: '2027 Vision', shortLabel: 'Vision', number: '07' },
];

export const Navbar: React.FC = () => {
  const { scrollY } = useScroll();
  const { isDark, toggleTheme } = useTheme();
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('hero-section');
  const [isMobileTOCOpen, setIsMobileTOCOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Track hero scroll threshold for theme button styling
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const threshold = typeof window !== 'undefined' ? window.innerHeight * 0.65 : 500;
    setIsScrolledPastHero(latest >= threshold);
  });

  // Dynamic active section observer and scroll position tracker
  useEffect(() => {
    const sectionIds = ['hero-section', ...NAV_SECTIONS.map((s) => s.id)];

    const handleScroll = () => {
      // Calculate current reading position offset by navbar height + generous viewport margin
      const scrollPosition = window.scrollY + 140;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSectionId(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileTOCOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollToSection = (id: string) => {
    setActiveSectionId(id);
    const el = document.getElementById(id);
    if (el) {
      const navbarOffset = 72;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - navbarOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
    }
  };

  const currentSectionMeta = NAV_SECTIONS.find((s) => s.id === activeSectionId);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 sm:py-4 px-3 sm:px-6 lg:px-10 pointer-events-none flex justify-between items-center transition-all duration-300">
      {/* Brand Identity / Home Anchor */}
      <div className="pointer-events-auto flex items-center">
        <button
          onClick={() => handleScrollToSection('hero-section')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer shadow-sm border ${
            isScrolledPastHero
              ? 'bg-white/80 dark:bg-[#1A2819]/85 border-[#243324]/12 dark:border-white/12 text-[#1F2B1D] dark:text-[#F4EFE6] hover:bg-white dark:hover:bg-[#243823]'
              : 'bg-black/25 hover:bg-black/40 border-white/20 text-[#F4EFE6]'
          }`}
          title="Scroll back to top"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-display font-medium text-xs sm:text-sm tracking-tight">
            The Urban Hive
          </span>
        </button>
      </div>

      {/* Dynamic Floating Table of Contents: Desktop & Tablet */}
      <nav
        aria-label="Report Table of Contents"
        className="pointer-events-auto hidden md:flex items-center p-1 rounded-full backdrop-blur-md bg-white/80 dark:bg-[#1A2819]/85 border border-[#243324]/12 dark:border-white/12 shadow-md transition-all duration-300"
      >
        {NAV_SECTIONS.map((section) => {
          const isActive = activeSectionId === section.id;
          return (
            <button
              key={section.id}
              onClick={() => handleScrollToSection(section.id)}
              className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer select-none ${
                isActive
                  ? 'text-white dark:text-[#F4EFE6] font-semibold'
                  : 'text-[#4A5D44] dark:text-[#CBD7C7] hover:text-[#1F2B1D] dark:hover:text-white'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeSectionPill"
                  className="absolute inset-0 bg-[#1F2B1D] dark:bg-[#344732] rounded-full shadow-xs"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-mono transition-opacity ${
                    isActive ? 'opacity-80 font-bold' : 'opacity-50'
                  }`}
                >
                  {section.number}
                </span>
                <span className="hidden lg:inline">{section.label}</span>
                <span className="inline lg:hidden">{section.shortLabel}</span>
              </span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Floating Table of Contents: Compact Pill with Dropdown */}
      <div className="pointer-events-auto relative md:hidden" ref={mobileMenuRef}>
        <button
          onClick={() => setIsMobileTOCOpen((prev) => !prev)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md transition-all duration-300 border shadow-sm text-xs font-medium cursor-pointer ${
            isScrolledPastHero
              ? 'bg-white/85 dark:bg-[#1A2819]/85 border-[#243324]/15 dark:border-white/15 text-[#1F2B1D] dark:text-[#F4EFE6]'
              : 'bg-black/25 hover:bg-black/40 border-white/20 text-[#F4EFE6]'
          }`}
          aria-label="Table of Contents Menu"
          aria-expanded={isMobileTOCOpen}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="font-mono text-[10px] opacity-70">
            {currentSectionMeta?.number || '00'}
          </span>
          <span className="max-w-[85px] truncate font-medium">
            {currentSectionMeta?.shortLabel || 'Intro'}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isMobileTOCOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Mobile Dropdown Panel */}
        <AnimatePresence>
          {isMobileTOCOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.16 }}
              className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 dark:bg-[#1C2C1B]/95 backdrop-blur-xl border border-[#243324]/15 dark:border-white/15 shadow-2xl p-1.5 z-50 text-left space-y-0.5"
            >
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E] border-b border-[#243324]/10 dark:border-white/10 mb-1">
                Report Sections
              </div>
              {NAV_SECTIONS.map((sec) => {
                const isSelected = activeSectionId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      handleScrollToSection(sec.id);
                      setIsMobileTOCOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1F2B1D] text-white dark:bg-[#344732] dark:text-[#F4EFE6] font-semibold shadow-xs'
                        : 'text-[#4A5D44] dark:text-[#CBD7C7] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-60">{sec.number}</span>
                      <span>{sec.label}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Controls: Glossary, Year Badge & Sun/Moon Toggle */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        {/* Glossary Quick Reference Modal Trigger */}
        <button
          type="button"
          onClick={() => setIsGlossaryOpen(true)}
          aria-label="Open Environmental Terminology Glossary"
          title="Browse 15 environmental & urban planning definitions"
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm text-xs font-medium focus:outline-none focus:ring-2 ${
            isScrolledPastHero
              ? 'bg-white/80 dark:bg-[#1A2819]/85 border-[#243324]/12 dark:border-white/12 text-[#1F2B1D] dark:text-[#F4EFE6] hover:bg-white dark:hover:bg-[#253924] focus:ring-[#243324]/20'
              : 'bg-black/25 hover:bg-black/40 border-white/20 text-white focus:ring-white/40'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#54734D] dark:text-[#A3B59E]" />
          <span className="hidden sm:inline">Glossary</span>
        </button>

        <span
          className={`text-xs font-semibold tracking-widest uppercase select-none hidden sm:inline-block transition-colors duration-300 ${
            isScrolledPastHero
              ? 'text-[#4A5D44] dark:text-[#A3B59E]'
              : 'text-[#F4EFE6] drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]'
          }`}
        >
          2026
        </span>

        {/* Persistent Sun / Moon Theme Toggle */}
        <button
          id="theme-toggle-btn"
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className={`p-2 rounded-full border backdrop-blur-md transition-all duration-200 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 shadow-sm ${
            isScrolledPastHero
              ? 'bg-white/80 dark:bg-[#1A2819]/85 border-[#243324]/12 dark:border-white/12 text-[#1F2B1D] dark:text-[#F4EFE6] hover:bg-white dark:hover:bg-[#253924] focus:ring-[#243324]/20'
              : 'bg-black/25 hover:bg-black/40 border-white/20 text-white focus:ring-white/40'
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="sun-icon"
                initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center"
              >
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              </motion.div>
            ) : (
              <motion.div
                key="moon-icon"
                initial={{ rotate: 90, scale: 0.7, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center"
              >
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1F2B1D]" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Terminology Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </header>
  );
};
