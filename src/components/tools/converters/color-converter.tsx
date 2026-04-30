import React, { useState, useEffect } from 'react';
import { ToolHeader, CopyButton, ToolSection } from '@/components/tools/shared/tool-ui';
import { Palette, RefreshCw } from 'lucide-react';

export function ColorConverter() {
  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState('rgb(99, 102, 241)');
  const [hsl, setHsl] = useState('hsl(239, 84%, 67%)');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const handleHexChange = (value: string) => {
    setHex(value);
    if (/^#?([a-f\d]{3}){1,2}$/i.test(value)) {
      const rgbVal = hexToRgb(value);
      if (rgbVal) {
        const rgbStr = `rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`;
        setRgb(rgbStr);
        const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
        setHsl(`hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="Color Converter" 
        description="Convert between HEX, RGB, and HSL color formats with live preview." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-8">
          <ToolSection title="HEX Color">
            <div className="flex gap-3">
              <input
                type="text"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <input
                  type="color"
                  value={hex.startsWith('#') ? hex : `#${hex}`}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer bg-transparent border-none"
                />
              </div>
            </div>
          </ToolSection>

          <ToolSection 
            title="RGB"
            actions={<CopyButton text={rgb} />}
          >
            <input
              readOnly
              value={rgb}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-600 dark:text-zinc-400 font-mono focus:outline-none"
            />
          </ToolSection>

          <ToolSection 
            title="HSL"
            actions={<CopyButton text={hsl} />}
          >
            <input
              readOnly
              value={hsl}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-600 dark:text-zinc-400 font-mono focus:outline-none"
            />
          </ToolSection>
        </div>

        <div className="flex flex-col items-center justify-center space-y-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 lg:p-12">
          <div 
            className="w-full aspect-square max-w-[300px] rounded-2xl shadow-2xl shadow-indigo-500/10 border border-zinc-200 dark:border-zinc-800 transition-colors duration-200"
            style={{ backgroundColor: hex }}
          />
          <div className="text-center space-y-3">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Preview</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 font-mono tracking-tight">{hex.toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
