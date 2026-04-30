import React, { useState } from 'react';
import { ToolHeader, ToolLayout, ToolSection, ActionButton } from '@/components/tools/shared/tool-ui';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Clock, 
  ArrowRightLeft,
  Timer,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export function TimeCalculator() {
  // Duration Calculator State
  const [durations, setDurations] = useState<{ h: number; m: number; s: number; type: 'add' | 'subtract' }[]>([]);
  const [currentH, setCurrentH] = useState('');
  const [currentM, setCurrentM] = useState('');
  const [currentS, setCurrentS] = useState('');

  // Time Difference State
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');

  // Add/Subtract from Date State
  const [baseDate, setBaseDate] = useState(new Date().toISOString().slice(0, 16));
  const [offsetH, setOffsetH] = useState('');
  const [offsetM, setOffsetM] = useState('');
  const [offsetD, setOffsetD] = useState('');

  // Duration Logic
  const addDuration = (type: 'add' | 'subtract' = 'add') => {
    const h = parseInt(currentH) || 0;
    const m = parseInt(currentM) || 0;
    const s = parseInt(currentS) || 0;

    if (h === 0 && m === 0 && s === 0) return;

    setDurations([...durations, { h, m, s, type }]);
    setCurrentH('');
    setCurrentM('');
    setCurrentS('');
  };

  const calculateTotal = () => {
    let totalSeconds = durations.reduce((acc, d) => {
      const seconds = (d.h * 3600) + (d.m * 60) + d.s;
      return d.type === 'add' ? acc + seconds : acc - seconds;
    }, 0);

    const isNegative = totalSeconds < 0;
    totalSeconds = Math.abs(totalSeconds);

    const h = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;

    return { h, m, s, isNegative };
  };

  const total = calculateTotal();

  // Date Difference Logic
  const calculateDateDifference = () => {
    if (!startDateTime || !endDateTime) return null;

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const diffMs = end.getTime() - start.getTime();
    
    if (isNaN(diffMs)) return null;

    const totalSeconds = Math.abs(diffMs) / 1000;
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return {
      days,
      hours,
      minutes,
      seconds,
      totalHours: (totalSeconds / 3600).toFixed(2),
      isPast: diffMs < 0
    };
  };

  const dateDiffResult = calculateDateDifference();

  // Add/Subtract from Date Logic
  const calculateOffsetDate = (type: 'add' | 'subtract') => {
    if (!baseDate) return null;
    const date = new Date(baseDate);
    const h = (parseInt(offsetH) || 0) * (type === 'add' ? 1 : -1);
    const m = (parseInt(offsetM) || 0) * (type === 'add' ? 1 : -1);
    const d = (parseInt(offsetD) || 0) * (type === 'add' ? 1 : -1);

    date.setDate(date.getDate() + d);
    date.setHours(date.getHours() + h);
    date.setMinutes(date.getMinutes() + m);

    return date;
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col space-y-6">
      <ToolHeader 
        title="Time & Date Calculator" 
        description="Calculate time stretches, count differences between dates, and manipulate timestamps with precision." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Duration Calculator */}
        <ToolSection 
          title="Duration Adder" 
          titleId="duration-title"
          actions={
            <ActionButton 
              icon={<RotateCcw className="w-4 h-4" />} 
              onClick={() => setDurations([])} 
              label="Reset"
            />
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <input 
                type="number" 
                value={currentH}
                onChange={(e) => setCurrentH(e.target.value)}
                placeholder="HH"
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono"
              />
              <input 
                type="number" 
                value={currentM}
                onChange={(e) => setCurrentM(e.target.value)}
                placeholder="MM"
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono"
              />
              <input 
                type="number" 
                value={currentS}
                onChange={(e) => setCurrentS(e.target.value)}
                placeholder="SS"
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => addDuration('add')}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-md hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
              <button
                onClick={() => addDuration('subtract')}
                className="flex-1 py-2 bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 rounded-xl font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Minus className="w-3.5 h-3.5" /> Sub
              </button>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-black/20">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Running Total</span>
                <div className={cn(
                  "font-mono font-bold text-lg",
                  total.isNegative ? "text-red-500" : "text-indigo-600 dark:text-indigo-400"
                )}>
                  {total.isNegative && '- '}{total.h}h {total.m}m {total.s}s
                </div>
              </div>
              <div className="max-h-[240px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {durations.length === 0 ? (
                  <p className="text-center py-12 text-[10px] text-zinc-400 font-medium uppercase tracking-widest">No entries</p>
                ) : (
                  durations.map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors group border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
                      <div className="flex items-center gap-3 text-xs">
                        <span className={cn(
                          "w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold text-white",
                          d.type === 'add' ? "bg-indigo-500" : "bg-zinc-500"
                        )}>
                          {d.type === 'add' ? '+' : '-'}
                        </span>
                        <span className="font-mono text-zinc-600 dark:text-zinc-400">{d.h}h {d.m}m {d.s}s</span>
                      </div>
                      <button 
                        onClick={() => setDurations(durations.filter((_, idx) => idx !== i))}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500 transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </ToolSection>

        {/* Date Difference */}
        <ToolSection title="Date Difference" titleId="date-diff-title">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Start Timestamp</label>
                <input 
                  type="datetime-local" 
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:color-scheme-dark"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">End Timestamp</label>
                <input 
                  type="datetime-local" 
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:color-scheme-dark"
                />
              </div>
            </div>

            {dateDiffResult ? (
              <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-200 dark:border-indigo-800/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <ArrowRightLeft className="w-5 h-5 text-white" />
                  </div>
                  {dateDiffResult.isPast && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded text-[9px] font-bold uppercase tracking-wider">Inverse Order</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Time Span</span>
                    <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      {dateDiffResult.days}d {dateDiffResult.hours}h {dateDiffResult.minutes}m
                    </p>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Hours</span>
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {dateDiffResult.totalHours}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[140px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-6 text-center">
                <Calendar className="w-8 h-8 text-zinc-200 dark:text-zinc-800 mb-2" />
                <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">Select dates to calculate</p>
              </div>
            )}
          </div>
        </ToolSection>

        {/* Add/Subtract to Timestamp */}
        <ToolSection title="Manipulate Date" titleId="date-man-title">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Base Date & Time</label>
              <input 
                type="datetime-local" 
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:color-scheme-dark"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Days</label>
                <input 
                  type="number" 
                  value={offsetD}
                  onChange={(e) => setOffsetD(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Hours</label>
                <input 
                  type="number" 
                  value={offsetH}
                  onChange={(e) => setOffsetH(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Mins</label>
                <input 
                  type="number" 
                  value={offsetM}
                  onChange={(e) => setOffsetM(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">After Addition</span>
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 leading-relaxed">
                  {calculateOffsetDate('add')?.toLocaleString() || '---'}
                </div>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">After Subtraction</span>
                <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {calculateOffsetDate('subtract')?.toLocaleString() || '---'}
                </div>
              </div>
            </div>
          </div>
        </ToolSection>
      </div>
    </div>
  );
}
