import React, { useState } from 'react';
import { ToolHeader, ToolLayout, ToolSection, ToolTextArea, CopyButton } from '@/components/tools/shared/tool-ui';
import { ShieldCheck, AlertCircle, Info, Lock, Unlock, Key } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export function JwtDebugger() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<any>(null);
  const [payload, setPayload] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const decodeJwt = (jwt: string) => {
    setToken(jwt);
    setError(null);
    setHeader(null);
    setPayload(null);

    if (!jwt.trim()) return;

    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) {
        throw new Error('A JWT must have 3 parts separated by dots');
      }

      const decodedHeader = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const decodedPayload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      setHeader(decodedHeader);
      setPayload(decodedPayload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decode token');
      console.error(err);
    }
  };

  const isExpired = () => {
    if (!payload?.exp) return null;
    const now = Math.floor(Date.now() / 1000);
    return now > payload.exp;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="JWT Debugger" 
        description="Decode, verify, and inspect JSON Web Tokens (JWT) locally in your browser." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-300px)] min-h-[600px]">
        {/* Input Section */}
        <ToolSection 
          title="Encoded Token" 
          titleId="jwt-input"
          className="flex flex-col h-full"
        >
          <div className="flex-1 flex flex-col gap-4">
            <ToolTextArea
              value={token}
              onChange={(e) => decodeJwt(e.target.value)}
              placeholder="Paste your JWT here (header.payload.signature)"
              className="flex-1 font-mono text-xs leading-relaxed"
            />
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {error}
                </div>
              </div>
            )}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                Tokens are decoded locally in your browser. They are never sent to any server.
              </div>
            </div>
          </div>
        </ToolSection>

        {/* Output Section */}
        <div className="flex flex-col gap-6 h-full overflow-hidden">
          {/* Header */}
          <ToolSection 
            title="Header" 
            titleId="jwt-header"
            className="flex-1 min-h-0"
            actions={header && <CopyButton text={JSON.stringify(header, null, 2)} />}
          >
            <div className="h-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-auto p-4 custom-scrollbar">
              {header ? (
                <pre className="text-xs font-mono text-pink-600 dark:text-pink-400">
                  {JSON.stringify(header, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-400 italic text-xs">
                  Awaiting valid token...
                </div>
              )}
            </div>
          </ToolSection>

          {/* Payload */}
          <ToolSection 
            title="Payload" 
            titleId="jwt-payload"
            className="flex-[2] min-h-0"
            actions={payload && <CopyButton text={JSON.stringify(payload, null, 2)} />}
          >
            <div className="h-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-auto p-4 custom-scrollbar relative">
              {payload ? (
                <>
                  <pre className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                    {JSON.stringify(payload, null, 2)}
                  </pre>
                  
                  {/* Status Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {payload.exp && (
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        isExpired() 
                          ? "bg-red-500/10 text-red-500 border-red-500/20" 
                          : "bg-green-500/10 text-green-500 border-green-500/20"
                      )}>
                        {isExpired() ? 'Expired' : 'Valid Time'}
                      </div>
                    )}
                    {payload.iat && (
                      <div className="px-3 py-1 bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Issued At
                      </div>
                    )}
                    {payload.aud && (
                      <div className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider max-w-[200px] truncate" title={Array.isArray(payload.aud) ? payload.aud.join(', ') : payload.aud}>
                        Aud: {Array.isArray(payload.aud) ? payload.aud.join(', ') : payload.aud}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-400 italic text-xs">
                  Awaiting valid token...
                </div>
              )}
            </div>
          </ToolSection>
        </div>
      </div>
    </div>
  );
}
