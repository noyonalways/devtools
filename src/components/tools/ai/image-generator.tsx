import React, { useState } from 'react';
import { ToolHeader, ToolLayout, ToolSection, ActionButton } from '@/components/tools/shared/tool-ui';
import { Image as ImageIcon, Download, Loader2, Sparkles, Send, RefreshCw } from 'lucide-react';
import { getGemini, MODELS } from '@/lib/gemini';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setImageUrl(null);

    try {
      const ai = getGemini();
      const response = await ai.models.generateContent({
        model: MODELS.IMAGE,
        contents: [{ parts: [{ text: prompt }] }],
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          setImageUrl(`data:image/png;base64,${base64Data}`);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        toast.error('The model did not return an image. Try a different prompt.');
      } else {
        toast.success('Image generated successfully!');
      }
    } catch (error) {
      console.error('Image Generation Error:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <ToolHeader 
        title="AI Image Generator" 
        description="Generate unique images from text descriptions using Gemini AI." 
      />

      <ToolLayout className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[500px]">
        <ToolSection 
          title="Prompt" 
          titleId="image-prompt-title"
          className="lg:w-1/3 flex flex-col"
        >
          <div className="flex flex-col gap-4 h-full">
            <div className="flex-1 flex flex-col gap-2">
              <label htmlFor="prompt-input" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Description
              </label>
              <textarea
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic city with neon lights and flying cars..."
                className="flex-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none min-h-[150px]"
                aria-labelledby="image-prompt-title"
              />
            </div>

            <button
              onClick={generateImage}
              disabled={!prompt.trim() || isGenerating}
              className={cn(
                "w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                prompt.trim() && !isGenerating
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Image
                </>
              )}
            </button>
          </div>
        </ToolSection>

        <ToolSection 
          title="Generated Result" 
          titleId="image-result-title"
          className="flex-1 flex flex-col"
          actions={
            imageUrl && (
              <div className="flex gap-2">
                <ActionButton 
                  icon={<Download className="w-4 h-4" />} 
                  onClick={downloadImage} 
                  label="Download Image"
                />
                <ActionButton 
                  icon={<RefreshCw className="w-4 h-4" />} 
                  onClick={generateImage} 
                  label="Regenerate"
                />
              </div>
            )
          }
        >
          <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative min-h-[300px]">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4 text-zinc-400">
                <div className="relative">
                  <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-indigo-400 animate-pulse" />
                </div>
                <p className="text-sm italic animate-pulse">Creating your masterpiece...</p>
              </div>
            ) : imageUrl ? (
              <img 
                src={imageUrl} 
                alt="AI Generated" 
                className="max-w-full max-h-full object-contain shadow-2xl"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-600">
                <ImageIcon className="w-16 h-16 opacity-10" />
                <p className="text-sm italic">Your generated image will appear here</p>
              </div>
            )}
          </div>
        </ToolSection>
      </ToolLayout>
    </div>
  );
}
