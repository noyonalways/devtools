import React, { useState } from 'react';
import { ToolHeader, ActionButton, CopyButton, ToolLayout, ToolSection, ToolTextArea } from '@/components/tools/shared/tool-ui';
import { toast } from 'react-hot-toast';
import { ArrowRightLeft, Binary, Trash2, FileCode } from 'lucide-react';

export function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        return;
      }

      if (mode === 'encode') {
        setOutput(btoa(input));
        toast.success('Text Encoded Successfully');
      } else {
        setOutput(atob(input.trim()));
        toast.success('Base64 Decoded Successfully');
      }
    } catch (err) {
      toast.error(mode === 'encode' ? 'Encoding failed' : 'Invalid Base64 string');
      setOutput('');
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    setInput(output);
    setOutput(input);
  };

  const clear = () => {
    setInput('');
    setOutput('');
    toast.success('Cleared');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="Base64 Converter" 
        description="Quickly encode or decode text and binary representations using Base64." 
      />

      <ToolLayout className="h-[calc(100vh-250px)] min-h-[500px]">
        {/* Input */}
        <ToolSection 
          title={mode === 'encode' ? "Plain Text Input" : "Base64 Input"}
          titleId="base64-input-title"
          actions={
            <button 
              onClick={clear}
              className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-all"
              title="Clear input"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          }
        >
          <div className="flex flex-col gap-4 h-full">
            <ToolTextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? "Enter text to encode..." : "Enter Base64 to decode..."}
              className="flex-1"
            />
            <div className="flex items-center gap-3">
              <ActionButton 
                onClick={process} 
                label={mode === 'encode' ? "Encode" : "Decode"} 
                icon={<Binary className="w-4 h-4" />} 
              />
              <button
                onClick={toggleMode}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all shadow-sm"
              >
                <ArrowRightLeft className="w-4 h-4 text-indigo-500" />
                Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
              </button>
            </div>
          </div>
        </ToolSection>

        {/* Output */}
        <ToolSection 
          title="Result"
          titleId="base64-output-title"
          actions={output && <CopyButton text={output} />}
        >
          <div className="w-full h-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden relative">
            {!output ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 gap-3">
                <FileCode className="w-12 h-12 opacity-20" />
                <p className="text-sm">Processed output will appear here</p>
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
