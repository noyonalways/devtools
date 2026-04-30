import React, { useState } from 'react';
import { ToolHeader, ActionButton, CopyButton, ToolLayout, ToolSection, ToolTextArea } from '@/components/tools/shared/tool-ui';
import { FileSpreadsheet, FileJson } from 'lucide-react';
import Papa from 'papaparse';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';

export function CsvJsonConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    Papa.parse(input, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          toast.error('Error parsing CSV. Check your format.');
          return;
        }
        setOutput(JSON.stringify(results.data, null, 2));
      },
      error: (error) => {
        toast.error(`Error: ${error.message}`);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="CSV to JSON Converter" 
        description="Convert CSV data into a JSON array of objects."
      />

      <ToolLayout className="h-[calc(100vh-300px)] min-h-[500px]">
        <ToolSection 
          title="CSV Input"
          actions={
            <ActionButton 
              icon={<FileJson className="w-4 h-4" />} 
              onClick={convert}
              label="Convert to JSON"
            />
          }
        >
          <ToolTextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="name,age\nJohn,30\nJane,25"
          />
        </ToolSection>

        <ToolSection 
          title="JSON Output"
          actions={output && <CopyButton text={output} />}
        >
          <div className="w-full h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden relative">
            {output ? (
              <div className="h-full overflow-auto custom-scrollbar">
                <SyntaxHighlighter
                  language="json"
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
              <div className="flex items-center justify-center h-full text-zinc-400 dark:text-zinc-600 text-sm italic px-4 text-center">
                JSON output will appear here...
              </div>
            )}
          </div>
        </ToolSection>
      </ToolLayout>
    </div>
  );
}
