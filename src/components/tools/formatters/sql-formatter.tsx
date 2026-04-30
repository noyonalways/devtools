import React, { useState } from 'react';
import { format } from 'sql-formatter';
import { ToolHeader, ActionButton, CopyButton, ToolLayout, ToolSection, ToolTextArea } from '@/components/tools/shared/tool-ui';
import { toast } from 'react-hot-toast';
import { Database, Trash2, AlignLeft, Minimize2 } from 'lucide-react';

export function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<'sql' | 'mysql' | 'postgresql'>('sql');

  const formatSql = () => {
    try {
      if (!input.trim()) return;
      const formatted = format(input, {
        language: language,
        keywordCase: 'upper',
      });
      setOutput(formatted);
      toast.success('SQL Formatted');
    } catch (err) {
      toast.error('Failed to format SQL. Check your syntax.');
    }
  };

  const clear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="SQL Formatter" 
        description="Beautify and standardize your raw SQL queries for better readability." 
      />

      <ToolLayout className="h-[calc(100vh-250px)] min-h-[500px]">
        {/* Input */}
        <ToolSection 
          title="Raw SQL"
          titleId="sql-input-title"
          actions={
            <button 
              onClick={clear}
              className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          }
        >
          <div className="flex flex-col gap-4 h-full">
            <ToolTextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="SELECT * FROM users WHERE active = 1..."
              className="flex-1 font-mono text-sm"
            />
            <div className="flex items-center gap-3">
              <ActionButton 
                onClick={formatSql} 
                label="Format SQL" 
                icon={<AlignLeft className="w-4 h-4" />} 
              />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="sql">Standard SQL</option>
                <option value="mysql">MySQL</option>
                <option value="postgresql">PostgreSQL</option>
              </select>
            </div>
          </div>
        </ToolSection>

        {/* Output */}
        <ToolSection 
          title="Formatted SQL"
          titleId="sql-output-title"
          actions={output && <CopyButton text={output} />}
        >
          <div className="w-full h-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden relative">
            {!output ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 gap-3">
                <Database className="w-12 h-12 opacity-20" />
                <p className="text-sm">Formatted query will appear here</p>
              </div>
            ) : (
              <textarea
                readOnly
                value={output}
                className="w-full h-full p-6 bg-transparent text-sm font-mono text-zinc-800 dark:text-zinc-200 leading-relaxed outline-none resize-none"
              />
            )}
          </div>
        </ToolSection>
      </ToolLayout>
    </div>
  );
}
