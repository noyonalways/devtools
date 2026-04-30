import React, { useState, useEffect } from 'react';
import { ToolHeader, ActionButton, CopyButton, ToolSection } from '@/components/tools/shared/tool-ui';
import { RefreshCw, ShieldCheck } from 'lucide-react';

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });
  const [password, setPassword] = useState('');

  const generatePassword = () => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let characters = '';
    if (options.uppercase) characters += charset.uppercase;
    if (options.lowercase) characters += charset.lowercase;
    if (options.numbers) characters += charset.numbers;
    if (options.symbols) characters += charset.symbols;

    if (!characters) return;

    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const getStrength = () => {
    if (length < 8) return { label: 'Weak', color: 'text-red-500', bg: 'bg-red-500' };
    if (length < 12) return { label: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { label: 'Strong', color: 'text-green-500', bg: 'bg-green-500' };
  };

  const strength = getStrength();

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader 
        title="Password Generator" 
        description="Generate strong, secure passwords with custom requirements." 
      />

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 lg:p-8 space-y-8">
        <ToolSection 
          title="Generated Password"
          titleId="generated-password-title"
          actions={
            <div className="flex items-center gap-2">
              <span 
                className={`text-[10px] font-bold uppercase tracking-wider ${strength.color}`}
                aria-label={`Password strength: ${strength.label}`}
              >
                {strength.label}
              </span>
              <CopyButton text={password} />
            </div>
          }
        >
          <div className="space-y-4">
            <div className="relative group">
              <input
                type="text"
                readOnly
                value={password}
                aria-labelledby="generated-password-title"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-4 text-xl font-mono text-indigo-600 dark:text-indigo-400 focus:outline-none"
              />
              <button 
                onClick={generatePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="Regenerate"
                aria-label="Regenerate password"
              >
                <RefreshCw className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div 
              className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={length}
              aria-valuemin={4}
              aria-valuemax={32}
              aria-label="Password length visual indicator"
            >
              <div 
                className={`h-full transition-all duration-500 ${strength.bg}`} 
                style={{ width: `${(length / 32) * 100}%` }}
              />
            </div>
          </div>
        </ToolSection>

        <div className="space-y-6">
          <ToolSection title="Configuration" titleId="config-title">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span id="password-length-label" className="text-zinc-500 dark:text-zinc-400">Password Length</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{length}</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="32"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  aria-labelledby="password-length-label"
                  className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(options).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => setOptions(prev => ({ ...prev, [key]: !prev[key as keyof typeof options] }))}
                      className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-800 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-zinc-900"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300 capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>
          </ToolSection>
        </div>

        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex gap-3 items-start">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-500 dark:text-zinc-500 leading-relaxed">
            Passwords are generated locally in your browser. We never store or transmit your generated passwords.
          </p>
        </div>
      </div>
    </div>
  );
}
