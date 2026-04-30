import React, { useState } from 'react';
import { ToolHeader, ActionButton, CopyButton, ToolSection, ToolTextArea } from '@/components/tools/shared/tool-ui';
import { RefreshCw } from 'lucide-react';

import { LOREM_WORDS } from '@/mock_data/lorem-words';

export function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [output, setOutput] = useState('');

  const generate = () => {
    let result = '';
    if (type === 'paragraphs') {
      for (let i = 0; i < count; i++) {
        result += generateParagraph() + '\n\n';
      }
    } else if (type === 'sentences') {
      for (let i = 0; i < count; i++) {
        result += generateSentence() + ' ';
      }
    } else {
      result = generateWords(count);
    }
    setOutput(result.trim());
  };

  const generateWords = (num: number) => {
    let words = [];
    for (let i = 0; i < num; i++) {
      words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
    return words.join(' ');
  };

  const generateSentence = () => {
    const length = Math.floor(Math.random() * 10) + 5;
    let sentence = generateWords(length);
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };

  const generateParagraph = () => {
    const length = Math.floor(Math.random() * 5) + 3;
    let paragraph = [];
    for (let i = 0; i < length; i++) {
      paragraph.push(generateSentence());
    }
    return paragraph.join(' ');
  };

  React.useEffect(() => {
    generate();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <ToolHeader 
        title="Lorem Ipsum Generator" 
        description="Generate placeholder text for your designs."
      />

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 lg:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ToolSection title="Type">
            <div className="flex bg-zinc-50 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
              {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    type === t 
                      ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-sm border border-zinc-200 dark:border-transparent' 
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </ToolSection>

          <ToolSection title="Count">
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </ToolSection>
        </div>

        <div className="flex justify-end">
          <ActionButton 
            icon={<RefreshCw className="w-4 h-4" />} 
            onClick={generate}
            label="Regenerate"
          />
        </div>
      </div>

      <ToolSection 
        title="Generated Content"
        actions={<CopyButton text={output} />}
      >
        <ToolTextArea
          readOnly
          value={output}
          placeholder="Generated text will appear here..."
          className="h-96 leading-relaxed"
        />
      </ToolSection>
    </div>
  );
}
