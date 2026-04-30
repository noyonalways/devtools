import React, { useState } from 'react';
import * as diff from 'diff';
import { ToolHeader, ToolLayout, ToolSection, ToolTextArea, ActionButton } from '@/components/tools/shared/tool-ui';
import { Columns, Trash2, Split, AlignJustify, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export function DiffChecker() {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [diffResult, setDiffResult] = useState<diff.Change[]>([]);
  const [viewMode, setViewMode] = useState<'inline' | 'split'>('split');

  const compare = () => {
    if (!oldText && !newText) {
      toast.error('Please enter text to compare');
      return;
    }
    const result = diff.diffLines(oldText, newText);
    setDiffResult(result);
    toast.success('Comparison complete');
  };

  const clear = () => {
    setOldText('');
    setNewText('');
    setDiffResult([]);
    toast.success('Cleared');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="Diff Checker" 
        description="Compare two text snippets or code blocks to find additions, deletions, and modifications." 
      />

      <div className="space-y-6">
        {/* Input Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[300px]">
          <ToolSection 
            title="Original Text" 
            titleId="diff-original"
            className="h-full"
          >
            <ToolTextArea
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              placeholder="Paste original text here..."
              className="h-full font-mono text-xs"
            />
          </ToolSection>
          <ToolSection 
            title="Changed Text" 
            titleId="diff-changed"
            className="h-full"
            actions={
              <button onClick={clear} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            }
          >
            <ToolTextArea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Paste new text here..."
              className="h-full font-mono text-xs"
            />
          </ToolSection>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3">
            <ActionButton 
              onClick={compare} 
              label="Compare" 
              icon={<Search className="w-4 h-4" />} 
            />
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('split')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  viewMode === 'split' ? "bg-white dark:bg-zinc-700 text-indigo-600 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                <Split className="w-3.5 h-3.5" />
                Side by Side
              </button>
              <button
                onClick={() => setViewMode('inline')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  viewMode === 'inline' ? "bg-white dark:bg-zinc-700 text-indigo-600 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                <AlignJustify className="w-3.5 h-3.5" />
                Inline
              </button>
            </div>
          </div>
          
          {diffResult.length > 0 && (
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-1.5 text-green-600">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-sm" />
                {diffResult.filter(c => c.added).length} Additions
              </div>
              <div className="flex items-center gap-1.5 text-red-600">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-sm" />
                {diffResult.filter(c => c.removed).length} Deletions
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {diffResult.length > 0 ? (
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden min-h-[400px]">
            {viewMode === 'split' ? (
              <div className="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-zinc-800">
                <div className="bg-zinc-50/50 dark:bg-zinc-900/50">
                  <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 uppercase">Original</div>
                  <div className="p-4 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                    {diffResult.map((part, i) => !part.added && (
                      <span key={i} className={cn(
                        part.removed ? "bg-red-500/20 text-red-700 dark:text-red-400 block -mx-1 px-1" : "text-zinc-600 dark:text-zinc-400"
                      )}>
                        {part.value}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-zinc-50/50 dark:bg-zinc-900/50">
                  <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 uppercase">Changed</div>
                  <div className="p-4 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                    {diffResult.map((part, i) => !part.removed && (
                      <span key={i} className={cn(
                        part.added ? "bg-green-500/20 text-green-700 dark:text-green-400 block -mx-1 px-1" : "text-zinc-600 dark:text-zinc-400"
                      )}>
                        {part.value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                {diffResult.map((part, i) => (
                  <span 
                    key={i} 
                    className={cn(
                      part.added ? "bg-green-500/10 text-green-600 dark:text-green-400 border-l-2 border-green-500 pl-2 block my-0.5" : 
                      part.removed ? "bg-red-500/10 text-red-600 dark:text-red-400 border-l-2 border-red-500 pl-2 block my-0.5" : 
                      "text-zinc-500 dark:text-zinc-400 pl-2.5 block"
                    )}
                  >
                    {part.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-zinc-50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl h-64 flex flex-col items-center justify-center text-zinc-400 gap-3">
             <Columns className="w-12 h-12 opacity-10" />
             <p className="text-sm">Click compare to see the differences</p>
          </div>
        )}
      </div>
    </div>
  );
}
