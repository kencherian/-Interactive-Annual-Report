import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, X, Sparkles, Filter, ArrowUpRight } from 'lucide-react';
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES } from '../data/glossaryData';
import { GlossaryTerm } from '../types';

export interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTermId?: string;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
  initialTermId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTermId, setSelectedTermId] = useState<string | null>(initialTermId || null);

  useEffect(() => {
    if (initialTermId) {
      setSelectedTermId(initialTermId);
    }
  }, [initialTermId]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered terms based on search query and category
  const filteredTerms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return GLOSSARY_TERMS.filter((term) => {
      const matchesCategory =
        selectedCategory === 'All' || term.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!query) return true;

      const inTerm = term.term.toLowerCase().includes(query);
      const inDefinition = term.definition.toLowerCase().includes(query);
      const inContext = term.projectContext?.toLowerCase().includes(query) ?? false;
      const inAliases = term.aliases?.some((a) => a.toLowerCase().includes(query)) ?? false;

      return inTerm || inDefinition || inContext || inAliases;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#131D12]/75 dark:bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#FBF9F5] dark:bg-[#162415] rounded-[2rem] border border-[#243324]/15 dark:border-white/15 shadow-2xl overflow-hidden flex flex-col text-[#243324] dark:text-[#F4EFE6]"
          >
            {/* Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-[#243324]/10 dark:border-white/10 flex items-center justify-between gap-4 bg-[#F5F2EB]/60 dark:bg-[#1B2B1A]/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#243324]/10 dark:bg-white/10 text-[#243324] dark:text-[#F4EFE6]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-tight">
                    Environmental Terminology & Urban Planning Glossary
                  </h3>
                  <p className="text-xs text-[#52634E] dark:text-[#A6B9A1]">
                    Key ecological concepts, hydrological engineering, and apiculture terms used in the 2026 report
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close glossary modal"
                className="p-2 rounded-full text-[#52634E] dark:text-[#A6B9A1] hover:text-[#1F2B1D] dark:hover:text-white hover:bg-[#243324]/10 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Category Filter Controls */}
            <div className="p-4 sm:p-6 border-b border-[#243324]/10 dark:border-white/10 space-y-3 bg-[#FBF9F5] dark:bg-[#162415]">
              {/* Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#657351] dark:text-[#A3B59E]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search terminology (e.g., 'bio-corridors', 'sponge roofs', 'attenuation', 'UHI')..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#20311F] border border-[#243324]/15 dark:border-white/15 text-sm placeholder-[#657351]/60 dark:placeholder-[#A3B59E]/60 text-[#1F2B1D] dark:text-[#F4EFE6] focus:outline-none focus:ring-2 focus:ring-[#3B4D36] dark:focus:ring-[#96A88F] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-xs text-[#657351] hover:text-[#1F2B1D] dark:hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Pills (Interactive Filter Controls) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
                <span className="text-[11px] font-semibold text-[#657351] dark:text-[#A3B59E] uppercase tracking-wider mr-1 hidden sm:inline-flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Filter:
                </span>
                {GLOSSARY_CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#1F2B1D] dark:bg-[#344732] text-white dark:text-[#F4EFE6] shadow-xs'
                          : 'bg-black/5 dark:bg-white/5 text-[#4A5D44] dark:text-[#CBD7C7] hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Terms List Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {filteredTerms.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="font-display text-lg text-[#1F2B1D] dark:text-[#F4EFE6]">No matching terminology found</p>
                  <p className="text-xs text-[#52634E] dark:text-[#A6B9A1]">
                    Try clearing your search query or selecting "All" categories.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTerms.map((term) => (
                    <div
                      key={term.id}
                      className="p-5 rounded-2xl bg-white dark:bg-[#1E2E1D] border border-[#243324]/10 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-3.5 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
                            {term.category}
                          </span>
                          {term.metricReference && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F5F2EB] dark:bg-[#273B26] text-[#3B4D36] dark:text-[#C5D8C1]">
                              {term.metricReference}
                            </span>
                          )}
                        </div>

                        <h4 className="font-display text-xl text-[#1F2B1D] dark:text-[#F4EFE6] font-medium leading-tight">
                          {term.term}
                        </h4>

                        <p className="text-xs sm:text-sm text-[#384834] dark:text-[#CBD7C7] font-light leading-relaxed">
                          {term.definition}
                        </p>
                      </div>

                      {term.projectContext && (
                        <div className="p-3 rounded-xl bg-[#F5F2EB] dark:bg-[#253724] border border-[#243324]/5 dark:border-white/5 space-y-1">
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]">
                            <Sparkles className="w-3 h-3 text-[#657351] dark:text-[#A3B59E]" />
                            <span>Application in London</span>
                          </div>
                          <p className="text-xs text-[#52634E] dark:text-[#B2C5AE] font-light leading-relaxed">
                            {term.projectContext}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            <div className="px-6 py-3.5 border-t border-[#243324]/10 dark:border-white/10 bg-[#F5F2EB]/60 dark:bg-[#1B2B1A]/60 flex items-center justify-between text-xs text-[#52634E] dark:text-[#A6B9A1]">
              <span>
                Showing {filteredTerms.length} of {GLOSSARY_TERMS.length} specialized concepts
              </span>
              <span className="text-[11px]">
                Hover dotted terms across any section to view inline definitions
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
