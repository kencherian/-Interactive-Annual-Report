import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, X, Info } from 'lucide-react';
import { findGlossaryTerm } from '../data/glossaryData';
import { GlossaryTerm } from '../types';

export interface TermTooltipProps {
  /**
   * The term key, name, or alias to look up in the glossary database.
   */
  term?: string;
  /**
   * Direct override for the displayed term title.
   */
  title?: string;
  /**
   * Direct override for category label.
   */
  category?: string;
  /**
   * Direct override for the definition text.
   */
  definition?: string;
  /**
   * Optional project context or real-world application note.
   */
  context?: string;
  /**
   * Optional key metric snippet.
   */
  metric?: string;
  /**
   * Inline text or React nodes to wrap. If omitted, uses the matched term's title.
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes to apply to the inline trigger.
   */
  className?: string;
}

export const TermTooltip: React.FC<TermTooltipProps> = ({
  term,
  title,
  category,
  definition,
  context,
  metric,
  children,
  className = '',
}) => {
  // Resolve glossary entry if term string provided
  const glossaryEntry = term ? findGlossaryTerm(term) : undefined;

  const displayTitle = title || glossaryEntry?.term || (typeof children === 'string' ? children : term) || 'Key Term';
  const displayCategory = category || glossaryEntry?.category || 'Urban Ecology';
  const displayDefinition = definition || glossaryEntry?.definition || 'Specialized environmental concept used across London urban biodiversity monitoring.';
  const displayContext = context || glossaryEntry?.projectContext;
  const displayMetric = metric || glossaryEntry?.metricReference;

  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; placement: 'top' | 'bottom'; arrowOffset: number }>({
    top: 0,
    left: 0,
    placement: 'top',
    arrowOffset: 0,
  });

  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = Math.min(380, window.innerWidth - 32);
    const tooltipHeight = 220; // approximate height for clearance check

    // Check vertical clearance: prefer top if space >= 220px, otherwise bottom
    const spaceAbove = triggerRect.top;
    const placement: 'top' | 'bottom' = spaceAbove >= tooltipHeight + 16 ? 'top' : 'bottom';

    // Calculate horizontal center aligned with trigger
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    let targetLeft = triggerCenterX - tooltipWidth / 2;

    // Clamp horizontally to stay within viewport bounds (16px margin)
    const minLeft = 16;
    const maxLeft = window.innerWidth - tooltipWidth - 16;
    targetLeft = Math.max(minLeft, Math.min(maxLeft, targetLeft));

    // Arrow offset relative to tooltip center
    const arrowOffset = triggerCenterX - (targetLeft + tooltipWidth / 2);

    // Vertical coordinate
    const targetTop = placement === 'top'
      ? triggerRect.top - 10
      : triggerRect.bottom + 10;

    setCoords({
      top: targetTop,
      left: targetLeft,
      placement,
      arrowOffset,
    });
  }, []);

  const handleOpen = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      updatePosition();
      setIsOpen(true);
    }, 80);
  }, [updatePosition]);

  const handleClose = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  }, []);

  const toggleOpen = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      updatePosition();
      setIsOpen(true);
    }
  }, [isOpen, updatePosition]);

  // Recalculate on window resize or scroll when active
  useEffect(() => {
    if (!isOpen) return;

    const onScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('resize', onScrollOrResize, { passive: true });
    window.addEventListener('scroll', onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  // Handle escape key and click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const tooltipPortal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          aria-live="polite"
          onMouseEnter={() => {
            if (timerRef.current) clearTimeout(timerRef.current);
          }}
          onMouseLeave={handleClose}
          initial={{
            opacity: 0,
            y: coords.placement === 'top' ? 8 : -8,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: coords.placement === 'top' ? 6 : -6,
            scale: 0.96,
            transition: { duration: 0.15 },
          }}
          transition={{
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            position: 'fixed',
            top: coords.placement === 'top' ? undefined : coords.top,
            bottom: coords.placement === 'top' ? window.innerHeight - coords.top : undefined,
            left: coords.left,
            zIndex: 9999,
            width: 'min(380px, calc(100vw - 32px))',
          }}
          className="rounded-2xl p-5 bg-[#FBF9F5] dark:bg-[#182617] text-[#243324] dark:text-[#F4EFE6] border border-[#243324]/15 dark:border-white/15 shadow-2xl backdrop-blur-xl pointer-events-auto space-y-3.5 select-text text-left"
        >
          {/* Header with Category & Close Button */}
          <div className="flex items-start justify-between gap-3 border-b border-[#243324]/10 dark:border-white/10 pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-[#657351] dark:text-[#A3B59E]">
                <BookOpen className="w-3.5 h-3.5 stroke-[2]" />
                <span>{displayCategory}</span>
              </div>
              <h4 className="font-display text-xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-tight">
                {displayTitle}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close definition tooltip"
              className="p-1 rounded-full text-[#657351] dark:text-[#A3B59E] hover:text-[#1F2B1D] dark:hover:text-white hover:bg-[#243324]/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B4D36]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Definition Body */}
          <p className="text-xs sm:text-sm text-[#384834] dark:text-[#CBD7C7] font-light leading-relaxed">
            {displayDefinition}
          </p>

          {/* Project Application & Metric Callout */}
          {displayContext && (
            <div className="rounded-xl p-3 bg-[#F0ECE1] dark:bg-[#20311F] border border-[#243324]/8 dark:border-white/8 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-[#1F2B1D] dark:text-[#F4EFE6]">
                <span className="flex items-center gap-1 text-[#657351] dark:text-[#A3B59E]">
                  <Sparkles className="w-3 h-3" />
                  <span>London Project Application</span>
                </span>
                {displayMetric && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#3B4D36] dark:text-[#C5D8C1]">
                    {displayMetric}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#4A5D44] dark:text-[#B2C5AE] font-light leading-relaxed">
                {displayContext}
              </p>
            </div>
          )}

          {/* Accessibility footnote */}
          <div className="flex items-center justify-between pt-1 text-[10px] text-[#657351]/75 dark:text-[#A3B59E]/75">
            <span>Hover or tap for terminology</span>
            <span className="hidden sm:inline">Press Esc to dismiss</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <span
        ref={triggerRef}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-describedby={isOpen ? tooltipId : undefined}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onFocus={handleOpen}
        onBlur={handleClose}
        onClick={toggleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleOpen();
          }
        }}
        className={`inline-flex items-baseline font-inherit cursor-help transition-all duration-150 border-b border-dotted border-[#3B4D36]/60 dark:border-[#96A88F]/70 hover:border-[#1F2B1D] dark:hover:border-white text-inherit hover:text-[#1F2B1D] dark:hover:text-[#F4EFE6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B4D36] dark:focus-visible:ring-[#96A88F] rounded-xs px-0.5 -mx-0.5 ${className}`}
      >
        <span>{children || displayTitle}</span>
        <span className="sr-only"> (view definition for {displayTitle})</span>
      </span>

      {typeof document !== 'undefined' && createPortal(tooltipPortal, document.body)}
    </>
  );
};

// Re-export convenient alias
export const Term = TermTooltip;
