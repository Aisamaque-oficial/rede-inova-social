"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLibras, LibrasTab } from "./LibrasContext";
import { BookOpen, Zap, Map } from "lucide-react";

export function LibrasNavigation() {
  const { activeTab, setActiveTab } = useLibras();

  const tabs: { id: LibrasTab; label: string; icon: any }[] = [
    { id: 'glossary', label: 'Glossário', icon: BookOpen },
    { id: 'pills', label: 'Minuto do Conhecimento', icon: Zap },
    { id: 'tracks', label: 'Trilhas', icon: Map },
  ];

  return (
    <div className="flex bg-white/50 backdrop-blur-md p-2 rounded-3xl ring-1 ring-primary/10 mb-8 max-w-2xl mx-auto shadow-sm">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden",
              isActive 
                ? "text-white shadow-xl" 
                : "text-slate-400 hover:text-primary hover:bg-white/40"
            )}
          >
            {isActive && (
              <motion.div 
                layoutId="activeTabBg"
                className="absolute inset-0 bg-primary -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-300")} />
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
