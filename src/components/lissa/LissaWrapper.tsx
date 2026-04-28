"use client";

import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface LissaWrapperProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}

export function LissaWrapper({ title, icon: Icon, children }: LissaWrapperProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-8">
        <motion.div 
          layoutId="activeIcon"
          className="p-5 rounded-3xl bg-primary text-white shadow-2xl"
        >
          <Icon className="h-8 w-8" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">
            {title}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Estação LISSA Ativa
            </span>
          </div>
        </div>
      </div>

      <Card className="bg-white/60 backdrop-blur-2xl rounded-[4rem] p-8 md:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.05)] border-none ring-1 ring-white overflow-hidden">
        {children}
      </Card>
    </div>
  );
}
