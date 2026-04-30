import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import { ToolHeader, ActionButton, ToolLayout, ToolSection } from '@/components/tools/shared/tool-ui';
import { 
  Pencil, 
  Eraser, 
  Trash2, 
  Download, 
  Undo2, 
  Redo2, 
  RotateCcw,
  Square,
  Circle as CircleIcon,
  Type as TypeIcon,
  MousePointer2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface DrawingLine {
  tool: string;
  points: number[];
  color: string;
  strokeWidth: number;
}

export function Whiteboard() {
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState<DrawingLine[]>([]);
  const [history, setHistory] = useState<DrawingLine[][]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [color, setColor] = useState('#6366f1');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const isDrawing = useRef(false);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newLine = { tool, points: [pos.x, pos.y], color: tool === 'eraser' ? '#ffffff' : color, strokeWidth };
    setLines([...lines, newLine]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    // Add to history
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push([...lines]);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep <= 0) {
      setLines([]);
      setHistoryStep(-1);
      return;
    }
    const prevStep = historyStep - 1;
    setLines(history[prevStep]);
    setHistoryStep(prevStep);
  };

  const redo = () => {
    if (historyStep >= history.length - 1) return;
    const nextStep = historyStep + 1;
    setLines(history[nextStep]);
    setHistoryStep(nextStep);
  };

  const clear = () => {
    setLines([]);
    setHistory([]);
    setHistoryStep(-1);
    toast.success('Canvas cleared');
  };

  const reset = () => {
    setLines([]);
    setHistory([]);
    setHistoryStep(-1);
    setTool('pen');
    setColor('#6366f1');
    setStrokeWidth(4);
    toast.success('Canvas reset');
  };

  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = `whiteboard-${new Date().getTime()}.png`;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported successfully');
  };

  const colors = [
    '#000000', '#ef4444', '#f97316', '#f59e0b', '#10b981', 
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef'
  ];

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <ToolHeader 
        title="Planning Whiteboard" 
        description="A simple canvas for sketching ideas, wireframes, and planning your next feature." 
      />

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[600px]">
        {/* Toolbar */}
        <div className="w-full lg:w-20 flex lg:flex-col gap-2 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-x-auto lg:overflow-x-visible">
          <ToolbarButton 
            active={tool === 'pen'} 
            onClick={() => setTool('pen')} 
            icon={<Pencil className="w-5 h-5" />} 
            label="Pen"
          />
          <ToolbarButton 
            active={tool === 'eraser'} 
            onClick={() => setTool('eraser')} 
            icon={<Eraser className="w-5 h-5" />} 
            label="Eraser"
          />
          
          <div className="hidden lg:block h-px bg-zinc-200 dark:bg-zinc-800 my-2" />
          <div className="lg:hidden w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />

          <ToolbarButton 
            onClick={undo} 
            disabled={historyStep < 0}
            icon={<Undo2 className="w-5 h-5" />} 
            label="Undo"
          />
          <ToolbarButton 
            onClick={redo} 
            disabled={historyStep >= history.length - 1}
            icon={<Redo2 className="w-5 h-5" />} 
            label="Redo"
          />

          <div className="hidden lg:block h-px bg-zinc-200 dark:bg-zinc-800 my-2" />
          <div className="lg:hidden w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />

          <ToolbarButton 
            onClick={clear} 
            icon={<Trash2 className="w-5 h-5" />} 
            label="Clear Canvas"
            className="hover:text-red-500"
          />
          <ToolbarButton 
            onClick={reset} 
            icon={<RotateCcw className="w-5 h-5" />} 
            label="Reset All"
            className="hover:text-orange-500"
          />
          <ToolbarButton 
            onClick={handleExport} 
            icon={<Download className="w-5 h-5" />} 
            label="Export"
          />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">Colors</span>
              <div className="flex gap-1.5">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-all",
                      color === c ? "border-zinc-900 dark:border-zinc-100 scale-110" : "border-transparent hover:scale-105"
                    )}
                    style={{ backgroundColor: c }}
                    aria-label={`Select color ${c}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">Size</span>
              <input 
                type="range" 
                min="1" 
                max="20" 
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                className="w-32 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-xs font-mono text-zinc-500 w-4">{strokeWidth}</span>
            </div>
          </div>

          <div 
            ref={containerRef}
            className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-inner overflow-hidden relative cursor-crosshair"
          >
            <Stage
              width={dimensions.width}
              height={dimensions.height}
              onMouseDown={handleMouseDown}
              onMousemove={handleMouseMove}
              onMouseup={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
              ref={stageRef}
            >
              <Layer>
                <Rect 
                  width={dimensions.width} 
                  height={dimensions.height} 
                  fill="white" 
                  listening={false} 
                />
                {lines.map((line, i) => (
                  <Line
                    key={i}
                    points={line.points}
                    stroke={line.color}
                    strokeWidth={line.strokeWidth}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={
                      line.tool === 'eraser' ? 'destination-out' : 'source-over'
                    }
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ 
  active, 
  onClick, 
  icon, 
  label, 
  disabled,
  className 
}: { 
  active?: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={cn(
        "p-3 rounded-xl transition-all flex items-center justify-center shrink-0",
        active 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
          : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800",
        disabled && "opacity-30 cursor-not-allowed grayscale",
        className
      )}
    >
      {icon}
    </button>
  );
}
