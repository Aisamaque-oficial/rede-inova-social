
"use client";

import * as React from "react";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Loader } from "lucide-react";
import AppHeader from "@/components/app-header";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/logotransparente.png";
import { dataService } from "@/lib/data-service";

/**
 * 🏢 LAYOUT DO PAINEL ADMINISTRATIVO
 * Este layout centraliza a gestão institucional, sidebar e cabeçalho do painel.
 */
const DynamicSidebar = dynamic(() => import("@/components/dynamic-sidebar"), {
  ssr: false,
  loading: () => (
    <div className="w-72 bg-slate-950 flex items-center justify-center border-r border-white/5 h-screen">
      <Loader className="h-6 w-6 animate-spin text-primary opacity-20" />
    </div>
  )
});

export default function PainelLayout({ children }: { children: ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  React.useEffect(() => {
    const isBypass = dataService.isBypass();
    const isAuthenticatedLocally = dataService.isAuthenticatedLocally();
    
    // 🛡️ Proteção de Rota: Redireciona se não estiver logado
    if (!loading && !user && !isBypass && !isAuthenticatedLocally) {
      router.replace("/login");
    }

    const session = dataService.obterSessaoAtual();
    if (session && (session as any).requiresPasswordChange) {
       router.replace("/alterar-senha");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-primary">
        <div className="flex flex-col items-center gap-4">
            <Loader className="h-12 w-12 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Carregando Painel...</span>
        </div>
      </div>
    );
  }

  const isBypass = dataService.isBypass();
  const isAuthenticatedLocally = dataService.isAuthenticatedLocally();

  if (!user && !isBypass && !isAuthenticatedLocally) {
    return null; 
  }

  const role = dataService.getUserRole();

  return (
    <SidebarProvider>
      <DynamicSidebar />
      <SidebarInset className="bg-background relative">
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.03]">
          <Image src={logo} alt="" width={600} height={600} className="grayscale select-none" priority />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <AppHeader />
          {isBypass && (
            <div className="bg-amber-100 border-b border-amber-200 px-4 py-1.5 flex items-center justify-center gap-2 text-amber-800 text-[10px] font-black uppercase tracking-wider">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Modo Administrativo Ativo • {role}
            </div>
          )}
          <main className="flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
