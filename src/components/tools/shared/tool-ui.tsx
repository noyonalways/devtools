import React from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ToolHeaderProps {
  title: string;
  description: string;
}

export function ToolHeader({ title, description }: ToolHeaderProps) {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex-1">
        <h2 className="text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">{title}</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{description}</p>
      </div>
      <button
        onClick={handleShare}
        className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
        title="Share Tool Link"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </button>
    </div>
  );
}

interface ActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

export function ActionButton({ onClick, icon, label, variant = 'primary', className }: ActionButtonProps) {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white",
    secondary: "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-200",
    danger: "bg-red-600 hover:bg-red-500 text-white"
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-3 py-2 lg:px-4 lg:py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${variants[variant]} ${className}`}
    >
      {icon}
      <span className={icon ? "hidden sm:inline" : ""}>{label}</span>
    </button>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-all"
      title="Copy to clipboard"
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
    >
      {copied ? <Check className="w-4 h-4 text-green-500" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
    </button>
  );
}

interface ToolSectionProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  titleId?: string;
}

export function ToolSection({ title, children, actions, className, titleId }: ToolSectionProps) {
  return (
    <section className={`flex flex-col gap-3 h-full ${className}`} aria-labelledby={titleId}>
      <div className="flex items-center justify-between min-h-[40px]">
        <h3 
          id={titleId}
          className="text-sm font-bold text-zinc-700 dark:text-zinc-300 tracking-tight uppercase text-[10px] opacity-60"
        >
          {title}
        </h3>
        <div className="flex items-center gap-1">
          {actions}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </section>
  );
}

export function ToolLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 ${className}`}>
      {children}
    </div>
  );
}

export function ToolTextArea({ 
  value, 
  onChange, 
  placeholder, 
  className,
  readOnly = false,
  ...props 
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      spellCheck={false}
      className={`w-full h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all ${className}`}
      {...props}
    />
  );
}
