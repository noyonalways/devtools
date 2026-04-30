import React, { useState } from 'react';
import { ToolHeader, ToolLayout, ToolSection, ActionButton } from '@/components/tools/shared/tool-ui';
import { Sparkles, Send, Loader2, Copy, Trash2, MessageSquare } from 'lucide-react';
import { getGemini, MODELS } from '@/lib/gemini';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AiAssistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = getGemini();
      const response = await ai.models.generateContent({
        model: MODELS.DEFAULT,
        contents: [...messages, userMessage].map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        config: {
          tools: [
            { googleSearch: {} }
          ],
          systemInstruction: "You are a helpful AI assistant integrated into DevNexus, a developer toolkit. You help developers with coding, debugging, and technical questions. You have access to Google Search for real-time information. Keep your responses concise and well-formatted using Markdown.",
        }
      });

      const assistantContent = response.text || "I'm sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }]);
    } catch (error) {
      console.error('AI Error:', error);
      toast.error('Failed to get AI response. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast.success('Chat cleared');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <ToolHeader 
        title="AI Developer Assistant" 
        description="Ask questions, get code snippets, or debug logic with the help of Gemini AI." 
      />

      <ToolLayout className="flex-1 flex flex-col min-h-[600px]">
        <ToolSection 
          title="Conversation" 
          titleId="ai-chat-title"
          className="flex-1 flex flex-col"
          actions={
            <div className="flex gap-2">
              <ActionButton 
                icon={<Trash2 className="w-4 h-4" />} 
                onClick={clearChat} 
                label="Clear Chat"
                className="hover:text-red-500"
              />
            </div>
          }
        >
          <div className="flex-1 flex flex-col gap-4 min-h-0">
            <div className="flex-1 overflow-y-auto p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 space-y-3">
                  <MessageSquare className="w-12 h-12 opacity-20" />
                  <p className="text-sm italic">Start a conversation with the AI assistant...</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex flex-col max-w-[85%] gap-2",
                      msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                      msg.role === 'user' 
                        ? "bg-indigo-600 text-white rounded-tr-none" 
                        : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-tl-none"
                    )}>
                      <div className="markdown-body">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                    {msg.role === 'assistant' && (
                      <button 
                        onClick={() => copyToClipboard(msg.content)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                        title="Copy response"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex mr-auto items-start gap-2">
                  <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask something... (Shift+Enter for new line)"
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none min-h-[80px]"
                aria-labelledby="ai-chat-title"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={cn(
                  "absolute bottom-3 right-3 p-2 rounded-lg transition-all",
                  input.trim() && !isLoading
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-105"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                )}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </ToolSection>
      </ToolLayout>
    </div>
  );
}
