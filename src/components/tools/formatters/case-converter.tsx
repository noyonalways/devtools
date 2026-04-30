import React, { useState } from 'react';
import { ToolHeader, CopyButton, ToolSection, ToolTextArea } from '@/components/tools/shared/tool-ui';
import { Type, ArrowRight } from 'lucide-react';

export function CaseConverter() {
  const [input, setInput] = useState('');

  const converters = {
    'UPPERCASE': (s: string) => s.toUpperCase(),
    'lowercase': (s: string) => s.toLowerCase(),
    'Title Case': (s: string) => s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
    'camelCase': (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()),
    'PascalCase': (s: string) => s.toLowerCase().replace(/(?:^|[^a-zA-Z0-9]+)(.)/g, (m, chr) => chr.toUpperCase()),
    'snake_case': (s: string) => s.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || '',
    'kebab-case': (s: string) => s.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('-') || '',
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="Case Converter" 
        description="Convert text between different naming conventions and cases." 
      />

      <div className="space-y-8">
        <ToolSection title="Input Text">
          <ToolTextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to convert..."
            className="h-[150px]"
          />
        </ToolSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(converters).map(([name, convert]) => {
            const result = input ? convert(input) : '';
            return (
              <div key={name} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-3 transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{name}</span>
                  {result && <CopyButton text={result} />}
                </div>
                <div className="text-sm font-mono text-zinc-800 dark:text-zinc-200 break-all min-h-[1.5rem]">
                  {result || <span className="text-zinc-300 dark:text-zinc-700 italic">Waiting for input...</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
