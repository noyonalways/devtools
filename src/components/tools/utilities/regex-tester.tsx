import React, { useState, useEffect } from 'react';
import { ToolHeader, ToolSection, ToolTextArea, ActionButton } from '@/components/tools/shared/tool-ui';
import { Search, Info, AlertCircle, CheckCircle2, FlaskConical, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export function RegexTester() {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('My emails are test@example.com and dev@nexus.io');
  const [matches, setMatches] = useState<RegExpExecArray[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testRegex();
  }, [pattern, flags, testText]);

  const testRegex = () => {
    if (!pattern) {
      setMatches([]);
      setError(null);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const allMatches: RegExpExecArray[] = [];
      
      if (flags.includes('g')) {
        let match;
        let lastIndex = -1;
        while ((match = regex.exec(testText)) !== null) {
          if (regex.lastIndex === lastIndex) break; // Prevent infinite loop for empty matches
          lastIndex = regex.lastIndex;
          allMatches.push(match);
        }
      } else {
        const match = regex.exec(testText);
        if (match) allMatches.push(match);
      }
      
      setMatches(allMatches);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid Regular Expression');
      setMatches([]);
    }
  };

  const highlightMatches = () => {
    if (error || !pattern || matches.length === 0) return testText;

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    // Sort matches by index to handle them in order
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

    sortedMatches.forEach((match, i) => {
      // Content before match
      parts.push(testText.substring(lastIndex, match.index));
      
      // The match itself
      parts.push(
        <mark 
          key={i} 
          className="bg-indigo-500/30 text-indigo-900 dark:text-indigo-200 rounded-sm px-0.5 border-b border-indigo-500 font-bold"
          title={`Match ${i + 1}`}
        >
          {match[0]}
        </mark>
      );
      
      lastIndex = match.index + match[0].length;
    });

    // Remainder of text
    parts.push(testText.substring(lastIndex));
    return parts;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="Regex Tester" 
        description="Test and debug regular expressions with live highlighting and match extraction." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expression Builder */}
        <div className="lg:col-span-1 space-y-6">
          <ToolSection title="Regular Expression" titleId="regex-pattern">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-lg pointer-events-none group-focus-within:text-indigo-500 transition-colors">/</div>
                <input 
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Regex pattern..."
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-8 pr-16 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                   <span className="text-zinc-400 font-mono text-lg">/</span>
                   <input 
                    type="text"
                    value={flags}
                    onChange={(e) => setFlags(e.target.value.replace(/[^gimuy]/g, ''))}
                    className="w-10 bg-transparent border-none text-zinc-900 dark:text-indigo-400 font-mono text-sm focus:outline-none focus:ring-0"
                    placeholder="flags"
                    maxLength={5}
                   />
                </div>
              </div>

              {error ? (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              ) : (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-2 text-xs text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Pattern is valid</span>
                </div>
              )}

              <div className="pt-4 space-y-3">
                 <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <FlaskConical className="w-3 h-3" />
                    Flags Guide
                 </h4>
                 <div className="grid grid-cols-2 gap-2">
                    {[
                      { f: 'g', d: 'Global' },
                      { f: 'i', d: 'Case-Insensitive' },
                      { f: 'm', d: 'Multiline' },
                      { f: 's', d: 'Single line' }
                    ].map(flag => (
                      <button
                        key={flag.f}
                        onClick={() => {
                          const newFlags = flags.includes(flag.f) ? flags.replace(flag.f, '') : flags + flag.f;
                          setFlags(newFlags);
                        }}
                        className={cn(
                          "px-3 py-2 rounded-lg text-[10px] font-bold border transition-all text-left flex items-center justify-between",
                          flags.includes(flag.f) 
                            ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600" 
                            : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400"
                        )}
                      >
                        {flag.d}
                        <code className="bg-zinc-100 dark:bg-zinc-700 px-1 rounded">{flag.f}</code>
                      </button>
                    ))}
                 </div>
              </div>
            </div>
          </ToolSection>

          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
             <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Hash className="w-4 h-4 text-indigo-500" />
                Match Results
             </h4>
             <div className="space-y-2">
                {matches.length > 0 ? (
                  <div className="max-h-[200px] overflow-auto space-y-2 custom-scrollbar pr-2">
                    {matches.map((m, i) => (
                      <div key={i} className="p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between group">
                         <div className="text-[10px] font-mono text-zinc-400">Match {i + 1}</div>
                         <code className="text-xs text-indigo-600 dark:text-indigo-400 font-bold truncate max-w-[150px]">{m[0]}</code>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-zinc-400 text-xs italic">No matches found</div>
                )}
             </div>
          </div>
        </div>

        {/* Test Text */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolSection title="Test String" titleId="regex-test">
             <div className="flex flex-col h-full gap-4 min-h-[400px]">
                <div className="relative flex-1">
                  <textarea
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    className="absolute inset-0 w-full h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none text-transparent caret-zinc-900 dark:caret-white z-10"
                    placeholder="Enter text to test your regex against..."
                  />
                  <div className="absolute inset-0 w-full h-full p-6 text-sm font-mono leading-relaxed whitespace-pre-wrap pointer-events-none break-all overflow-auto custom-scrollbar text-zinc-800 dark:text-zinc-300">
                    {highlightMatches()}
                  </div>
                </div>
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between text-indigo-600 dark:text-indigo-400">
                   <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 opacity-50" />
                      <span className="text-sm font-bold">{matches.length} matches found in text</span>
                   </div>
                   <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Real-time Validation</div>
                </div>
             </div>
          </ToolSection>
        </div>
      </div>
    </div>
  );
}
