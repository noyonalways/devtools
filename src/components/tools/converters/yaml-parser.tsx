import React, { useState } from 'react';
import { ToolHeader, ActionButton, CopyButton, ToolLayout, ToolSection, ToolTextArea } from '@/components/tools/shared/tool-ui';
import { FileCode, FileJson, ArrowRightLeft } from 'lucide-react';
import yaml from 'js-yaml';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';

export function YamlParser() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'yaml-to-json' | 'json-to-yaml'>('yaml-to-json');

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'yaml-to-json') {
        const parsed = yaml.load(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        const parsed = JSON.parse(input);
        setOutput(yaml.dump(parsed));
      }
    } catch (error) {
      toast.error(`Invalid ${mode === 'yaml-to-json' ? 'YAML' : 'JSON'} format.`);
      setOutput('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="YAML Parser" 
        description="Convert between YAML and JSON formats with ease."
      />

      <div className="flex bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 w-fit mb-6 lg:mb-8">
        <button
          onClick={() => setMode('yaml-to-json')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'yaml-to-json' 
              ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
          }`}
        >
          <FileCode className="w-4 h-4" />
          YAML to JSON
        </button>
        <button
          onClick={() => setMode('json-to-yaml')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'json-to-yaml' 
              ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
          }`}
        >
          <FileJson className="w-4 h-4" />
          JSON to YAML
        </button>
      </div>

      <ToolLayout className="h-[calc(100vh-300px)] min-h-[500px]">
        <ToolSection 
          title={`Input ${mode === 'yaml-to-json' ? 'YAML' : 'JSON'}`}
          actions={
            <ActionButton 
              icon={<ArrowRightLeft className="w-4 h-4" />} 
              onClick={convert}
              label="Convert"
            />
          }
        >
          <ToolTextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your ${mode === 'yaml-to-json' ? 'YAML' : 'JSON'} here...`}
          />
        </ToolSection>

        <ToolSection 
          title={`Output ${mode === 'yaml-to-json' ? 'JSON' : 'YAML'}`}
          actions={output && <CopyButton text={output} />}
        >
          <div className="w-full h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden relative">
            {output ? (
              <div className="h-full overflow-auto custom-scrollbar">
                <SyntaxHighlighter
                  language={mode === 'yaml-to-json' ? 'json' : 'yaml'}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    background: 'transparent',
                    fontSize: '0.875rem',
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  {output}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-400 dark:text-zinc-600 text-sm italic">
                Output will appear here...
              </div>
            )}
          </div>
        </ToolSection>
      </ToolLayout>
    </div>
  );
}
