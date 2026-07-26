"use client";

import React from "react";
import MainHeader from "@/components/main-header";
import { Hammer, CalendarDays, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFF]">
      <MainHeader />
      
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 relative overflow-hidden">
         {/* Decorative elements */}
         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
         <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-citrus/5 rounded-full blur-[100px] pointer-events-none" />
         
         <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center mt-12 md:mt-24">
            
            <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.6, type: "spring" }}
               className="w-24 h-24 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-8 shadow-xl border border-primary/20"
            >
               <Hammer size={48} />
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.1 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 mb-6"
            >
               <AlertCircle size={12} /> Em Construção
            </motion.div>

            <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="text-4xl md:text-6xl font-black italic text-slate-900 font-headline leading-tight mb-6"
            >
               Nossa Equipe <br className="hidden md:block"/> está em Formação
            </motion.h1>

            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.3 }}
               className="text-lg md:text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed"
            >
               Estamos preparando uma página incrível para apresentar as pessoas apaixonadas e dedicadas que fazem a Rede Inova acontecer.
            </motion.p>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.4 }}
               className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-6"
            >
               <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
                  <CalendarDays size={32} />
               </div>
               <div className="text-left text-center md:text-left">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                     Previsão de Abertura
                  </div>
                  <div className="text-2xl font-black text-primary">
                     Dia 25/08/2026
                  </div>
               </div>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.5 }}
               className="mt-16"
            >
               <Link href="/">
                  <Button className="h-14 px-8 rounded-full font-black uppercase tracking-widest text-[11px] bg-slate-900 hover:bg-primary transition-colors text-white shadow-xl hover:shadow-primary/25">
                     Voltar ao Início
                  </Button>
               </Link>
            </motion.div>

         </div>
      </main>
    </div>
  );
}
