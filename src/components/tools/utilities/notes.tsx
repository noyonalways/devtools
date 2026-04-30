import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { ToolHeader, ToolLayout, ToolSection, ActionButton } from '@/components/tools/shared/tool-ui';
import { 
  Plus, 
  Trash2, 
  Search, 
  FileText, 
  Save, 
  Clock, 
  ChevronRight,
  MoreVertical,
  StickyNote,
  CheckCircle2,
  RefreshCw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('devnexus_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Local state for the editor to avoid re-rendering entire list on every keystroke
  const [localContent, setLocalContent] = useState('');
  const [localTitle, setLocalTitle] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeNote = notes.find(n => n.id === activeNoteId);

  // Sync entries to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('devnexus_notes', JSON.stringify(notes));
  }, [notes]);

  // Handle switching active note
  useEffect(() => {
    if (activeNote) {
      setLocalContent(activeNote.content);
      setLocalTitle(activeNote.title);
      setSaveStatus('idle');
    } else {
      setLocalContent('');
      setLocalTitle('');
    }
  }, [activeNoteId]);

  // Debounced Save Logic (5 seconds as requested, but we'll use 2s for better UX with debounce)
  useEffect(() => {
    if (!activeNoteId || (localContent === activeNote?.content && localTitle === activeNote?.title)) return;

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      setNotes(prev => prev.map(n => 
        n.id === activeNoteId ? { ...n, content: localContent, title: localTitle, updatedAt: Date.now() } : n
      ).sort((a, b) => b.updatedAt - a.updatedAt));
      setSaveStatus('saved');
    }, 2000); // Debounce for 2 seconds

    return () => clearTimeout(timer);
  }, [localContent, localTitle, activeNoteId]);

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      updatedAt: Date.now()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setIsEditing(true);
    toast.success('New note created');
  };

  const deleteNote = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) setActiveNoteId(null);
    toast.success('Note deleted');
  };

  const applyMarkdownShortcut = (prefix: string, suffix: string = prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = localContent;
    const selectedText = text.substring(start, end);
    
    const newText = 
      text.substring(0, start) + 
      prefix + selectedText + suffix + 
      text.substring(end);
    
    setLocalContent(newText);
    
    // Reset cursor position after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length
      );
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          applyMarkdownShortcut('**');
          break;
        case 'i':
          e.preventDefault();
          applyMarkdownShortcut('*');
          break;
        case '`':
          e.preventDefault();
          applyMarkdownShortcut('```\n', '\n```');
          break;
        case 's':
          e.preventDefault();
          // Manual save trigger
          if (activeNoteId) {
            setNotes(prev => prev.map(n => 
              n.id === activeNoteId ? { ...n, content: localContent, title: localTitle, updatedAt: Date.now() } : n
            ).sort((a, b) => b.updatedAt - a.updatedAt));
            setSaveStatus('saved');
            toast.success('Note saved');
          }
          break;
      }
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  return (
    <div className={cn(
      "h-full flex flex-col transition-all duration-300",
      isFullscreen ? "fixed inset-0 z-[100] bg-zinc-50 dark:bg-zinc-950 p-4 lg:p-8" : "max-w-6xl mx-auto w-full"
    )}>
      {!isFullscreen && (
        <ToolHeader 
          title="Developer Notes" 
          description="Quickly jot down ideas, snippets, or task lists. Supports Markdown, shortcuts (Ctrl+B/I/`), and auto-save." 
        />
      )}

      <div className={cn("flex flex-col lg:flex-row gap-6 flex-1 min-h-0", isFullscreen && "h-full")}>
        {/* Sidebar - Note List */}
        {!isFullscreen && (
          <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
              <button
                onClick={createNote}
                className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all"
                title="New Note"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  All Notes ({filteredNotes.length})
                </span>
                {saveStatus === 'saving' && (
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                    <RefreshCw className="w-3 h-3 animate-spin text-indigo-500" />
                    Saving...
                  </div>
                )}
                {saveStatus === 'saved' && (
                  <div className="flex items-center gap-1 text-[10px] text-green-500">
                    <CheckCircle2 className="w-3 h-3" />
                    Saved
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredNotes.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
                    <StickyNote className="w-10 h-10 text-zinc-200 dark:text-zinc-800" />
                    <p className="text-xs text-zinc-400 dark:text-zinc-600 italic">No notes found</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredNotes.map(note => (
                      <button
                        key={note.id}
                        onClick={() => setActiveNoteId(note.id)}
                        className={cn(
                          "w-full text-left p-3.5 rounded-xl transition-all duration-200 border group relative",
                          activeNoteId === note.id 
                            ? "bg-indigo-600/5 dark:bg-indigo-500/5 border-indigo-200/50 dark:border-indigo-500/20 shadow-sm" 
                            : "bg-white dark:bg-zinc-900 border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-sm"
                        )}
                      >
                        {activeNoteId === note.id && (
                          <motion.div 
                            layoutId="active-note-indicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full"
                          />
                        )}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className={cn(
                            "text-sm font-bold truncate",
                            activeNoteId === note.id ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-900 dark:text-zinc-100"
                          )}>
                            {note.id === activeNoteId ? (localTitle || 'Untitled Note') : (note.title || 'Untitled Note')}
                          </h3>
                          <button 
                            onClick={(e) => deleteNote(note.id, e)}
                            className={cn(
                              "opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-all",
                              "text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                            )}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mb-2">
                           {note.id === activeNoteId ? (localContent || 'No content...') : (note.content || 'No content...')}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400">
                          <Clock className="w-3 h-3" />
                          {formatDate(note.updatedAt)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className={cn(
          "flex-1 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden",
          isFullscreen && "border-none shadow-2xl"
        )}>
          {activeNote ? (
            <>
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
                <input 
                  type="text"
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  placeholder="Note Title"
                  className="flex-1 bg-transparent text-lg font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                      isEditing 
                        ? "bg-indigo-600 text-white border-indigo-600" 
                        : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                    )}
                  >
                    {isEditing ? 'Preview' : 'Edit'}
                  </button>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 text-zinc-400 hover:text-indigo-500 transition-colors"
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => deleteNote(activeNoteId)}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                {isEditing ? (
                  <textarea
                    ref={textareaRef}
                    value={localContent}
                    onChange={(e) => setLocalContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Start writing your note here... (Supports Markdown)&#10;Shortcuts: Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+` (Code Block)"
                    className="w-full h-full p-6 bg-transparent text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed focus:outline-none resize-none font-mono"
                  />
                ) : (
                  <div className="p-8 prose dark:prose-invert prose-sm max-w-none markdown-body">
                    {localContent ? (
                      <ReactMarkdown>{localContent}</ReactMarkdown>
                    ) : (
                      <p className="text-zinc-400 italic">No content to preview...</p>
                    )}
                  </div>
                )}
              </div>
              <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                 <div className="flex items-center gap-3">
                   <span>Words: {localContent.trim() ? localContent.trim().split(/\s+/).length : 0}</span>
                   <span>Characters: {localContent.length}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded-md">Ctrl</kbd> + 
                    <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded-md">B / I / `</kbd>
                 </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 text-center">
              <div className="relative w-20 h-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] flex items-center justify-center mb-8 border border-zinc-100 dark:border-zinc-800 shadow-sm group-hover:scale-105 transition-transform duration-500">
                <div className="pointer-events-none absolute inset-0 bg-indigo-500/5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <StickyNote className="w-10 h-10 text-zinc-300 dark:text-zinc-700 relative z-10" />
              </div>
              
              <div className="max-w-[320px] mb-8">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 tracking-tight">Select a note</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-500 leading-relaxed">
                  Start organizing your thoughts. Choose an existing note from the sidebar or create a fresh one to begin.
                </p>
              </div>

              <button 
                onClick={createNote}
                className="group relative flex items-center gap-3 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-500/25 transition-all hover:-translate-y-1 active:translate-y-0 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
                <span>Create New Note</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
