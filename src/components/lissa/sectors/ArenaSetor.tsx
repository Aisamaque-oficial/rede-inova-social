"use client";

import React, { useState, useEffect } from "react";
import { CMSPageRenderer } from "@/components/cms/CMSPageRenderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2, Sparkles, Trophy, Play, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { dataService } from "@/lib/data-service";
import { supabaseActivity } from "@/lib/supabase-activity";

import { SementesGame } from "@/components/lissa/game/SementesGame";

interface ArenaSetorProps {
  isStudio: boolean;
}

export default function ArenaSetor({ isStudio }: ArenaSetorProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  useEffect(() => {
    const user = dataService.getCurrentUser();
    if (user) {
      supabaseActivity.logActivity({
        user_id: user.id,
        user_name: user.name,
        user_sector: user.activeSector || 'LISSA',
        sector_name: 'Arena de Desafios',
        last_online: new Date().toISOString(),
        session_duration: 0
      });
    }
  }, []);

  const games = [
    {
      id: "sementes",
      title: "Sementes de Liberdade",
      description: "Uma jornada épica de soberania alimentar e Libras.",
      icon: <Sparkles className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-600",
      status: "playable"
    },
    {
      id: "prato",
      title: "Prato Saudável",
      description: "Monte seu prato e aprenda sobre nutrição real.",
      icon: <Gamepad2 className="w-8 h-8" />,
      color: "from-orange-500 to-red-600",
      status: "coming_soon"
    },
    {
      id: "quiz",
      title: "Quiz do Impacto",
      description: "Teste seus conhecimentos sobre o território.",
      icon: <Trophy className="w-8 h-8" />,
      color: "from-blue-500 to-indigo-600",
      status: "coming_soon"
    }
  ];

  if (activeGame === "sementes") {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500">
        <SementesGame onClose={() => setActiveGame(null)} />
      </div>
    );
  }

  return (
    <div className="animate-in zoom-in-90 duration-1000 space-y-12">
      <div className="text-center space-y-4">
        <CMSPageRenderer 
          pageId="lab_jogos"
          isStudio={isStudio}
          defaultBlocks={[
            { id: "lab_jogos_title", type: 'header', content: "Arena de Desafios" },
            { id: "lab_jogos_desc", type: 'text', content: "Escolha seu desafio e transforme o mundo através da inovação social." }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {games.map((game, idx) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={cn(
              "group relative h-[400px] rounded-[3.5rem] overflow-hidden border-none shadow-2xl transition-all duration-500",
              game.status === 'playable' ? "cursor-pointer hover:-translate-y-2 hover:shadow-primary/20" : "opacity-60 grayscale-[0.5]"
            )} onClick={() => game.status === 'playable' && setActiveGame(game.id)}>
              {/* Background Gradient */}
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80 transition-opacity group-hover:opacity-100", game.color)} />
              
              {/* Decorative Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-30" />

              <CardContent className="relative h-full p-10 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <div className="p-4 rounded-3xl bg-white/20 backdrop-blur-md shadow-inner">
                    {game.icon}
                  </div>
                  {game.status === 'coming_soon' && (
                    <Badge className="bg-black/40 text-white border-none text-[8px] font-black uppercase tracking-widest px-3 py-1.5">
                      <Lock className="w-3 h-3 mr-1" /> Em breve
                    </Badge>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
                    {game.title}
                  </h3>
                  <p className="text-xs font-medium text-white/80 leading-relaxed">
                    {game.description}
                  </p>
                  
                  {game.status === 'playable' ? (
                    <div className="pt-4">
                      <Button className="w-full rounded-full bg-white text-black hover:bg-slate-100 font-black uppercase text-[10px] tracking-widest h-12 shadow-xl group-hover:scale-105 transition-transform">
                        <Play className="w-4 h-4 mr-2 fill-current" /> Começar Agora
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-4">
                      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-white/40"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <div className="px-8 py-4 bg-slate-50 rounded-full border border-slate-100 flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-lg font-black text-slate-800">1</span>
            <span className="text-[8px] font-black text-slate-400 uppercase">Ativos</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex flex-col items-center">
            <span className="text-lg font-black text-slate-400">0</span>
            <span className="text-[8px] font-black text-slate-400 uppercase">Conquistas</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex flex-col items-center">
            <span className="text-lg font-black text-slate-400">--</span>
            <span className="text-[8px] font-black text-slate-400 uppercase">Ranking</span>
          </div>
        </div>
      </div>
    </div>
  );
}
