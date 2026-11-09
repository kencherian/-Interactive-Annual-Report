import React, { useEffect } from 'react';
import { Printer, X, Eye, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const PrintBanner: React.FC = () => {
  const { isPrintPreview, togglePrintPreview, triggerPrint } = useTheme();

  // Allow closing with Escape key
  useEffect(() => {
    if (!isPrintPreview) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        togglePrintPreview();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPrintPreview, togglePrintPreview]);

  if (!isPrintPreview) return null;

  return (
    <div
      role="region"
      aria-label="High Contrast Print Preview Controls"
      className="print-hide fixed top-0 left-0 right-0 z-[100] bg-black text-white px-4 py-2.5 sm:px-8 border-b-2 border-white/20 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono select-none"
    >
      <div className="flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-bold uppercase tracking-wider text-white flex items-center gap-1.5 font-sans">
          <FileText className="w-4 h-4 text-emerald-400" />
          High-Contrast Black & White Print Preview Active
        </span>
        <span className="hidden md:inline text-white/60">
          (Simplified layout optimized for paper & PDF export)
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={triggerPrint}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition-colors cursor-pointer text-xs uppercase tracking-wider"
          title="Open browser print dialog (Ctrl+P / Cmd+P)"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save PDF</span>
        </button>

        <button
          onClick={togglePrintPreview}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-white/90 hover:bg-neutral-700 hover:text-white transition-colors cursor-pointer text-xs"
          title="Exit print preview and return to interactive layout (Esc)"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Preview</span>
        </button>
      </div>
    </div>
  );
};
