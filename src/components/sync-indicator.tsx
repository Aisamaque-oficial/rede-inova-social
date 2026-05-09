"use client";

import React, { useEffect, useState } from "react";
import { Cloud, CloudOff, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

/**
 * 🟢 SYNC INDICATOR
 * Displays the current synchronization state with Supabase.
 */
export function SyncIndicator() {
  const [status, setStatus] = useState<'online' | 'offline' | 'syncing'>('syncing');

  useEffect(() => {
    if (!supabase) {
      setStatus('offline');
      return;
    }

    // Initial check
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('atribuicoes').select('id').limit(1);
        if (error) throw error;
        setStatus('online');
      } catch (e) {
        setStatus('offline');
      }
    };

    checkConnection();

    // Listen for visibility changes to re-check
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setStatus('syncing');
        checkConnection();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm transition-all duration-500">
      {status === 'online' ? (
        <Cloud className="h-3.5 w-3.5 text-emerald-500 fill-emerald-50" />
      ) : status === 'syncing' ? (
        <RefreshCw className="h-3.5 w-3.5 text-amber-500 animate-spin" />
      ) : (
        <CloudOff className="h-3.5 w-3.5 text-rose-500" />
      )}
      
      <div className="flex flex-col">
        <span className={cn(
          "text-[8px] font-black uppercase tracking-widest leading-none",
          status === 'online' ? "text-emerald-600" : status === 'syncing' ? "text-amber-600" : "text-rose-600"
        )}>
          {status === 'online' ? 'Sincronizado' : status === 'syncing' ? 'Sincronizando...' : 'Desconectado'}
        </span>
      </div>

      {status === 'online' && (
        <span className="relative flex h-1.5 w-1.5 ml-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
      )}
    </div>
  );
}
