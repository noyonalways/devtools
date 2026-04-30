import React, { useState, useEffect } from 'react';
import { ToolHeader, ToolSection } from '@/components/tools/shared/tool-ui';
import { Ruler } from 'lucide-react';

export function UnitConverter() {
  const [baseSize, setBaseSize] = useState(16);
  const [px, setPx] = useState('16');
  const [rem, setRem] = useState('1');
  const [em, setEm] = useState('1');

  const updateFromPx = (val: string) => {
    setPx(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setRem((num / baseSize).toString());
      setEm((num / baseSize).toString());
    }
  };

  const updateFromRem = (val: string) => {
    setRem(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPx((num * baseSize).toString());
      setEm(num.toString());
    }
  };

  const updateFromEm = (val: string) => {
    setEm(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPx((num * baseSize).toString());
      setRem(num.toString());
    }
  };

  useEffect(() => {
    const num = parseFloat(px);
    if (!isNaN(num)) {
      setRem((num / baseSize).toString());
      setEm((num / baseSize).toString());
    }
  }, [baseSize]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <ToolHeader 
        title="Unit Converter" 
        description="Convert between CSS units (px, rem, em) based on root font size."
      />

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 lg:p-8 space-y-8">
        <ToolSection title="Root Font Size (px)">
          <div className="max-w-xs">
            <input
              type="number"
              value={baseSize}
              onChange={(e) => setBaseSize(parseFloat(e.target.value) || 16)}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </ToolSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ToolSection title="Pixels (px)">
            <div className="relative">
              <input
                type="number"
                value={px}
                onChange={(e) => updateFromPx(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600 text-xs font-bold uppercase tracking-widest">px</span>
            </div>
          </ToolSection>

          <ToolSection title="REM (rem)">
            <div className="relative">
              <input
                type="number"
                value={rem}
                onChange={(e) => updateFromRem(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600 text-xs font-bold uppercase tracking-widest">rem</span>
            </div>
          </ToolSection>

          <ToolSection title="EM (em)">
            <div className="relative">
              <input
                type="number"
                value={em}
                onChange={(e) => updateFromEm(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600 text-xs font-bold uppercase tracking-widest">em</span>
            </div>
          </ToolSection>
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 lg:p-8">
        <h4 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
          <Ruler className="w-4 h-4" />
          Quick Reference
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-4">
          {[8, 12, 14, 16, 20, 24, 32, 48, 64].map((size) => (
            <div key={size} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl text-center transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
              <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1 uppercase tracking-wider">{size}px</div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-200 font-mono">{(size / baseSize).toFixed(3)}rem</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
