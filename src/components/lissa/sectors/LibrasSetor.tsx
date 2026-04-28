"use client";

import React, { useEffect } from "react";
import { LibrasProvider } from "./libras/LibrasContext";
import { LibrasHero } from "./libras/LibrasHero";
import { CategoryGrid } from "./libras/CategoryGrid";
import { GlossarySearch } from "./libras/Glossary/GlossarySearch";
import { SignDisplay } from "./libras/Glossary/SignDisplay";
import { TermDefinition } from "./libras/Glossary/TermDefinition";
import { dataService } from "@/lib/data-service";
import { supabaseActivity } from "@/lib/supabase-activity";

import { useLibras } from "./libras/LibrasContext";
import { LibrasNavigation } from "./libras/LibrasNavigation";
import { GlossaryFilters } from "./libras/Glossary/GlossaryFilters";

interface LibrasSetorProps {
  isStudio: boolean;
}

export default function LibrasSetor({ isStudio }: LibrasSetorProps) {
  useEffect(() => {
    const user = dataService.getCurrentUser();
    if (user) {
      supabaseActivity.logActivity({
        user_id: user.id,
        user_name: user.name,
        user_sector: user.activeSector || 'LISSA',
        sector_name: 'Mediação em Libras',
        last_online: new Date().toISOString(),
        session_duration: 0
      });
    }
  }, []);

  return (
    <LibrasProvider>
      <LibrasContent isStudio={isStudio} />
    </LibrasProvider>
  );
}

function LibrasContent({ isStudio }: LibrasSetorProps) {
  const { activeTab } = useLibras();

  return (
    <div className="animate-in fade-in duration-1000 -mx-8 md:-mx-16 mt-[-4rem] overflow-hidden bg-[#faf9f6]">
      <LibrasHero isStudio={isStudio} />

      <div className="max-w-7xl mx-auto px-8 md:px-16 -mt-32 pb-32 relative z-20">
        {/* Navegação por Abas */}
        <LibrasNavigation />

        <div className="mt-12">
          {activeTab === 'glossary' && <GlossaryView isStudio={isStudio} />}
          {activeTab === 'pills' && <PillsView />}
          {activeTab === 'tracks' && <TracksView />}
        </div>
      </div>
    </div>
  );
}

function GlossaryView({ isStudio }: LibrasSetorProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <GlossaryFilters />
      
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 space-y-8">
          <GlossarySearch />
        </div>
        <div className="lg:col-span-7 sticky top-8">
          <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.08)] border border-primary/5 p-10 md:p-12 space-y-10 overflow-hidden relative">
            <SignDisplay />
            <TermDefinition />
            <EmptyStateWrapper />
          </div>
        </div>
      </div>
    </div>
  );
}

function PillsView() {
  const { PillsSection } = require("./libras/Pills/PillsSection");
  return <PillsSection />;
}

function TracksView() {
  const { TracksSection } = require("./libras/Tracks/TracksSection");
  return <TracksSection />;
}

function EmptyStateWrapper() {
  const { activeTermObj } = useLibras();
  if (activeTermObj) return null;
  return <LibrasEmptyState />;
}

function LibrasEmptyState() {
  return (
    <div className="h-[500px] flex flex-col items-center justify-center text-center space-y-6">
      <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center text-4xl animate-bounce">🤟</div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter">Selecione um termo</h3>
        <p className="text-slate-400 font-medium max-w-xs mx-auto">Navegue na lista à esquerda para ver a tradução e os detalhes científicos.</p>
      </div>
    </div>
  );
}

