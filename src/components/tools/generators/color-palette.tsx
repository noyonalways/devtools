import React, { useState, useEffect } from 'react';
import { ToolHeader, ActionButton, CopyButton, ToolSection } from '@/components/tools/shared/tool-ui';
import { Plus, Trash2, Download, RefreshCw, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface Color {
  hex: string;
  rgb: string;
}

interface Palette {
  id: string;
  name: string;
  colors: Color[];
}

export function ColorPalette() {
  const [seedColor, setSeedColor] = useState('#6366f1');
  const [palette, setPalette] = useState<Color[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<Palette[]>([]);
  const [paletteName, setPaletteName] = useState('My Palette');

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const generatePalette = () => {
    // Simple generation logic: seed + 4 variations
    const colors: Color[] = [];
    colors.push({ hex: seedColor, rgb: hexToRgb(seedColor) });

    // Generate variations by adjusting brightness/saturation (simplified)
    for (let i = 1; i < 5; i++) {
      const hex = adjustColor(seedColor, i * 20);
      colors.push({ hex, rgb: hexToRgb(hex) });
    }
    setPalette(colors);
  };

  const adjustColor = (hex: string, amount: number) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.min(255, Math.max(0, r + amount));
    g = Math.min(255, Math.max(0, g + amount));
    b = Math.min(255, Math.max(0, b + amount));

    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const savePalette = () => {
    const newPalette: Palette = {
      id: Date.now().toString(),
      name: paletteName || 'Untitled Palette',
      colors: [...palette]
    };
    const updated = [newPalette, ...savedPalettes];
    setSavedPalettes(updated);
    localStorage.setItem('devnexus_palettes', JSON.stringify(updated));
    toast.success('Palette saved!');
  };

  const deletePalette = (id: string) => {
    const updated = savedPalettes.filter(p => p.id !== id);
    setSavedPalettes(updated);
    localStorage.setItem('devnexus_palettes', JSON.stringify(updated));
    toast.success('Palette deleted');
  };

  const exportPalette = (p: Color[], format: 'hex' | 'rgb') => {
    const text = p.map(c => format === 'hex' ? c.hex : c.rgb).join('\n');
    navigator.clipboard.writeText(text);
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  useEffect(() => {
    const saved = localStorage.getItem('devnexus_palettes');
    if (saved) {
      setSavedPalettes(JSON.parse(saved));
    }
    generatePalette();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <ToolHeader 
        title="Color Palette Generator" 
        description="Create beautiful color schemes from a single seed color."
      />

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 lg:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ToolSection title="Seed Color">
            <div className="flex gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <input
                  type="color"
                  value={seedColor}
                  onChange={(e) => setSeedColor(e.target.value)}
                  className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer bg-transparent border-none"
                />
              </div>
              <input
                type="text"
                value={seedColor}
                onChange={(e) => setSeedColor(e.target.value)}
                className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-zinc-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <ActionButton 
                icon={<RefreshCw className="w-4 h-4" />} 
                onClick={generatePalette}
                label="Generate"
              />
            </div>
          </ToolSection>

          <ToolSection title="Palette Name">
            <div className="flex gap-3">
              <input
                type="text"
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="Enter palette name..."
              />
              <ActionButton 
                icon={<Save className="w-4 h-4" />} 
                onClick={savePalette}
                label="Save"
                variant="secondary"
              />
            </div>
          </ToolSection>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {palette.map((color, i) => (
            <div key={i} className="space-y-3 group">
              <div 
                className="h-32 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-inner transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: color.hex }}
              />
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{color.hex}</span>
                <CopyButton text={color.hex} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {savedPalettes.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            <h3 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Saved Palettes</h3>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {savedPalettes.map((p) => (
              <div key={p.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
                <div className="space-y-3">
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{p.name}</span>
                  <div className="flex gap-1.5">
                    {p.colors.map((c, i) => (
                      <div 
                        key={i} 
                        className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm"
                        style={{ backgroundColor: c.hex }}
                        title={c.hex}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ActionButton 
                    icon={<Download className="w-4 h-4" />} 
                    onClick={() => exportPalette(p.colors, 'hex')}
                    label="HEX"
                    variant="secondary"
                    className="px-3 py-1.5"
                  />
                  <ActionButton 
                    icon={<Download className="w-4 h-4" />} 
                    onClick={() => exportPalette(p.colors, 'rgb')}
                    label="RGB"
                    variant="secondary"
                    className="px-3 py-1.5"
                  />
                  <button 
                    onClick={() => deletePalette(p.id)}
                    className="p-2.5 text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                    title="Delete palette"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
