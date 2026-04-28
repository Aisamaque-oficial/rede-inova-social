"use client";

import React, { useEffect } from "react";
import { CMSPageRenderer } from "@/components/cms/CMSPageRenderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";
import { dataService } from "@/lib/data-service";
import { supabaseActivity } from "@/lib/supabase-activity";

interface ArenaSetorProps {
  isStudio: boolean;
}

export default function ArenaSetor({ isStudio }: ArenaSetorProps) {
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

  return (
    <div className="animate-in zoom-in-90 duration-1000">
      <Card className="bg-[#0a0a0a] text-white min-h-[600px] rounded-[5rem] flex items-center justify-center text-center overflow-hidden relative shadow-3xl">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#111_25%,transparent_25%),linear-gradient(-45deg,#111_25%,transparent_25%)] bg-[length:40px_40px] opacity-20" />
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-primary via-blue-600 to-green-500 blur-[2px]" />
        <CardContent className="space-y-10 relative z-10 px-8">
          <div className="relative inline-block">
            <Gamepad2 className="h-32 w-32 mx-auto text-primary animate-bounce duration-[3s]" />
            <div className="absolute -inset-8 bg-primary/30 blur-[60px] rounded-full" />
          </div>
          <CMSPageRenderer 
            pageId="lab_jogos"
            isStudio={isStudio}
            defaultBlocks={[
              { id: "lab_jogos_title", type: 'header', content: "Gaming Area" },
              { id: "lab_jogos_desc", type: 'text', content: "Prepare-se para desafios épicos no mundo da nutrição. O jogo está prestes a começar." }
            ]}
            className="text-center"
          />
          <Button className="bg-primary text-white hover:bg-white hover:text-black rounded-full font-black px-16 py-10 text-2xl shadow-[0_20px_50px_rgba(44,210,193,0.4)] transition-all uppercase tracking-tighter">
            Entrar no Ranking
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
