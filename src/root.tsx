import { useEffect, useState } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
  useNavigate,
} from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'react-hot-toast';
import { Menu, X, Sun, Moon, ChevronRight } from 'lucide-react';
import type { Route } from './+types/root';
import { Sidebar } from '@/components/layout/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { TOOLS } from '@/constants/tool-constants';

import '@/index.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>DevTools</title>
        <meta
          name="description"
          content="DevTools is a centralized hub of essential developer utilities including formatters, encoders, and generators."
        />
        <meta name="author" content="Noyon Rahman" />
        <meta name="author" content="https://noyonrahman.com/" />
        <meta
          name="keywords"
          content="devtools, developer tools, formatters, encoders, generators, utilities, JSON, SQL, base64, converter, AI, productivity"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="DevTools" />
        <meta
          property="og:description"
          content="A centralized hub of essential developer utilities including formatters, encoders, and generators."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devtools.noyonrahman.com" />
        <meta
          property="og:image"
          content="https://og-image.vercel.app/DevTools.png?theme=dark&md=1&fontSize=100px"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DevTools" />
        <meta
          name="twitter:description"
          content="A centralized hub of essential developer utilities including formatters, encoders, and generators."
        />
        <meta
          name="twitter:image"
          content="https://og-image.vercel.app/DevTools.png?theme=dark&md=1&fontSize=100px"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="me" href="https://noyonrahman.com/" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devnexus_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('devnexus_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const toggleSidebarCollapse = () => setIsSidebarCollapsed((prev) => !prev);

  const pathParts = location.pathname.split('/');
  const activeToolId = pathParts[1] === 'tools' ? pathParts[2] : 'dashboard';
  const activeTool = TOOLS.find((t) => t.id === activeToolId);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <TooltipProvider>
      <div
        className={cn(
          'flex h-screen font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors duration-300',
          theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900',
        )}
      >
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: theme === 'dark' ? '#18181b' : '#ffffff',
              color: theme === 'dark' ? '#f4f4f5' : '#18181b',
              border: `1px solid ${theme === 'dark' ? '#27272a' : '#e4e4e7'}`,
              fontSize: '14px',
            },
          }}
        />
        <SonnerToaster theme={theme} />

        <div
          className={cn(
            'lg:hidden fixed top-0 left-0 right-0 h-16 border-b flex items-center justify-between px-6 z-[120] transition-colors',
            theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200',
          )}
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            className={cn(
              'text-xl font-bold tracking-tight',
              theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900',
            )}
          >
            DevNexus
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className="relative z-[120] hidden lg:block">
          <Sidebar
            activeToolId={activeToolId}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        </div>

        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[118]"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="lg:hidden fixed inset-y-0 left-0 w-72 z-[120]"
              >
                <Sidebar
                  activeToolId={activeToolId}
                  isCollapsed={false}
                  onToggleCollapse={() => {}}
                  theme={theme}
                  onToggleTheme={toggleTheme}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col min-w-0">
          <header
            className={cn(
              'hidden lg:flex items-center justify-between px-8 h-16 border-b transition-colors sticky top-0 z-[110] bg-opacity-80 backdrop-blur-md',
              theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200',
            )}
          >
            <div className="flex items-center gap-2 text-sm">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                DevNexus
              </button>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {activeTool ? activeTool.name : 'Dashboard'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all shadow-sm group"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                <div className="relative w-5 h-5 flex items-center justify-center">
                  {theme === 'light' ? (
                    <Moon className="w-5 h-5 text-indigo-600 group-hover:-rotate-12 transition-transform" />
                  ) : (
                    <Sun className="w-5 h-5 text-amber-500 group-hover:rotate-45 transition-transform" />
                  )}
                </div>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto pt-24 lg:pt-0">
            <div className="p-6 lg:p-12 min-h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui' }}>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre style={{ overflow: 'auto', marginTop: '1rem' }}>
          <code>{stack}</code>
        </pre>
      )}
    </div>
  );
}
