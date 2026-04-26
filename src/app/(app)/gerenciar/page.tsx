"use client";

import { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Newspaper, 
  Users, 
  ClipboardList, 
  Edit3, 
  ChevronRight, 
  Activity, 
  Database, 
  Globe, 
  ShieldCheck, 
  Monitor, 
  BarChart3,
  Flame
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GerenciarSitePage() {
  const [stats, setStats] = useState({
    users: 0,
    news: 0,
    tasks: 0,
    pendingTasks: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const [u, n, t] = await Promise.all([
        dataService.getUsers(),
        dataService.getNews(),
        dataService.getTasks()
      ]);
      setStats({
        users: u.length,
        news: n.length,
        tasks: t.length,
        pendingTasks: t.filter(task => task.status !== 'concluida').length
      });
    };
    loadStats();
  }, []);

  const managementAreas = [
    {
      title: "Conteúdo Geral",
      subtitle: "CMS Principal",
      description: "Edite textos, títulos e seções da Landing Page e outras áreas do portal.",
      icon: Globe,
      href: "/gerenciar/cms",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      accent: "from-blue-500/20 to-transparent"
    },
    {
      title: "Equipe e Membros",
      subtitle: "Recursos Humanos",
      description: "Gerencie perfis, biografias e permissões de acesso da equipe do projeto.",
      icon: Users,
      href: "/gerenciar/usuarios",
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      accent: "from-purple-500/20 to-transparent"
    },
    {
      title: "Fluxo de Trabalho",
      subtitle: "Planejamento",
      description: "Distribua responsabilidades, defina prazos e acompanhe as entregas.",
      icon: ClipboardList,
      href: "/gerenciar/atribuicoes",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      accent: "from-amber-500/20 to-transparent"
    },
    {
      title: "Feed de Notícias",
      subtitle: "Comunicação",
      description: "Publique e gerencie as atualizações e notícias para toda a rede.",
      icon: Newspaper,
      href: "/gerenciar/noticias",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      accent: "from-emerald-500/20 to-transparent"
    },
  ];

  const quickStats = [
    { label: "Usuários Ativos", value: stats.users, icon: Users, color: "text-blue-600" },
    { label: "Notícias Publicadas", value: stats.news, icon: Newspaper, color: "text-emerald-600" },
    { label: "Pendências Totais", value: stats.pendingTasks, icon: Activity, color: "text-amber-600" },
    { label: "Atividades Logadas", value: stats.tasks, icon: Database, color: "text-slate-600" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Area - Design Fiel à Imagem */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 animate-reveal-up">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Console de Administração</span>
            </div>
            <h1 className="text-6xl font-black italic tracking-tighter text-slate-800 uppercase leading-[0.8] mb-1">
                Painel de <span className="text-primary italic">Controle</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 ml-1">
                Gerenciamento centralizado de dados, equipe e conteúdos
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-[#0F172A] px-8 py-5 rounded-[2.5rem] text-white shadow-2xl shadow-primary/10 border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <ShieldCheck className="h-6 w-6 text-emerald-400 relative z-10" />
              <div className="flex flex-col relative z-10">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] opacity-40">Status de Segurança</span>
                  <span className="text-[11px] font-black uppercase tracking-widest text-emerald-50">Acesso Restrito Coordenador</span>
              </div>
          </div>
      </div>

      {/* Quick Stats Grid - Estilo Premium com Badges de Carregamento */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-reveal-up" style={{ animationDelay: '0.1s' }}>
          {quickStats.map((stat, i) => (
              <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 rounded-[2.5rem] bg-white overflow-hidden group hover:ring-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/5">
                  <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                          <div className={cn("p-3.5 rounded-2xl bg-slate-50 group-hover:bg-primary/10 transition-all duration-500 group-hover:scale-110", stat.color)}>
                              <stat.icon className="h-6 w-6" />
                          </div>
                          <BarChart3 className="h-4 w-4 text-slate-50 group-hover:text-primary/30 transition-colors" />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-4xl font-black italic tracking-tighter text-slate-800 group-hover:text-primary transition-colors">{String(stat.value).padStart(2, '0')}</span>
                          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 mt-2">{stat.label}</span>
                      </div>
                  </CardContent>
              </Card>
          ))}
      </div>

      {/* Management Areas Grid - Cards Grandes como na Imagem */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-8 md:grid-cols-2"
      >
        {managementAreas.map((area) => (
          <motion.div key={area.title} variants={item}>
            <Link href={area.href} className="block group h-full">
              <Card className={`h-full border-none shadow-sm ring-1 ring-slate-100 rounded-[3.5rem] hover:ring-primary transition-all duration-700 overflow-hidden bg-white hover:-translate-y-3 relative group`}>
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 scale-95 group-hover:scale-100 transition-all duration-700", area.accent)} />
                
                <CardHeader className="flex flex-row items-center gap-8 p-12 pb-8 relative z-10">
                  <div className={cn("p-6 rounded-[2rem] shadow-2xl shadow-current/5 transition-all group-hover:scale-110 group-hover:-rotate-3 duration-700", area.bg)}>
                    <area.icon className={cn("h-12 w-12 transition-colors", area.color)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Monitor className="h-3.5 w-3.5 text-slate-300" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{area.subtitle}</span>
                    </div>
                    <CardTitle className="text-3xl font-black italic tracking-tighter uppercase text-slate-800 group-hover:text-primary transition-colors">{area.title}</CardTitle>
                  </div>
                  <div className="h-14 w-14 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/30">
                    <ChevronRight className="h-7 w-7 text-slate-300 group-hover:text-white transition-all group-hover:translate-x-1" />
                  </div>
                </CardHeader>
                <CardContent className="px-12 pb-12 relative z-10">
                  <CardDescription className="text-[11px] font-bold leading-relaxed text-slate-400 uppercase tracking-[0.18em]">
                      {area.description}
                  </CardDescription>
                  
                  <div className="mt-10 pt-8 border-t border-slate-50 flex items-center gap-3">
                       <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                       <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                       <div className="h-1.5 w-12 bg-slate-50 rounded-full overflow-hidden flex-1 max-w-[100px]">
                           <div className={cn("h-full w-0 group-hover:w-full transition-all duration-1000", area.bg)} />
                       </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer / System Status - Banner "EDIÇÃO ATIVA" */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-slate-50/50 backdrop-blur-sm rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between border border-white shadow-2xl shadow-slate-200/50 gap-8"
      >
          <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-[1.5rem] bg-white flex items-center justify-center border border-slate-100 shadow-xl relative group overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Edit3 className="h-7 w-7 text-primary relative z-10" />
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
              </div>
              <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase tracking-[0.15em] text-slate-800 flex items-center gap-2">
                    Edição Ativa <Flame className="h-4 w-4 text-orange-500 fill-orange-500 animate-pulse" />
                  </h4>
                  <p className="text-[11px] font-bold text-slate-400 tracking-[0.1em] uppercase leading-relaxed">Qualquer mudança afetará instantaneamente o portal público para toda a rede.</p>
              </div>
          </div>
          <div className="flex gap-4">
              <Button variant="outline" className="h-14 rounded-full text-[11px] font-black uppercase tracking-[0.2em] px-10 border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all hover:scale-105">
                  Exportar Logs
              </Button>
              <Button asChild className="h-14 rounded-full text-[11px] font-black uppercase tracking-[0.2em] px-10 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                  <Link href="/gerenciar/configuracoes">
                    Configurações Sistema
                  </Link>
              </Button>
          </div>
      </motion.div>
    </div>
  );
}
