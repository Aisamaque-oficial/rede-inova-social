"use client";

import { useEffect, useRef } from "react";
import { dataService } from "@/lib/data-service";
import { supabaseActivity } from "@/lib/supabase-activity";
import { usePathname } from "next/navigation";

export function ActivityTracker() {
  const sessionStartTime = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const trackActivity = async () => {
      const session = dataService.obterSessaoAtual();
      if (!session || !session.logado) return;

      // Calculamos o tempo decorrido desde o início da sessão (neste carregamento de página)
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - sessionStartTime.current) / 1000);
      const elapsedMinutes = Math.max(1, Math.floor(elapsedSeconds / 60));

      console.log(`[ActivityTracker] Logging activity for ${session.nomeCompleto} (${elapsedMinutes} min)`);
      
      await supabaseActivity.logActivity({
        user_id: session.userId,
        user_name: session.nomeCompleto,
        user_sector: session.activeSector || session.department || "N/A",
        last_online: new Date().toISOString(),
        session_duration: elapsedMinutes
      });
    };

    // Delay inicial para garantir que a sessão foi carregada
    const timeout = setTimeout(() => {
      trackActivity();
      // Heartbeat a cada 2 minutos para maior precisão
      intervalRef.current = setInterval(trackActivity, 2 * 60 * 1000);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Tenta um log final de saída
      trackActivity();
    };
  }, [pathname]); // Re-track on path change to keep alive

  return null;
}
