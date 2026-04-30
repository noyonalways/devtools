import React, { useState } from 'react';
import { ToolHeader, CopyButton, ActionButton } from '@/components/tools/shared/tool-ui';
import { Mail, Smartphone, Monitor, RotateCcw, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';

const DEFAULT_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Email Template</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f5;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #4f46e5;
      color: #ffffff;
      padding: 40px 20px;
      text-align: center;
    }
    .content {
      padding: 40px 20px;
      color: #18181b;
      line-height: 1.6;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #71717a;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to DevNexus!</h1>
    </div>
    <div class="content">
      <h2>Hello there,</h2>
      <p>This is a responsive email template you can use to test your email designs. DevNexus helps you preview how your emails will look on different devices.</p>
      <p>Feel free to edit the HTML and CSS on the left to see live changes.</p>
      <a href="#" class="button">Get Started Now</a>
    </div>
    <div class="footer">
      <p>&copy; 2026 DevNexus. All rights reserved.</p>
      <p>You are receiving this email because you are a user of DevNexus.</p>
    </div>
  </div>
</body>
</html>`;

export function EmailPreviewer() {
  const [html, setHtml] = useState(DEFAULT_EMAIL_TEMPLATE);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const reset = () => {
    setHtml(DEFAULT_EMAIL_TEMPLATE);
  };

  const sendTest = () => {
    toast.success('Test email simulation triggered! (In a real app, this would send a test email)');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="Email Previewer" 
        description="Design and preview responsive HTML email templates. Test how your emails look on desktop and mobile clients." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)] min-h-[600px]">
        {/* Editor Section */}
        <div className="flex flex-col gap-4 h-full overflow-hidden">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email HTML Source</label>
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
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Client Preview</label>
            <div className="flex items-center gap-2">
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
              <ActionButton 
                onClick={sendTest} 
                icon={<Send className="w-4 h-4" />} 
                label="Send Test" 
                variant="primary"
              />
            </div>
          </div>
          
          <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex justify-center p-4">
            <div 
              className={cn(
                "bg-white transition-all duration-300 shadow-lg overflow-hidden border border-zinc-200",
                viewMode === 'mobile' ? "w-[375px] rounded-[32px] border-[8px] border-zinc-900" : "w-full rounded-lg"
              )}
              style={{ height: '100%' }}
            >
              <iframe
                title="Email Preview"
                srcDoc={html}
                className="w-full h-full bg-white"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
