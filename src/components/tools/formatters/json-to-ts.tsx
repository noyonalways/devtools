import React, { useState } from 'react';
import { ToolHeader, ActionButton, CopyButton, ToolLayout, ToolSection, ToolTextArea } from '@/components/tools/shared/tool-ui';
import { toast } from 'react-hot-toast';
import { Braces, FileCode, Trash2, Zap } from 'lucide-react';

export function JsonToTs() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const generateTs = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      const interfaces: string[] = [];
      
      const generateInterface = (obj: any, name: string): string => {
        let res = `interface ${name} {\n`;
        for (const key in obj) {
          const val = obj[key];
          const type = typeof val;
          
          if (val === null) {
            res += `  ${key}: any;\n`;
          } else if (Array.isArray(val)) {
            if (val.length > 0) {
              const itemType = typeof val[0];
              if (itemType === 'object' && val[0] !== null) {
                const subName = key.charAt(0).toUpperCase() + key.slice(1) + 'Item';
                interfaces.push(generateInterface(val[0], subName));
                res += `  ${key}: ${subName}[];\n`;
              } else {
                res += `  ${key}: ${itemType}[];\n`;
              }
            } else {
              res += `  ${key}: any[];\n`;
            }
          } else if (type === 'object') {
            const subName = key.charAt(0).toUpperCase() + key.slice(1);
            interfaces.push(generateInterface(val, subName));
            res += `  ${key}: ${subName};\n`;
          } else {
            res += `  ${key}: ${type};\n`;
          }
        }
        res += `}`;
        return res;
      };

      const root = generateInterface(parsed, 'RootObject');
      setOutput([...interfaces, root].join('\n\n'));
      toast.success('TypeScript interfaces generated');
    } catch (err) {
      toast.error('Invalid JSON input');
    }
  };

  const clear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="JSON to TypeScript" 
        description="Convert your JSON objects into strongly typed TypeScript interfaces instantly." 
      />

      <ToolLayout className="h-[calc(100vh-250px)] min-h-[500px]">
        {/* Input */}
        <ToolSection 
          title="Source JSON"
          titleId="json-src"
          actions={
            <button onClick={clear} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          }
        >
          <div className="flex flex-col gap-4 h-full">
            <ToolTextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{ "id": 1, "name": "DevNexus" }'
              className="flex-1 font-mono text-sm"
            />
            <ActionButton 
              onClick={generateTs} 
              label="Generate Interfaces" 
              icon={<Zap className="w-4 h-4" />} 
            />
          </div>
        </ToolSection>

        {/* Output */}
        <ToolSection 
          title="TypeScript Interfaces"
          titleId="ts-output"
          actions={output && <CopyButton text={output} />}
        >
          <div className="w-full h-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden relative">
            {!output ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 gap-3">
                <FileCode className="w-12 h-12 opacity-20" />
                <p className="text-sm">TS code will appear here</p>
              </div>
            ) : (
              <textarea
                readOnly
                value={output}
                className="w-full h-full p-6 bg-transparent text-sm font-mono text-indigo-600 dark:text-indigo-400 leading-relaxed outline-none resize-none"
              />
            )}
          </div>
        </ToolSection>
      </ToolLayout>
    </div>
  );
}
