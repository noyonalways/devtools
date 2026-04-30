import React, { useState, useEffect } from 'react';
import { ToolHeader, CopyButton, ToolSection, ToolTextArea } from '@/components/tools/shared/tool-ui';
import { Lock, ShieldCheck } from 'lucide-react';

export function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    'SHA-256': '',
    'SHA-1': '',
    'SHA-512': ''
  });

  const generateHashes = async (text: string) => {
    if (!text) {
      setHashes({ 'SHA-256': '', 'SHA-1': '', 'SHA-512': '' });
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const hashAlgorithms = ['SHA-1', 'SHA-256', 'SHA-512'];
    const results: any = {};

    for (const algo of hashAlgorithms) {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      results[algo] = hashHex;
    }

    setHashes(results);
  };

  useEffect(() => {
    generateHashes(input);
  }, [input]);

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="Hash Generator" 
        description="Generate secure cryptographic hashes (SHA-1, SHA-256, SHA-512) locally." 
      />

      <div className="space-y-8">
        <ToolSection title="Input Text">
          <ToolTextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="h-[150px]"
          />
        </ToolSection>

        <div className="grid grid-cols-1 gap-4">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3 transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-widest">{algo}</span>
                </div>
                {hash && <CopyButton text={hash} />}
              </div>
              <div className="text-sm font-mono text-zinc-600 dark:text-zinc-400 break-all bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/50">
                {hash || <span className="text-zinc-300 dark:text-zinc-700 italic">Waiting for input...</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex gap-3 items-start">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-500 dark:text-zinc-500 leading-relaxed">
            Hashing is performed entirely in your browser using the Web Crypto API. Your data never leaves your device.
          </p>
        </div>
      </div>
    </div>
  );
}
