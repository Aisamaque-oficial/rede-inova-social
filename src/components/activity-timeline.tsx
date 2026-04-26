"use client";

import React from "react";
import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  User, 
  Calendar,
  MessageSquare,
  ArrowDown
} from "lucide-react";
import { ActivityStep } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ActivityTimelineProps {
  steps: ActivityStep[];
  onAddStep?: () => void;
}

export default function ActivityTimeline({ steps }: ActivityTimelineProps) {
  if (!steps || steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30 gap-6">
         <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-slate-200">
            <Clock size={32} />
         </div>
         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-center">
            Nenhum marco registrado nesta rota. <br /> Adicione o primeiro passo para iniciar o fluxo.
         </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 pl-4">
      {/* Vertical Line */}
      <div className="absolute left-[31px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/20 via-slate-100 to-transparent" />

      {steps.map((step, index) => {
        const isDone = step.status === 'concluido';
        const isCurrent = step.status === 'em_progresso';

        return (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-10 group"
          >
            {/* Step Icon / Dot */}
            <div className={cn(
               "relative z-10 h-9 w-9 rounded-full flex items-center justify-center border-4 border-white shadow-xl transition-all duration-500",
               isDone ? "bg-emerald-500 text-white scale-110" : 
               isCurrent ? "bg-primary text-slate-950 scale-125 animate-pulse" : 
               "bg-slate-200 text-slate-400"
            )}>
               {isDone ? <CheckCircle2 size={16} /> : 
                isCurrent ? <Clock size={16} /> : 
                <Circle size={10} strokeWidth={4} />}
            </div>

            {/* Content Card */}
            <div className={cn(
               "flex-1 p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm group-hover:shadow-xl group-hover:border-primary/20 transition-all duration-500",
               isCurrent && "ring-2 ring-primary/10 border-primary/20"
            )}>
               <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="space-y-1">
                     <h4 className={cn(
                        "text-lg font-headline uppercase italic tracking-tighter transition-colors",
                        isDone ? "text-slate-800" : isCurrent ? "text-primary" : "text-slate-400"
                     )}>
                        {step.label}
                     </h4>
                     <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                        {step.timestamp && (
                           <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                              <Calendar size={10} /> {new Date(step.timestamp).toLocaleString('pt-BR')}
                           </span>
                        )}
                        {step.userName && (
                           <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                              <User size={10} /> {step.userName}
                           </span>
                        )}
                     </div>
                  </div>
                  <Badge variant="outline" className={cn(
                     "w-fit rounded-full px-4 py-1.5 h-auto text-[8px] font-black uppercase tracking-[0.2em] border-none shadow-none",
                     isDone ? "bg-emerald-50 text-emerald-600" : 
                     isCurrent ? "bg-primary/10 text-primary" : 
                     "bg-slate-50 text-slate-400"
                  )}>
                     {step.status === 'concluido' ? "EXECUTADO" : step.status === 'em_progresso' ? "NA MÃO" : "PREVISTO"}
                  </Badge>
               </header>

               {step.description && (
                  <p className={cn(
                    "text-[12px] font-medium leading-relaxed italic border-l-2 pl-4 py-1 transition-colors",
                    isDone ? "text-slate-500 border-slate-100" : "text-slate-400 border-slate-50"
                  )}>
                     {step.description}
                  </p>
               )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
