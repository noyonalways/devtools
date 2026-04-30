import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ToolHeader, ActionButton, CopyButton, ToolLayout, ToolSection, ToolTextArea } from '@/components/tools/shared/tool-ui';
import { toast } from 'react-hot-toast';
import { FileJson, Minimize2, Maximize2, Trash2, FileCode, CheckCircle2 } from 'lucide-react';

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    setIsDark(isDarkTheme);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const formatJson = (pretty: boolean) => {
    try {
      if (!input.trim()) {
        toast.error('Please enter some JSON first');
        return;
      }
      const parsed = JSON.parse(input);
      const formatted = pretty ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);
      setOutput(formatted);
      setError(null);
      if (pretty) toast.success('JSON Beautified');
      else toast.success('JSON Minified');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      toast.error('Invalid JSON format');
    }
  };

  const loadExample = () => {
    const example = {
      project: "DevNexus",
      version: "1.0.0",
      features: ["AI Assistant", "Code Tools", "Visual Planning"],
      active: true,
      stats: {
        users: 1540,
        latency: "12ms"
      }
    };
    setInput(JSON.stringify(example, null, 2));
    setOutput('');
    setError(null);
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="JSON Formatter" 
        description="Format, validate, and minify your JSON data with industrial-grade precision." 
      />

      <ToolLayout className="h-[calc(100vh-250px)] min-h-[600px]">
        <ToolSection 
          title="Input JSON"
          titleId="input-json-title"
          actions={
            <div className="flex items-center gap-1">
              <button 
                onClick={loadExample}
                className="p-2 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-md transition-all"
                title="Load example JSON"
              >
                <FileCode className="w-4 h-4" />
              </button>
              <button 
                onClick={clear}
                className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-all"
                title="Clear input"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          }
        >
          <div className="flex flex-col gap-4 h-full">
            <ToolTextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{ "hint": "Paste your JSON here..." }'
              aria-labelledby="input-json-title"
            />
            <div className="flex flex-wrap gap-3">
              <ActionButton 
                onClick={() => formatJson(true)} 
                label="Beautify" 
                icon={<Maximize2 className="w-4 h-4" />} 
              />
              <ActionButton 
                onClick={() => formatJson(false)} 
                label="Minify" 
                variant="secondary"
                icon={<Minimize2 className="w-4 h-4" />} 
              />
            </div>
            {error && (
              <div 
                role="alert"
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-mono"
              >
                Error: {error}
              </div>
            )}
          </div>
        </ToolSection>

        <ToolSection 
          title="Formatted Output"
          titleId="output-json-title"
          actions={
            <div className="flex items-center gap-2">
              {output && !error && (
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md text-[10px] font-bold uppercase transition-all animate-in fade-in zoom-in">
                  <CheckCircle2 className="w-3 h-3" />
                  Valid JSON
                </div>
              )}
              {output && <CopyButton text={output} />}
            </div>
          }
        >
          <div 
            className="w-full h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden relative group"
            aria-labelledby="output-json-title"
            role="region"
          >
            {!output ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 gap-3">
                <FileJson className="w-12 h-12 opacity-20" />
                <p className="text-sm">Formatted output will appear here</p>
              </div>
            ) : (
              <div className="h-full overflow-auto custom-scrollbar">
                <SyntaxHighlighter
                  language="json"
                  style={isDark ? vscDarkPlus : prism}
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    background: 'transparent',
                    fontSize: '0.875rem',
                    fontFamily: '"JetBrains Mono", monospace',
                    lineHeight: '1.6',
                  }}
                  wrapLines
                  wrapLongLines
                >
                  {output}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </ToolSection>
      </ToolLayout>
    </div>
  );
}
