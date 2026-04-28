"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CMSPageRenderer } from "@/components/cms/CMSPageRenderer";
import { ImageEditor } from "@/components/image-editor";
import { Info, Play, Sparkles } from "lucide-react";
import { dataService } from "@/lib/data-service";
import { supabaseActivity } from "@/lib/supabase-activity";

interface CozinhaSetorProps {
  isStudio: boolean;
  canEditContent: boolean;
}

export default function CozinhaSetor({ isStudio, canEditContent }: CozinhaSetorProps) {
  useEffect(() => {
    const user = dataService.getCurrentUser();
    if (user) {
      supabaseActivity.logActivity({
        user_id: user.id,
        user_name: user.name,
        user_sector: user.activeSector || 'LISSA',
        sector_name: 'Cozinha Nutricional',
        last_online: new Date().toISOString(),
        session_duration: 0
      });
    }
  }, []);

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 text-center md:text-left">
          <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-4 py-2">
            Infanto-Juvenil
          </Badge>
          <CMSPageRenderer 
            pageId="lab_cozinha"
            isStudio={isStudio}
            defaultBlocks={[
              { id: "lab_nutri_title", type: 'header', content: "Crescendo com Saúde" },
              { id: "lab_nutri_desc", type: 'text', content: 'Para adolescentes e crianças, o laboratório oferece uma dinâmica de imersão para aproximar o conceito de "comida de verdade".' }
            ]}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-primary/5 hover:translate-y-[-5px] transition-transform">
              <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
                <Info className="h-5 w-5" />
              </div>
              <h4 className="font-black text-sm text-primary uppercase mb-2">Curiosidade</h4>
              <p className="text-xs font-medium text-muted-foreground">Você sabia que alimentos roxos ajudam na memória para estudar?</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-primary/5 hover:translate-y-[-5px] transition-transform">
              <div className="h-10 w-10 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 text-orange-500">
                <Play className="h-5 w-5" />
              </div>
              <h4 className="font-black text-sm text-orange-500 uppercase mb-2">Mini-Aula</h4>
              <p className="text-xs font-medium text-muted-foreground">O caminho do alimento da terra ao prato.</p>
            </div>
          </div>
        </div>
        <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl">
          <ImageEditor 
            pageId="lab_cozinha_image"
            defaultSrc="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop" 
            alt="Alimentação Saudável" 
            fill 
            className="object-cover"
            isStudio={isStudio}
            canEdit={canEditContent}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <Button className="absolute bottom-8 left-8 rounded-full bg-white text-primary hover:bg-white/90 font-black px-8 py-6 text-sm uppercase tracking-tighter shadow-2xl group">
            <Sparkles className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" /> Iniciar Experiência
          </Button>
        </div>
      </div>
    </div>
  );
}
