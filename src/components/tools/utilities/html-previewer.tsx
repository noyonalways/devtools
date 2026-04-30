import React, { useState } from 'react';
import { ToolHeader, CopyButton, ActionButton } from '@/components/tools/shared/tool-ui';
import { Monitor, Smartphone, Tablet, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      font-family: system-ui, -apple-system, sans-serif; 
      padding: 40px;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
    }
    .card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      text-align: center;
    }
    h1 { color: #4f46e5; margin-top: 0; }
    p { color: #64748b; line-height: 1.6; }
    .btn {
      display: inline-block;
      background: #4f46e5;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 600;
      margin-top: 1rem;
      transition: transform 0.2s;
    }
    .btn:hover { transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello DevNexus!</h1>
    <p>Start typing your HTML/CSS here to see live preview with syntax highlighting.</p>
    <a href="#" class="btn">Learn More</a>
  </div>
</body>
</html>`;

export function HtmlPreviewer() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const reset = () => {
    setHtml(DEFAULT_HTML);
  };

  const viewportWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="HTML Previewer" 
        description="Write and preview HTML/CSS code in real-time with responsive viewport testing." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)] min-h-[600px]">
        {/* Editor Section */}
        <div className="flex flex-col gap-4 h-full overflow-hidden">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">HTML / CSS Editor</label>
            <div className="flex items-center gap-2">
              <CopyButton text={html} />
              <ActionButton 
                onClick={reset} 
                icon={<RotateCcw className="w-4 h-4" />} 
                label="Reset" 
                variant="secondary"
              />
            </div>
          </div>
          <div className="flex-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50">
            <div className="h-full overflow-auto custom-scrollbar">
              <Editor
                value={html}
                onValueChange={code => setHtml(code)}
                highlight={code => Prism.highlight(code, Prism.languages.markup, 'markup')}
                padding={20}
                className="font-mono text-sm min-h-full"
                textareaClassName="focus:outline-none"
                style={{
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                }}
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="flex flex-col gap-4 h-full">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Live Preview</label>
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 gap-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === 'desktop' ? "bg-white dark:bg-zinc-700 text-indigo-600 shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                )}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === 'tablet' ? "bg-white dark:bg-zinc-700 text-indigo-600 shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                )}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === 'mobile' ? "bg-white dark:bg-zinc-700 text-indigo-600 shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                )}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex justify-center">
            <iframe
              title="HTML Preview"
              srcDoc={html}
              className="bg-white transition-all duration-300 shadow-lg"
              style={{ width: viewportWidths[viewMode], height: '100%' }}
              sandbox="allow-scripts"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
