import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { TOOLS } from '@/constants/tool-constants';
import { ToolHeader } from '@/components/tools/shared/tool-ui';
import { Search } from 'lucide-react';

export function Dashboard() {
  const [search, setSearch] = React.useState('');

  const filteredTools = TOOLS.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <ToolHeader 
          title="Developer Toolkit" 
          description="All your daily development utilities in one place. Fast, local, and secure." 
        />
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search tools..."
            aria-label="Search tools"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <li key={tool.id}>
              <Link to={`/tools/${tool.id}`} className="block h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  aria-label={`Open ${tool.name}: ${tool.description}`}
                  className="w-full h-full group flex flex-col items-start p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all text-left relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-colors" aria-hidden="true" />
                  
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors" aria-hidden="true">
                    <Icon className="w-5 h-5 text-zinc-500 dark:text-zinc-400 group-hover:text-white transition-colors" />
                  </div>
                  
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 leading-relaxed">
                    {tool.description}
                  </p>
                  
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-500 transition-colors" aria-hidden="true">
                    Open Tool
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </div>
                </motion.div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
