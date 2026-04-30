import React, { useState, useEffect } from 'react';
import { ToolHeader, ToolLayout, ToolSection, ActionButton, CopyButton } from '@/components/tools/shared/tool-ui';
import { Clock, Calendar, ArrowRight, History, RefreshCw, Layers } from 'lucide-react';
import { format, fromUnixTime, getUnixTime, parseISO, isValid } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export function EpochConverter() {
  const [epochInput, setEpochInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [now, setNow] = useState(getUnixTime(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(getUnixTime(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const convertEpoch = (val: string) => {
    setEpochInput(val);
    if (!val) return;
    
    try {
      const num = parseInt(val);
      if (isNaN(num)) throw new Error();
      // Handle milliseconds if input looks like it (13 digits)
      const date = val.length >= 13 ? new Date(num) : fromUnixTime(num);
      if (!isValid(date)) throw new Error();
      setDateInput(format(date, "yyyy-MM-dd'T'HH:mm:ss"));
    } catch (e) {
      // Don't show error toast while typing
    }
  };

  const convertDate = (val: string) => {
    setDateInput(val);
    if (!val) return;
    
    try {
      const date = parseISO(val);
      if (!isValid(date)) throw new Error();
      setEpochInput(getUnixTime(date).toString());
    } catch (e) {
      // Don't show error toast while typing
    }
  };

  const setNowInputs = () => {
    const d = new Date();
    setEpochInput(getUnixTime(d).toString());
    setDateInput(format(d, "yyyy-MM-dd'T'HH:mm:ss"));
    toast.success('Updated to current time');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="Unix Epoch Converter" 
        description="Convert between Unix timestamps and human-readable dates with ease." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real-time Clock */}
        <div className="lg:col-span-2">
           <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden relative group">
              <div className="flex items-center gap-6 relative z-10">
                 <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                    <Clock className="w-8 h-8 text-indigo-500 animate-pulse" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white font-mono tracking-tighter">
                      {now}
                    </h3>
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1">Current Unix Timestamp</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                 <div className="flex-1 text-right">
                    <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 italic">
                      {format(fromUnixTime(now), 'EEEE, MMMM do yyyy')}
                    </div>
                    <div className="text-xs text-zinc-500 font-mono">
                      {format(fromUnixTime(now), 'HH:mm:ss O')}
                    </div>
                 </div>
                 <button 
                  onClick={setNowInputs}
                  className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                  title="Copy current to inputs"
                 >
                    <RefreshCw className="w-5 h-5" />
                 </button>
              </div>

              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-10 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
           </div>
        </div>

        {/* Converter Section */}
        <ToolSection title="Unix Timestamp to Date" titleId="epoch-to-date">
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Epoch (Seconds)</label>
                 <div className="relative">
                    <input 
                      type="text"
                      value={epochInput}
                      onChange={(e) => convertEpoch(e.target.value)}
                      placeholder="e.g. 1714483200"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-4 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                 </div>
              </div>
              
              <div className="flex justify-center">
                 <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-indigo-500 rotate-90 lg:rotate-0" />
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Resulting Date</label>
                    {dateInput && <CopyButton text={dateInput} />}
                 </div>
                 <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                    {epochInput ? (
                      <div className="space-y-2">
                        <div className="text-lg font-bold text-white truncate">
                          {dateInput ? format(parseISO(dateInput), 'MMMM do, yyyy') : 'Invalid Timestamp'}
                        </div>
                        <div className="text-xs font-mono text-indigo-400">
                          {dateInput ? format(parseISO(dateInput), 'HH:mm:ss O (zzzz)') : '-'}
                        </div>
                      </div>
                    ) : (
                      <div className="text-zinc-500 text-sm italic">Result will appear here...</div>
                    )}
                 </div>
              </div>
           </div>
        </ToolSection>

        {/* Reverse Converter */}
        <ToolSection title="Date to Unix Timestamp" titleId="date-to-epoch">
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Human Date (ISO 8601)</label>
                 <div className="relative">
                    <input 
                      type="datetime-local"
                      value={dateInput}
                      onChange={(e) => convertDate(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-4 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all custom-datetime-input"
                    />
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                 </div>
              </div>

              <div className="flex justify-center">
                 <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-indigo-500 rotate-90 lg:rotate-0" />
                 </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Resulting Epoch</label>
                    {epochInput && <CopyButton text={epochInput} />}
                 </div>
                 <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                    {dateInput ? (
                       <div className="space-y-2">
                        <div className="text-2xl font-black text-white font-mono tracking-tighter">
                          {epochInput}
                        </div>
                        <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                          Seconds since Jan 01 1970
                        </div>
                      </div>
                    ) : (
                      <div className="text-zinc-500 text-sm italic">Select a date above...</div>
                    )}
                 </div>
              </div>
           </div>
        </ToolSection>
      </div>
    </div>
  );
}
