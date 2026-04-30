import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { ToolHeader, ToolLayout, ToolSection, ActionButton } from '@/components/tools/shared/tool-ui';
import { QrCode, Download, Share2, Palette, Image as ImageIcon, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function QrCodeGenerator() {
  const [value, setValue] = useState('https://github.com/devnexus');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [includeMargin, setIncludeMargin] = useState(true);
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQr = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.png`;
      link.href = url;
      link.click();
      toast.success('QR Code downloaded');
    }
  };

  const clear = () => {
    setValue('');
    toast.success('Ready for new data');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="QR Code Generator" 
        description="Generate high-quality QR codes for URLs, text, or contacts with custom styling." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <ToolSection title="Configuration" titleId="qr-config">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Content</label>
                <textarea 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter URL or text..."
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all min-h-[120px] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Size (px)</label>
                  <input 
                    type="number"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Margin</label>
                  <button
                    onClick={() => setIncludeMargin(!includeMargin)}
                    className={`w-full py-2 rounded-xl text-xs font-medium border transition-all ${
                      includeMargin 
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-800 text-indigo-600' 
                        : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500'
                    }`}
                  >
                    {includeMargin ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Foreground</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg overflow-hidden border-none cursor-pointer"
                    />
                    <span className="text-[10px] font-mono uppercase text-zinc-400">{fgColor}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Background</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg overflow-hidden border-none cursor-pointer"
                    />
                    <span className="text-[10px] font-mono uppercase text-zinc-400">{bgColor}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={clear}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear Content
              </button>
            </div>
          </ToolSection>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolSection 
            title="Preview" 
            titleId="qr-preview"
            actions={
              <ActionButton 
                onClick={downloadQr} 
                label="Download PNG" 
                icon={<Download className="w-4 h-4" />} 
              />
            }
          >
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 relative overflow-hidden group">
              {/* Decorative Background */}
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none transition-opacity group-hover:opacity-[0.06]">
                <div className="grid grid-cols-12 gap-4 h-full w-full p-4">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-zinc-900 rounded-sm" />
                  ))}
                </div>
              </div>
              
              <div ref={qrRef} className="p-8 bg-white rounded-3xl shadow-2xl relative z-10 transition-transform group-hover:scale-105 duration-500">
                <QRCodeCanvas
                  value={value || ' '}
                  size={size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  marginSize={includeMargin ? 4 : 0}
                  level="H"
                />
              </div>

              <div className="mt-8 text-center space-y-2">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Live Preview</p>
                <p className="text-xs text-zinc-400 max-w-sm">
                  {value ? `Representing: ${value.length} characters` : 'No content provided'}
                </p>
              </div>
            </div>
          </ToolSection>

          <div className="p-6 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20 text-white flex items-center justify-between overflow-hidden relative">
            <div className="relative z-10">
              <h4 className="text-lg font-bold mb-1">Professional Utility</h4>
              <p className="text-sm opacity-80 max-w-md">Our QR codes use High Error Correction (Level H) allowing for design customization and branding without losing scannability.</p>
            </div>
            <QrCode className="w-24 h-24 absolute -right-4 -bottom-4 opacity-10 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
