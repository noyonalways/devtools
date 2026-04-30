import React, { useState } from 'react';
import { ToolHeader, ActionButton, ToolLayout, ToolSection, ToolTextArea } from '@/components/tools/shared/tool-ui';
import { diffLines, Change } from 'diff';
import { RotateCcw, Copy, ArrowRightLeft, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export function DiffChecker() {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [diffResult, setDiffResult] = useState<Change[]>([]);
  const [showDiff, setShowDiff] = useState(false);

  const handleCompare = () => {
    const diff = diffLines(original, modified);
    setDiffResult(diff);
    setShowDiff(true);
  };

  const reset = () => {
    setOriginal('');
    setModified('');
    setDiffResult([]);
    setShowDiff(false);
  };

  const swap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
    if (showDiff) handleCompare();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="Diff Checker" 
        description="Compare two pieces of text and see the differences line by line." 
      />

      {!showDiff ? (
        <ToolLayout className="h-[calc(100vh-350px)] min-h-[500px]">
          <ToolSection 
            title="Original Text"
            actions={
              <ActionButton 
                onClick={() => navigator.clipboard.readText().then(setOriginal)} 
                icon={<Copy className="w-4 h-4" />} 
                label="Paste" 
                variant="secondary"
              />
            }
          >
            <ToolTextArea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="Paste original text here..."
            />
          </ToolSection>

          <ToolSection 
            title="Modified Text"
            actions={
              <ActionButton 
                onClick={() => navigator.clipboard.readText().then(setModified)} 
                icon={<Copy className="w-4 h-4" />} 
                label="Paste" 
                variant="secondary"
              />
            }
          >
            <ToolTextArea
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              placeholder="Paste modified text here..."
            />
          </ToolSection>
        </ToolLayout>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden mb-6">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Comparison Result</span>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-red-500/20 border border-red-500/50 rounded-sm" />
                <span className="text-red-600 dark:text-red-400">Removed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-green-500/20 border border-green-500/50 rounded-sm" />
                <span className="text-green-600 dark:text-green-400">Added</span>
              </div>
            </div>
          </div>
          <div className="p-6 font-mono text-sm overflow-auto whitespace-pre leading-relaxed h-[calc(100vh-400px)] min-h-[400px] custom-scrollbar">
            {diffResult.map((part, index) => (
              <div
                key={index}
                className={cn(
                  "px-2 py-0.5 rounded-md mb-0.5",
                  part.added ? "bg-green-500/10 text-green-700 dark:text-green-400 border-l-4 border-green-500" : 
                  part.removed ? "bg-red-500/10 text-red-700 dark:text-red-400 border-l-4 border-red-500" : 
                  "text-zinc-600 dark:text-zinc-400"
                )}
              >
                {part.value}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-4">
        {!showDiff ? (
          <>
            <ActionButton 
              onClick={handleCompare} 
              label="Compare Texts" 
              variant="primary"
              className="px-8 py-3 text-base"
              icon={<FileText className="w-5 h-5" />}
            />
            <ActionButton 
              onClick={swap} 
              icon={<ArrowRightLeft className="w-4 h-4" />} 
              label="Swap" 
              variant="secondary"
            />
          </>
        ) : (
          <>
            <ActionButton 
              onClick={() => setShowDiff(false)} 
              label="Back to Editor" 
              variant="secondary"
              icon={<RotateCcw className="w-4 h-4" />}
            />
            <ActionButton 
              onClick={reset} 
              icon={<RotateCcw className="w-4 h-4" />} 
              label="Clear All" 
              variant="secondary"
              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
            />
          </>
        )}
      </div>
    </div>
  );
}
