import React, { useState } from 'react';
import { ToolHeader, ActionButton, CopyButton, ToolLayout, ToolSection, ToolTextArea } from '@/components/tools/shared/tool-ui';
import { toast } from 'react-hot-toast';
import { Link2, Trash2 } from 'lucide-react';

export function UrlTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => {
    try {
      if (!input.trim()) return;
      setOutput(encodeURIComponent(input));
      toast.success('Encoded successfully');
    } catch (err) {
      toast.error('Encoding failed');
    }
  };

  const decode = () => {
    try {
      if (!input.trim()) return;
      setOutput(decodeURIComponent(input));
      toast.success('Decoded successfully');
    } catch (err) {
      toast.error('Decoding failed: Invalid URL encoding');
    }
  };

  const clear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="URL Encoder/Decoder" 
        description="Safely encode and decode URL parameters for web development." 
      />

      <ToolLayout className="h-[calc(100vh-250px)] min-h-[500px]">
        <ToolSection 
          title="Input URL/Text"
          actions={
            <button 
              onClick={clear}
              className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-all"
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
              placeholder="Enter URL or text to encode/decode..."
            />
            <div className="flex gap-3">
              <ActionButton 
                onClick={encode} 
                label="Encode" 
                icon={<Link2 className="w-4 h-4" />} 
              />
              <ActionButton 
                onClick={decode} 
                label="Decode" 
                variant="secondary"
                icon={<Link2 className="w-4 h-4" />} 
              />
            </div>
          </div>
        </ToolSection>

        <ToolSection 
          title="Output"
          actions={output && <CopyButton text={output} />}
        >
          <ToolTextArea
            readOnly
            value={output}
            placeholder="Result will appear here..."
          />
        </ToolSection>
      </ToolLayout>
    </div>
  );
}
