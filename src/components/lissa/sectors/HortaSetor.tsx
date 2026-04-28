"use client";

import React, { useEffect } from "react";
import { CMSPageRenderer } from "@/components/cms/CMSPageRenderer";
import { Sprout } from "lucide-react";
import { dataService } from "@/lib/data-service";
import { supabaseActivity } from "@/lib/supabase-activity";

interface HortaSetorProps {
  isStudio: boolean;
}

export default function HortaSetor({ isStudio }: HortaSetorProps) {
  useEffect(() => {
    const user = dataService.getCurrentUser();
    if (user) {
      supabaseActivity.logActivity({
        user_id: user.id,
        user_name: user.name,
        user_sector: user.activeSector || 'LISSA',
        sector_name: 'Horta Comunitária',
        last_online: new Date().toISOString(),
        session_duration: 0
      });
    }
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-top-12 duration-1000 bg-[#f9faf5] rounded-[5rem] p-12 md:p-24 shadow-inner ring-1 ring-black/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-5">
        <Sprout className="h-64 w-64 text-green-800" />
      </div>
      <div className="flex flex-col md:flex-row gap-16 items-center relative z-10">
        <div className="md:w-1/3">
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl text-center border-t-[12px] border-green-600">
            <Sprout className="h-28 w-28 text-green-600 mx-auto mb-8" />
            <CMSPageRenderer 
              pageId="lab_horta_badge"
              isStudio={isStudio}
              defaultBlocks={[
                { id: "lab_horta_badge_title", type: 'text', content: "Horta" },
                { id: "lab_horta_badge_subtitle", type: 'text', content: "Produção Local" }
              ]}
              className="flex flex-col items-center gap-1"
            />
          </div>
        </div>
        <div className="md:w-2/3 space-y-10 text-center md:text-left">
          <CMSPageRenderer 
            pageId="lab_horta_main"
            isStudio={isStudio}
            defaultBlocks={[
              { id: "lab_horta_title", type: 'header', content: "Nossa Terra, Nossa Gente" },
              { id: "lab_horta_desc", type: 'text', content: "A agricultura familiar produz vida. No LISSA, valorizamos quem planta com consciência e colhe com amor." }
            ]}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8">
            {[
              { val: "70%", label: "Produção", color: "text-primary" },
              { val: "Puro", label: "Sem veneno", color: "text-green-600" },
              { val: "Regional", label: "Forte", color: "text-orange-600" }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[3rem] shadow-xl">
                <div className={`text-5xl font-black ${stat.color} mb-2 tracking-tighter italic`}>{stat.val}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
