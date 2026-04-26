
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Home, 
  Users, 
  Activity,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Settings,
  Megaphone,
  Accessibility,
  BarChart3,
  Users2,
  Network,
  BookOpen,
  Terminal,
  LayoutGrid,
  LayoutDashboard,
  CalendarClock,
  PlusCircle,
  Compass,
  PieChart,
  UserCheck,
  Globe,
  Lock,
  Activity as ActivityIcon,
  Search,
  Send,
  ClipboardList,
  Sparkles,
  Construction,
  Layout,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sidebar, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarHeader 
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { dataService } from "@/lib/data-service";
import logo from "@/assets/logotransparente.png";

export default function DynamicSidebar() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [openSectors, setOpenSectors] = React.useState<string[]>(["ascom"]);
  const [dynamicSectors, setDynamicSectors] = React.useState<any[]>([]);
  
  // ESTADO CONSOLIDADO PARA ULTRA-RESILIÊNCIA
  const [userConfig, setUserConfig] = React.useState<{
    session: any | null;
    role: string | null;
    isCoordinator: boolean;
    canManageTeam: boolean;
    dept: string | null;
    userId: string | null;
    isLoaded: boolean;
  }>({
    session: null,
    role: null,
    isCoordinator: false,
    canManageTeam: false,
    dept: null,
    userId: null,
    isLoaded: false
  });

  const toggleSector = (sectorId: string) => {
    setOpenSectors(prev => 
      prev.includes(sectorId) 
        ? prev.filter(id => id !== sectorId) 
        : [...prev, sectorId]
    );
  };

  // Carregamento Único de Dados (Reduz estresse de processamento)
  React.useEffect(() => {
    const currentSession = dataService.obterSessaoAtual();
    const currentRole = dataService.getUserRole();
    const coordinatorFlag = dataService.isCoordinator();
    const manageFlag = dataService.canManageTeam();
    const userId = dataService.getCurrentUserId();
    
    setUserConfig({
      session: currentSession,
      role: currentRole,
      isCoordinator: coordinatorFlag,
      canManageTeam: manageFlag,
      dept: currentSession?.department || null,
      userId: userId,
      isLoaded: true
    });

    // Escutar atualizações de perfil (ex: novo avatar)
    const handleUpdate = () => {
      const updatedSession = dataService.obterSessaoAtual();
      if (updatedSession) {
        setUserConfig(prev => ({ ...prev, session: updatedSession }));
      }
    };
    window.addEventListener('user-profile-updated', handleUpdate);

    const unsubscribeSectors = dataService.subscribeToSectors((data) => {
      setDynamicSectors(data);
    });

    return () => {
      window.removeEventListener('user-profile-updated', handleUpdate);
      unsubscribeSectors();
    };
  }, []);

  const prioritizedSectors = React.useMemo(() => {
    if (!userConfig.isLoaded || dynamicSectors.length === 0) return [];
    
    const currentUserDept = userConfig.dept;
    // Agora aceita todos os setores dinâmicos
    return [...dynamicSectors].sort((a, b) => {
      if (a.sigla === currentUserDept) return -1;
      if (b.sigla === currentUserDept) return 1;
      return 0;
    });
  }, [userConfig.dept, userConfig.isLoaded, dynamicSectors]);

  const menuItems = React.useMemo(() => {
    if (!userConfig.isLoaded) return [];
    
    return [
      { label: "Meu Perfil Institucional", icon: UserCheck, href: "/perfil", roles: ["admin", "coordinator", "member_editor", "member", "viewer"] },
      { 
          label: (userConfig.isCoordinator || userConfig.role === 'admin')
              ? "Painel de Rotas" 
              : userConfig.dept 
                ? `Rota da ${dataService.getSectorSigla(userConfig.dept)}` 
                : "Rotas Setoriais",
          icon: Activity,
          href: "/rotas",
          roles: ["admin", "coordinator", "member_editor", "member"]
      },
      { label: "Minhas Tarefas (Atribuídas)", icon: ClipboardList, href: "/minhas-tarefas", roles: ["admin", "coordinator", "member"] },
      { label: "Minhas Demandas (Solicitadas)", icon: Send, href: "/atividades/minhas-demandas", roles: ["admin", "coordinator", "member"] }
    ];
  }, [userConfig.isCoordinator, userConfig.role, userConfig.dept, userConfig.isLoaded]);

  const filteredMenuItems = React.useMemo(() => {
    if (!userConfig.isLoaded) return [];
    
    return menuItems.filter(item => {
      const uRole = (userConfig.role || "").toString().toUpperCase();
      const itemRoles = (item.roles || []).map(r => r.toUpperCase());
      
      const hasPermission = itemRoles.includes(uRole) || 
                            uRole === "ADMIN" || 
                            uRole === "COORDENADOR" || 
                            userConfig.isCoordinator;
                            
      return hasPermission && String(item.label).toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [menuItems, userConfig.role, userConfig.isCoordinator, userConfig.isLoaded, searchQuery]);

  if (!userConfig.isLoaded) {
    return (
      <Sidebar className="bg-slate-950 border-r-0 shadow-2xl">
        <div className="flex h-full items-center justify-center opacity-20">
          <ActivityIcon className="h-8 w-8 animate-pulse text-primary" />
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="bg-slate-950 border-r-0 shadow-2xl">
      <SidebarHeader className="pt-10 pb-4 px-6 shrink-0 bg-slate-950/50 backdrop-blur-xl">
        <div className="flex flex-col gap-6">
          <Link 
            href="/perfil"
            className="flex items-center gap-4 bg-white/5 p-4 rounded-[1.5rem] border border-white/10 shadow-inner group hover:bg-white/10 transition-all duration-500"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/30 bg-slate-800 transition-transform group-hover:scale-105 z-10 shadow-2xl">
                {userConfig.session?.avatarUrl ? (
                  <img src={userConfig.session.avatarUrl} alt="Avatar" className="w-14 h-14 object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary font-black italic text-xl">
                    {userConfig.session?.nomeCompleto?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-lg border-2 border-slate-950 flex items-center justify-center shadow-lg z-20">
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white font-black text-sm truncate tracking-tight group-hover:text-primary transition-colors">
                {userConfig.session?.nomeCompleto || "Usuário"}
              </span>
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] opacity-80 italic flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                {userConfig.session?.cargo || userConfig.role || "Membro"}
              </span>
            </div>
          </Link>

          <div className="relative mx-1 group/search">
            <div className="absolute -inset-0.5 bg-primary/50 rounded-2xl blur opacity-0 group-focus-within/search:opacity-30 transition duration-500" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within/search:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="PESQUISAR NO SISTEMA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 bg-white/5 border border-white/5 rounded-2xl pl-11 pr-4 text-[10px] font-black text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all uppercase tracking-widest shadow-inner shadow-black/20"
              />
            </div>
          </div>
        </div>
      </SidebarHeader>

      <ScrollArea className="flex-1 px-4 py-2 bg-slate-950/20">
        <SidebarMenu className="gap-2 pt-6">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                  "h-auto min-h-[3rem] py-3 rounded-2xl transition-all group px-4",
                  "bg-primary/5 text-primary hover:bg-primary hover:text-white"
              )}
            >
              <Link href="/painel/dashboard" className="flex items-center gap-3">
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                <span className="font-black text-xs sm:text-sm uppercase tracking-[0.12em] leading-snug whitespace-normal">
                    Tela Inicial
                </span>
                <ChevronRight className="h-3 w-3 ml-auto shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                  "h-auto min-h-[3rem] py-3 rounded-2xl transition-all group px-4",
                  "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Link href="/gerenciar/configuracoes" className="flex items-center gap-3">
                <Settings className="h-4 w-4 shrink-0 group-hover:text-primary transition-colors" />
                <span className="font-black text-xs sm:text-sm uppercase tracking-[0.12em] leading-snug">
                    Configurações Sistema
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <div className="h-px bg-white/5 mx-4 my-2" />

          {filteredMenuItems.map((item, idx) => (
              <SidebarMenuItem key={idx}>
                <SidebarMenuButton
                  asChild
                  className="h-auto min-h-[3rem] py-3 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group px-4"
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 shrink-0 group-hover:text-primary transition-colors" />
                    <span className="font-black text-xs sm:text-sm uppercase tracking-[0.2em] leading-snug">
                        {item.label}
                    </span>
                    <ChevronRight className="h-3 w-3 ml-auto shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
          ))}

          <div className="mt-10 mb-4 px-4 flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-500 tracking-[0.2em]">Setores do Projeto</span>
            <ActivityIcon className="h-3 w-3 text-slate-600" />
          </div>

          {prioritizedSectors.map((sector) => {
            const iconMap: Record<string, any> = {
              'ShieldCheck': ShieldCheck,
              'Megaphone': Megaphone,
              'Accessibility': Accessibility,
              'BarChart3': BarChart3,
              'Users2': Users2,
              'Network': Network,
              'BookOpen': BookOpen,
              'Terminal': Terminal,
              'Activity': ActivityIcon
            };

            const Icon = iconMap[sector.icon] || ActivityIcon;
            const isOpen = openSectors.includes(sector.id);
            
            return (
              <div key={sector.id} className="space-y-1 mb-2 px-2">
                <button 
                  onClick={() => toggleSector(sector.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300",
                    isOpen
                      ? "bg-primary/20 border-primary/40 text-primary shadow-lg shadow-primary/10 backdrop-blur-md" 
                      : "bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isOpen ? "text-primary" : "text-slate-500")} />
                  <span className="text-[11px] font-black uppercase tracking-[0.15em] italic leading-tight text-left flex-1 whitespace-normal">
                    {sector.sigla === 'CGP' ? 'COORDENAÇÃO GERAL DO PROJETO' : sector.sigla}
                  </span>
                  <ChevronDown className={cn(
                    "h-3 w-3 ml-auto transition-transform duration-300 shrink-0",
                    isOpen ? "rotate-0 text-primary" : "-rotate-90 text-slate-600"
                  )} />
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="ml-6 pl-4 border-l-2 border-white/5 space-y-1.5 py-3 relative">
                        {/* Linha vertical decorativa */}
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/40 to-transparent" />
                        
                        {([
                          { 
                            label: "Painel de Controle", 
                            href: `/setores/${sector.id}/painel`, 
                            icon: LayoutGrid 
                          },
                          { 
                            label: `Fluxo ${sector.sigla}`, 
                            href: `/atividades/setor/${sector.id}`, 
                            icon: ActivityIcon 
                          },
                          { 
                            label: "Planejamento Mensal", 
                            href: `/planejamento?sector=${sector.sigla}`, 
                            icon: CalendarClock 
                          },
                          { 
                            label: "Indicadores de Impacto", 
                            href: `/atividades/objetivos/${sector.id}`, 
                            icon: Compass 
                          },
                        ] as any[]).map((sub, idx) => {
                          const subItems = [...[sub]];
                          
                          
                          // Mediação Libras removida temporariamente (Estúdio em standby)
                          if (false) {
                            subItems.push(
                              { label: "Mediação Libras (Site)", href: "/studio/acessibilidade", icon: LayoutDashboard }
                            );
                          }

                          return subItems.map((item, sIdx) => {
                            const isRestricted = ['plan', 'social', 'tech'].includes(sector.id);
                            const isAuthorizedId = ['1', '5'].includes(userConfig.userId || "");
                            const canAccessFull = isAuthorizedId || userConfig.dept?.toUpperCase() === 'CGP';
                            const needsLock = isRestricted && !canAccessFull;

                            return (
                              <SidebarMenuButton
                                key={`${sector.id}-${idx}-${sIdx}`}
                                asChild
                                className={cn(
                                  "h-auto min-h-[2.5rem] py-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all px-3",
                                  "group/sub relative"
                                )}
                              >
                                <Link href={item.href} className="flex items-center w-full">
                                  <div className="absolute -left-4 w-2 h-px bg-white/10 group-hover/sub:bg-primary/50 transition-colors" />
                                  <item.icon className="h-3 w-3 mr-2 opacity-50 shrink-0 group-hover/sub:text-primary transition-colors" />
                                  <span className="flex-1 text-[10px] font-bold uppercase tracking-widest leading-normal whitespace-normal">
                                      {item.label}
                                  </span>
                                  {needsLock && <Lock className="h-2.5 w-2.5 ml-auto text-amber-500/60" />}
                                </Link>
                              </SidebarMenuButton>
                            );
                          });
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {userConfig.isCoordinator && (
            <div className="mt-8 border-t border-white/5 pt-8 mb-20">
              <div className="mb-4 px-4">
                <span className="text-xs font-black uppercase text-slate-500 tracking-[0.2em]">Gestão Institucional</span>
              </div>
              {/* Estúdio Digital — Standby Técnico */}
              <StudioButton role={userConfig.role} />
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="h-auto min-h-[2.75rem] py-2.5 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group px-4"
                >
                  <Link href="/gerenciar/estrutura" className="flex items-center gap-3">
                    <Layout className="h-4 w-4 shrink-0 group-hover:text-primary transition-colors" />
                    <span className="font-black text-[13px] uppercase tracking-widest leading-snug whitespace-normal">Gestão de Estrutura</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="h-auto min-h-[2.75rem] py-2.5 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group px-4"
                >
                  <Link href="/gerenciar/usuarios" className="flex items-center gap-3">
                    <Users className="h-4 w-4 shrink-0 group-hover:text-primary transition-colors" />
                    <span className="font-black text-[13px] uppercase tracking-widest leading-snug whitespace-normal">Equipe e Membros</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="h-auto min-h-[2.75rem] py-2.5 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group px-4"
                >
                  <Link href="/atividades/coordenacao" className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span className="font-black text-[13px] uppercase tracking-widest leading-snug whitespace-normal">Coordenação Institucional</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="h-auto min-h-[2.75rem] py-2.5 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group px-4"
                >
                  <Link href="/atividades/coordenacao-executiva" className="flex items-center gap-3">
                    <UserCheck className="h-4 w-4 shrink-0" />
                    <span className="font-black text-[13px] uppercase tracking-widest leading-snug whitespace-normal">Coordenação Executiva</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="h-auto min-h-[2.75rem] py-2.5 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group px-4"
                >
                  <Link href="/atividades/extensao" className="flex items-center gap-3">
                    <Globe className="h-4 w-4 shrink-0 group-hover:text-primary transition-colors" />
                    <span className="font-black text-[13px] uppercase tracking-widest leading-snug whitespace-normal">Coordenação de Extensão</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="h-auto min-h-[2.75rem] py-2.5 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group px-4"
                >
                  <Link href="/atividades/planejamento" className="flex items-center gap-3">
                    <BarChart3 className="h-4 w-4 shrink-0" />
                    <span className="font-black text-[13px] uppercase tracking-widest leading-snug text-primary whitespace-normal">Núcleo Estratégico (PMA)</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </div>
          )}
        </SidebarMenu>
      </ScrollArea>

      <div className="p-6 border-t border-white/5 bg-slate-950/40">
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-3 text-[8px] font-black uppercase tracking-widest text-slate-400">
                  <span>Inova Health</span>
                  <span className="text-emerald-500 flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-emerald-500" />
                      Online
                  </span>
              </div>
              <div className="flex items-center gap-3">
                  <Image src={logo} alt="Logo" width={20} height={20} className="grayscale brightness-110 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-[0.2em] leading-tight">
                      REDE DE INOVAÇÃO SOCIAL <br /> Lab Lissa v1.1
                  </span>
              </div>
          </div>
      </div>
    </Sidebar>
  );
}

/** 🔒 Botão do Estúdio com Standby Técnico */
function StudioButton({ role }: { role: string | null }) {
  const [showModal, setShowModal] = React.useState(false);
  const isAdminMaster = role === 'ADMIN_MASTER';

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          className={cn(
            "h-auto min-h-[3.2rem] py-3 rounded-2xl transition-all group px-5 mb-4 border-none cursor-pointer",
            isAdminMaster
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
              : "bg-slate-700/50 text-slate-400 hover:bg-slate-700/70"
          )}
          onClick={() => {
            if (!isAdminMaster) {
              setShowModal(true);
            }
          }}
          asChild={isAdminMaster}
        >
          {isAdminMaster ? (
            <Link href="/studio" className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-[14px] uppercase tracking-tighter leading-none">Estúdio Digital</span>
                <span className="text-[9px] font-bold opacity-80 uppercase tracking-widest mt-0.5">Live Mirror Control</span>
              </div>
              <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
            </Link>
          ) : (
            <div className="flex items-center gap-4 w-full">
              <div className="p-2 bg-white/10 rounded-lg">
                <Construction className="h-5 w-5 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-[14px] uppercase tracking-tighter leading-none">Estúdio Digital</span>
                <span className="text-[9px] font-bold opacity-60 uppercase tracking-widest mt-0.5">Em breve</span>
              </div>
              <Lock className="h-3.5 w-3.5 ml-auto text-slate-500" />
            </div>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* Modal Informativo */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-sm mx-4 shadow-2xl text-center space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 mx-auto bg-orange-50 rounded-2xl flex items-center justify-center">
                <Construction className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Área não disponível</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Estamos desenvolvendo uma nova experiência de edição visual para o portal Rede Inova Social.
                Em breve, esta plataforma estará disponível para a equipe editorial.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
              >
                Entendi
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

