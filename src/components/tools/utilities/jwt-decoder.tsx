import React, { useState, useEffect } from 'react';
import { ToolHeader, ToolSection, ToolTextArea, CopyButton } from '@/components/tools/shared/tool-ui';
import { Shield, Key, FileJson, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface JWTParts {
  header: any;
  payload: any;
  signature: string;
}

export function JwtDecoder() {
  const [token, setToken] = useState('');
  const [parts, setParts] = useState<JWTParts | null>(null);
  const [error, setError] = useState<string | null>(null);

  const decodeJwt = (jwt: string) => {
    setToken(jwt);
    if (!jwt.trim()) {
      setParts(null);
      setError(null);
      return;
    }

    try {
      const segments = jwt.split('.');
      if (segments.length !== 3) {
        throw new Error('JWT must have 3 parts separated by dots');
      }

      const decode = (str: string) => {
        try {
          // Replace non-url-safe characters and handle padding
          const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
          const json = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          return JSON.parse(json);
        } catch (e) {
          throw new Error('Failed to decode part');
        }
      };

      setParts({
        header: decode(segments[0]),
        payload: decode(segments[1]),
        signature: segments[2]
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JWT');
      setParts(null);
    }
  };

  const formatJson = (obj: any) => JSON.stringify(obj, null, 2);

  return (
    <div className="max-w-7xl mx-auto">
      <ToolHeader 
        title="JWT Decoder" 
        description="Decode JSON Web Tokens and inspect their header, payload, and signature locally." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input */}
        <ToolSection title="Encoded Token" titleId="jwt-input">
           <div className="h-full flex flex-col gap-4">
              <textarea
                value={token}
                onChange={(e) => decodeJwt(e.target.value)}
                placeholder="Paste your JWT here..."
                className="w-full h-[300px] p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none break-all"
              />
              {error ? (
                 <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                      {error}
                    </div>
                 </div>
              ) : parts && (
                 <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-500 shrink-0" />
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Token parsed successfully
                    </div>
                 </div>
              )}

              <div className="mt-auto p-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                 <div className="flex items-center gap-2 text-zinc-500 mb-2">
                    <Info className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Security Warning</span>
                 </div>
                 <p className="text-xs text-zinc-400 leading-relaxed">
                    Decoding happens entirely in your browser. Tokens never leave your machine. However, never paste sensitive production secrets or keys into online tools.
                 </p>
              </div>
           </div>
        </ToolSection>

        {/* Decoder Output */}
        <div className="space-y-6">
           <ToolSection title="Header" titleId="jwt-header" actions={parts && <CopyButton text={formatJson(parts.header)} />}>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                 <pre className="text-[11px] font-mono text-purple-600 dark:text-purple-400 whitespace-pre-wrap">
                    {parts ? formatJson(parts.header) : '{ "type": "JWT", "alg": "HS256" }'}
                 </pre>
              </div>
           </ToolSection>

           <ToolSection title="Payload" titleId="jwt-payload" actions={parts && <CopyButton text={formatJson(parts.payload)} />}>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl min-h-[150px]">
                 <pre className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 whitespace-pre-wrap">
                    {parts ? formatJson(parts.payload) : '{ "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }'}
                 </pre>
              </div>
           </ToolSection>

           <ToolSection title="Signature" titleId="jwt-sig">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                 <pre className="text-[11px] font-mono text-pink-600 dark:text-pink-400 break-all">
                    {parts ? parts.signature : 'HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)'}
                 </pre>
              </div>
           </ToolSection>
        </div>
      </div>
    </div>
  );
}
