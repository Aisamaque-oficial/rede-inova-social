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

      // Mapeamento de rotas para descrições amigáveis
      let lastAction = "Navegando no Sistema";
      if (pathname.includes('/atividades/setor/')) lastAction = "Gerindo Setor";
      else if (pathname.includes('/perfil')) lastAction = "Editando Perfil";
      else if (pathname.includes('/inicio')) lastAction = "No Início";
      else if (pathname.includes('/painel')) lastAction = "No Painel Adm";
      else if (pathname.includes('/studio')) lastAction = "No Estúdio de Criação";
      else if (pathname === '/') lastAction = "Página Inicial Pública";

      console.log(`[ActivityTracker] Logging activity for ${session.nomeCompleto} (${elapsedMinutes} min) - ${lastAction}`);
      
      await supabaseActivity.logActivity({
        user_id: session.userId,
        user_name: session.nomeCompleto,
        user_sector: session.activeSector || session.department || "N/A",
        last_online: new Date().toISOString(),
        session_duration: elapsedMinutes,
        last_action: lastAction
      });
    };

    // Delay inicial mínimo para garantir que a sessão foi carregada
    const timeout = setTimeout(() => {
      trackActivity();
      // Heartbeat a cada 45 segundos para maior precisão sem sobrecarga
      intervalRef.current = setInterval(trackActivity, 45 * 1000);
    }, 1000);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Tenta um log final de saída
      trackActivity();
    };
  }, [pathname]); // Re-track on path change to keep alive

  return null;
}
