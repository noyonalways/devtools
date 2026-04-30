import React, { useState } from 'react';
import { ToolHeader, ActionButton, CopyButton, ToolLayout, ToolSection, ToolTextArea } from '@/components/tools/shared/tool-ui';
import { FileJson, FileSpreadsheet, Download } from 'lucide-react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';

export function JsonCsvConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const csv = Papa.unparse(parsed);
      setOutput(csv);
    } catch (error) {
      toast.error('Invalid JSON format. Ensure it is an array of objects.');
      setOutput('');
    }
  };

  const downloadCsv = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="JSON to CSV Converter" 
        description="Convert JSON arrays into CSV format quickly."
      />

      <ToolLayout className="h-[calc(100vh-300px)] min-h-[500px]">
        <ToolSection 
          title="JSON Input"
          actions={
            <ActionButton 
              icon={<FileSpreadsheet className="w-4 h-4" />} 
              onClick={convert}
              label="Convert to CSV"
            />
          }
        >
          <ToolTextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
          />
        </ToolSection>

        <ToolSection 
          title="CSV Output"
          actions={
            <div className="flex items-center gap-2">
              <CopyButton text={output} />
              <ActionButton 
                icon={<Download className="w-4 h-4" />} 
                onClick={downloadCsv}
                label="Download"
                variant="secondary"
              />
            </div>
          }
        >
          <ToolTextArea
            readOnly
            value={output}
            placeholder="CSV output will appear here..."
          />
        </ToolSection>
      </ToolLayout>
    </div>
  );
}
