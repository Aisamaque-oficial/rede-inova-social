"use client";

import React from "react";
import { User, ShieldCheck, PenTool, Camera, ArrowRight, Instagram, Globe, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AscomTeamSection() {
  const members = [
    {
      name: "Amanda Milly",
      role: "Coordenação Geral da ASCOM",
      tag: "Gestão",
      icon: ShieldCheck,
      color: "bg-emerald-50 text-emerald-600",
      description: "Gerir fluxos de comunicação, articular com setores e garantir que nada fique parado.",
      focus: ["Estratégia", "Liderança", "Prioridades"],
      socials: { site: true, intern: true }
    },
    {
      name: "Thaíssa Carvalho",
      role: "Conteúdo e Comunicação Institucional",
      tag: "A Voz do Projeto",
      icon: PenTool,
      color: "bg-indigo-50 text-indigo-600",
      description: "Responsável pela voz escrita: textos de redes sociais, matérias para o site e padronização de linguagem.",
      focus: ["Redação", "Site", "Institucional"],
      socials: { instagram: true, site: true }
    },
    {
      name: "Sara Freire",
      role: "Produção de Conteúdo e Campo",
      tag: "O Elo com a Realidade",
      icon: Camera,
      color: "bg-orange-50 text-orange-600",
      description: "Registro de fotos/vídeos e coleta de informações nos territórios e municípios.",
      focus: ["Audiovisual", "Campo", "Realidade"],
      socials: { instagram: true, campo: true }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-headline uppercase italic tracking-tighter text-slate-800">Equipe de Comunicação</h2>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Nova Estrutura Funcional e Estratégica</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {members.map((member) => {
          const isLeader = member.name === "Amanda Milly";
          return (
            <Card 
              key={member.name} 
              className={cn(
                "group border-none shadow-sm hover:shadow-2xl transition-all duration-700 rounded-[2.5rem] bg-white ring-1 overflow-hidden relative",
                isLeader ? "ring-primary/40 shadow-xl shadow-primary/5 scale-105 z-10" : "ring-slate-100"
              )}
            >
              {isLeader && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-bl-3xl z-20 shadow-lg italic">
                  Liderança Setorial
                </div>
              )}
              <CardContent className="p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-start">
                    <div className={cn(
                        "p-4 rounded-2xl", 
                        isLeader ? "bg-primary text-white shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500" : member.color
                    )}>
                      {isLeader ? <ShieldCheck size={24} className="animate-pulse" /> : <member.icon size={24} />}
                    </div>
                    {!isLeader && (
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        {member.tag}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-black text-xl text-slate-800 leading-tight uppercase italic flex items-center gap-2">
                        {member.name}
                        {isLeader && <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />}
                    </h3>
                    <p className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        isLeader ? "text-primary italic" : "text-slate-400"
                    )}>
                        {member.role}
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                    "{member.description}"
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {member.focus.map(f => (
                      <div key={f} className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-bold uppercase tracking-wider",
                          isLeader ? "bg-primary/5 border-primary/10 text-primary" : "bg-slate-50 border-slate-100 text-slate-600"
                      )}>
                         <div className={cn("h-1 w-1 rounded-full", isLeader ? "bg-primary" : "bg-slate-400")} />
                         {f}
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-50 mt-4">
                     <div className="flex items-center gap-4 opacity-40">
                        {member.socials.instagram && <Instagram size={14} />}
                        {member.socials.site && <Globe size={14} />}
                        {member.socials.intern && <MessageSquare size={14} />}
                     </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
