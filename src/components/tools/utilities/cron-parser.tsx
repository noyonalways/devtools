import React, { useState, useEffect } from 'react';
import cronstrue from 'cronstrue';
import { ToolHeader, ToolSection, ActionButton, CopyButton } from '@/components/tools/shared/tool-ui';
import { Timer, AlertCircle, Info, Calendar, Ghost, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CronParser() {
  const [expression, setExpression] = useState('*/5 * * * *');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    parseCron();
  }, [expression]);

  const parseCron = () => {
    if (!expression.trim()) {
      setDescription('');
      setError(null);
      return;
    }

    try {
      const desc = cronstrue.toString(expression, { use24HourTimeFormat: true });
      setDescription(desc);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid cron expression');
      setDescription('');
    }
  };

  const examples = [
    { label: 'Every 5 min', val: '*/5 * * * *' },
    { label: 'Every hour', val: '0 * * * *' },
    { label: 'Midnight daily', val: '0 0 * * *' },
    { label: 'Mon-Fri 9am', val: '0 9 * * 1-5' },
    { label: '1st of month', val: '0 0 1 * *' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="Cron Expression Parser" 
        description="Convert crontab expressions into human-readable descriptions and validate your schedules." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input and Examples */}
        <div className="lg:col-span-1 space-y-6">
          <ToolSection title="Cron Expression" titleId="cron-input">
            <div className="space-y-4">
              <input 
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="* * * * *"
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 font-mono text-lg text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-center"
              />
              
              <div className="pt-4 space-y-3">
                 <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Wand2 className="w-3 h-3" />
                    Presets
                 </h4>
                 <div className="grid grid-cols-1 gap-2">
                    {examples.map(ex => (
                      <button
                        key={ex.val}
                        onClick={() => setExpression(ex.val)}
                        className="px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 transition-all text-left flex justify-between items-center group"
                      >
                        {ex.label}
                        <code className="bg-zinc-100 dark:bg-zinc-700 px-2 py-0.5 rounded opacity-50 group-hover:opacity-100 transition-opacity">{ex.val}</code>
                      </button>
                    ))}
                 </div>
              </div>
            </div>
          </ToolSection>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <ToolSection 
            title="Human Description" 
            titleId="cron-description"
            className="flex-1"
          >
            <div className="h-full flex flex-col gap-6">
              <div className={cn(
                "flex-1 p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all min-h-[250px]",
                error 
                  ? "bg-red-500/5 border-red-500/20 text-red-600" 
                  : "bg-indigo-500/5 border-indigo-500/20 text-indigo-600 dark:text-indigo-400"
              )}>
                {error ? (
                  <>
                    <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                    <h3 className="text-lg font-bold mb-2">Invalid Expression</h3>
                    <p className="text-sm opacity-80 max-w-sm">{error}</p>
                  </>
                ) : description ? (
                  <>
                    <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-indigo-500/20 flex items-center justify-center mb-6">
                      <Timer className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black mb-4 tracking-tight leading-tight max-w-md">
                      {description}
                    </h3>
                    <div className="px-4 py-1.5 bg-indigo-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                       Validated Schedule
                    </div>
                  </>
                ) : (
                  <div className="text-zinc-400 italic">Enter an expression to parse</div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-start gap-4">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                       <Calendar className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                       <h5 className="text-xs font-bold text-zinc-900 dark:text-white uppercase mb-1">Standard Format</h5>
                       <p className="text-[10px] text-zinc-500 leading-relaxed">Minute &nbsp; Hour &nbsp; Day &nbsp; Month &nbsp; Weekday</p>
                    </div>
                 </div>
                 <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-start gap-4">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                       <Info className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                       <h5 className="text-xs font-bold text-zinc-900 dark:text-white uppercase mb-1">Local Time</h5>
                       <p className="text-[10px] text-zinc-500 leading-relaxed">Descriptions are shown in your local timezone settings.</p>
                    </div>
                 </div>
              </div>
            </div>
          </ToolSection>

          <div className="p-6 bg-zinc-900 rounded-3xl text-white flex items-center justify-between overflow-hidden relative">
             <div className="relative z-10">
                <h4 className="text-lg font-bold mb-1">Developer Tip</h4>
                <p className="text-sm opacity-60 max-w-md">Use <code className="bg-white/10 px-1.5 rounded">0 0 * * *</code> for daily cleanup tasks at midnight.</p>
             </div>
             <Ghost className="w-24 h-24 absolute -right-4 -bottom-4 opacity-10 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
