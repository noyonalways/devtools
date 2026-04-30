import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ToolHeader, ActionButton, CopyButton, ToolLayout, ToolSection, ToolTextArea } from '@/components/tools/shared/tool-ui';
import { FileCode, Eye, Edit3, Trash2 } from 'lucide-react';

export function MarkdownPreview() {
  const [input, setInput] = useState('# Hello World\n\nThis is a **Markdown** previewer.\n\n- List item 1\n- List item 2\n\n```javascript\nconsole.log("Hello World");\n```');
  const [view, setView] = useState<'split' | 'edit' | 'preview'>('split');

  const clear = () => {
    setInput('');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <ToolHeader 
          title="Markdown Preview" 
          description="Write and preview Markdown with GitHub Flavored Markdown support." 
        />
        <div className="flex bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 mb-6 lg:mb-8">
          {[
            { id: 'edit', icon: Edit3, label: 'Edit' },
            { id: 'split', icon: FileCode, label: 'Split' },
            { id: 'preview', icon: Eye, label: 'Preview' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                view === tab.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid gap-6 lg:gap-8 h-[calc(100vh-250px)] min-h-[600px] ${view === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {(view === 'edit' || view === 'split') && (
          <ToolSection 
            title="Editor"
            actions={
              <div className="flex gap-1">
                <CopyButton text={input} />
                <button 
                  onClick={clear}
                  className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-all"
                  title="Clear input"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            }
          >
            <ToolTextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter markdown content..."
              className="leading-relaxed"
            />
          </ToolSection>
        )}

        {(view === 'preview' || view === 'split') && (
          <ToolSection title="Preview">
            <div className="w-full h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 lg:p-8 overflow-y-auto prose dark:prose-invert prose-indigo max-w-none prose-sm selection:bg-indigo-500/30 text-zinc-900 dark:text-zinc-100 custom-scrollbar">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {input || '*No content to preview*'}
              </ReactMarkdown>
            </div>
          </ToolSection>
        )}
      </div>
    </div>
  );
}
