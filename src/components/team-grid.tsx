"use client";

import React, { useState, useEffect } from "react";
import { teamMembers, User } from "@/lib/mock-data";
import { dataService } from "@/lib/data-service";
import { TeamMemberCard } from "./team-member-card";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Settings, 
  Search, 
  FlaskConical, 
  MessageSquare, 
  Boxes,
  LayoutGrid,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NUCLEOS = [
  { id: 'all', label: 'Todos', icon: LayoutGrid, color: 'text-primary' },
  { id: 'executivo', label: 'Coordenação Executiva', icon: Settings, color: 'text-amber-500' },
  { id: 'suporte', label: 'Suporte & Articulação', icon: Boxes, color: 'text-purple-500' },
  { id: 'acessibilidade', label: 'Acessibilidade & Inclusão', icon: FlaskConical, color: 'text-emerald-500' },
  { id: 'movimentos', label: 'Movimentos Sociais', icon: Users, color: 'text-rose-500' }
];

export function TeamGrid() {
  const [activeNucleo, setActiveNucleo] = useState('all');
  const [members, setMembers] = useState<User[]>([]);

  // Carregamento dinâmico para refletir alterações administrativas instantaneamente
  useEffect(() => {
    const carregarMembros = async () => {
      const data = await dataService.listarMembrosEquipe();
      setMembers(data);
    };
    carregarMembros();
  }, []);

  // Categorização Dinâmica baseada nas funções e nomes no mock-data
  const getMemberCategories = (member: User) => {
    const role = member.role.toLowerCase();
    const name = member.name.toLowerCase();
    const categories: string[] = [];

    // Executivo
    if (role.includes('coordenador geral') || 
        role.includes('técnico-científica') || 
        role.includes('criatividade') || 
        role.includes('popularização') || 
        role.includes('inovação') || 
        role.includes('marketing')) {
      categories.push('executivo');
    }

    // Suporte & Articulação
    if (role.includes('suporte técnico') || 
        role.includes('suporte no planejamento') || 
        role.includes('articulação dos movimentos')) {
      categories.push('suporte');
    }

    // Acessibilidade & Inclusão
    // Note: User explicitly listed members for this nucleus
    const accessibilityMembers = ['beide', 'thaís', 'ilana', 'bruna', 'sara', 'aisamaque', 'shirlene', 'behatryz'];
    if (role.includes('núcleo de acessibilidade') || 
        role.includes('inclusão') || 
        accessibilityMembers.some(m => name.includes(m))) {
      categories.push('acessibilidade');
    }

    // Movimentos Sociais
    if (role.includes('movimento de mulheres') || 
        role.includes('coletivo afro') || 
        role.includes('papo das pretas')) {
      categories.push('movimentos');
    }

    return categories;
  };

  const filteredMembers = members.filter(member => {
    if (activeNucleo === 'all') return true;
    const categories = getMemberCategories(member);
    return categories.includes(activeNucleo);
  });

  return (
    <div className="space-y-12">
      {/* Filtering Navigation */}
      <div className="flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-slate-50/50 backdrop-blur-md rounded-[2.5rem] ring-1 ring-slate-100 shadow-sm max-w-fit">
          {NUCLEOS.map((nucleo) => {
            const Icon = nucleo.icon;
            const isActive = activeNucleo === nucleo.id;
            
            return (
              <Button
                key={nucleo.id}
                variant="ghost"
                size="sm"
                onClick={() => setActiveNucleo(nucleo.id)}
                className={cn(
                  "rounded-full h-10 px-6 font-black uppercase text-[10px] tracking-widest transition-all duration-500",
                  isActive 
                    ? "bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] text-slate-800 ring-1 ring-slate-100" 
                    : "text-slate-400 hover:text-primary"
                )}
              >
                <Icon size={14} className={cn("mr-2", isActive ? nucleo.color : "opacity-40")} />
                {nucleo.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative">
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={activeNucleo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4"
          >
            {filteredMembers.map((member, i) => (
              <TeamMemberCard 
                key={member.id} 
                member={member} 
                index={i} 
              />
            ))}
          </motion.div>
        </AnimatePresence>
        
        {filteredMembers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
             <Boxes className="h-12 w-12 mb-4 text-primary" />
             <p className="font-headline uppercase italic font-black text-xl">Nenhum membro encontrado neste núcleo</p>
          </div>
        )}
      </div>

      {/* Stats Summary (Subtle) */}
      <div className="flex justify-center pt-8">
         <div className="px-6 py-3 rounded-full bg-slate-50 border border-slate-100 flex items-center gap-8 shadow-inner">
            <div className="flex flex-col items-center">
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Total de Membros</span>
               <span className="text-xl font-black italic text-primary">{members.length}</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex flex-col items-center">
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Pós-Graduados</span>
               <span className="text-xl font-black italic text-emerald-600">85%</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
             <div className="flex flex-col items-center">
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Eixos Temáticos</span>
               <span className="text-xl font-black italic text-amber-500">4</span>
            </div>
         </div>
      </div>
    </div>
  );
}
