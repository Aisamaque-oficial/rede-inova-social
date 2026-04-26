"use client";

import React from "react";
import { useParams } from "next/navigation";
import { sectorObjectives } from "@/lib/sector-objectives";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  Flag, 
  Lightbulb, 
  ArrowRightCircle, 
  CheckCircle2, 
  AlertCircle,
  Gem,
  Rocket,
  MessageSquare,
  Share2,
  FileText,
  Users,
  Shield,
  Edit,
  BarChart,
  Clock,
  Zap,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAccessibility } from "@/context/accessibility-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SectorObjectivesPage() {
  const params = useParams();
  const id = params.id as string;
  const data = sectorObjectives[id];
  const { colorMode } = useAccessibility();
  
  // Mock role check - in a real app this comes from auth context
  const isCoordinator = true; 

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center text-red-500">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">Setor não encontrado</h2>
          <p className="text-slate-500 font-medium">Os dados deste setor ainda não foram sistematizados.</p>
        </div>
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4 md:px-8">
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className={cn(
            "absolute inset-0 blur-3xl opacity-5 -z-10 bg-gradient-to-r",
            data.color === 'blue' ? 'from-blue-500 to-indigo-500' :
            data.color === 'teal' ? 'from-blue-600 to-blue-400' :
            data.color === 'orange' ? 'from-slate-800 to-slate-600' :
            'from-primary to-primary/50'
        )} />
        
        <div className={cn(
          "flex flex-col md:flex-row items-center gap-10 p-10 rounded-[3.5rem] border shadow-2xl relative overflow-hidden transition-all",
          colorMode === 'light' ? "bg-white border-slate-200" : "bg-card/40 backdrop-blur-md border-border/50"
        )}>
          {/* Dashboard Edit Action */}
          {isCoordinator && (
            <div className="absolute top-6 right-6">
               <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">
                  <Edit className="h-3 w-3" />
                  Editar Objetivos
               </button>
            </div>
          )}

          <div className={cn(
            "h-28 w-28 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-2xl transition-all duration-700 group-hover:rotate-6",
            data.color === 'blue' ? 'bg-blue-500 text-white shadow-blue-500/20' :
            data.color === 'teal' ? 'bg-teal-500 text-white shadow-teal-500/20' :
            data.color === 'orange' ? 'bg-orange-500 text-white shadow-orange-500/20' :
            'bg-primary text-white shadow-primary/20'
          )}>
            <Icon size={56} />
          </div>
          
          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Badge variant="outline" className="rounded-full border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest px-4 py-1.5 backdrop-blur-sm">
                Diretrizes Estratégicas
              </Badge>
              <Badge variant="outline" className={cn(
                "rounded-full border-border/50 font-black uppercase text-[10px] tracking-widest px-4 py-1.5 h-auto",
                colorMode === 'light' ? "text-slate-900/60" : "text-muted-foreground"
              )}>
                {data.title}
              </Badge>
            </div>
            
            <h1 className={cn(
              "text-5xl font-black italic tracking-tighter uppercase leading-none",
              colorMode === 'light' ? "text-slate-950" : "text-foreground"
            )}>
                Objetivos & <span className="text-primary NOT-italic font-black">Resultados</span>
            </h1>
            <p className={cn(
              "text-lg font-bold italic leading-relaxed max-w-3xl",
              colorMode === 'light' ? "text-slate-800" : "text-muted-foreground"
            )}>
              "{data.mission}"
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs System */}
      <Tabs defaultValue={data.tabs[0].id} className="w-full space-y-8">
        <TabsList className={cn(
          "backdrop-blur-sm p-1.5 rounded-3xl h-auto border flex flex-wrap gap-2",
          colorMode === 'light' ? "bg-slate-50 border-slate-200" : "bg-card/50 border-border/50"
        )}>
           {data.tabs.map(tab => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className={cn(
                  "rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest transition-all",
                  "data-[state=active]:bg-primary data-[state=active]:text-white",
                  tab.isHighlighted && "bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10",
                  colorMode === 'light' && "data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:bg-slate-100"
                )}
              >
                <div className="flex items-center gap-2">
                   {tab.isHighlighted && <BarChart className="h-3 w-3" />}
                   {tab.label}
                </div>
              </TabsTrigger>
           ))}
        </TabsList>

        {data.tabs.map(tab => (
           <TabsContent key={tab.id} value={tab.id} className="space-y-8 animate-reveal-up">
              <div className="space-y-12">
                 {tab.sections.map((section, sidx) => (
                    <div key={sidx} className="space-y-8 w-full">
                       {section.nature ? (
                          <div className="grid md:grid-cols-2 gap-8">
                             {section.nature.map((n, nidx) => (
                                <Card key={nidx} className={cn(
                                   "border-none shadow-2xl rounded-[3rem] overflow-hidden group transition-all",
                                   colorMode === 'light' ? "bg-white border border-slate-100" : "bg-card/60 backdrop-blur-sm"
                                )}>
                                   <CardHeader className="p-8 pb-4">
                                      <div className="flex items-center gap-4 mb-3">
                                         <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            {nidx === 0 ? <Shield className="h-5 w-5" /> : <Rocket className="h-5 w-5" />}
                                         </div>
                                         <CardTitle className={cn(
                                           "text-xl font-black uppercase tracking-tighter italic",
                                           colorMode === 'light' ? "text-slate-900" : "text-foreground"
                                         )}>{n.name}</CardTitle>
                                      </div>
                                      <p className={cn(
                                        "text-xs font-bold uppercase tracking-widest leading-relaxed",
                                        colorMode === 'light' ? "text-slate-500" : "text-muted-foreground"
                                      )}>
                                         {n.description}
                                      </p>
                                   </CardHeader>
                                   <CardContent className="p-8 pt-4 space-y-8">
                                      {/* Objectives List */}
                                      <div className="space-y-3">
                                         <span className={cn(
                                            "text-[11px] font-black uppercase tracking-[0.2em]",
                                            colorMode === 'light' ? "text-slate-900" : "text-primary/80"
                                         )}>
                                            Objetivos da Natureza
                                         </span>
                                         <div className="space-y-2">
                                            {n.objectives.map((obj, i) => (
                                               <div key={i} className={cn(
                                                  "flex gap-3 items-start p-3 rounded-2xl border transition-all shadow-sm",
                                                  colorMode === 'light' ? "bg-slate-50/50 border-slate-200" : "bg-background/30 border-border/20"
                                               )}>
                                                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                                  <span className={cn(
                                                    "text-xs font-bold",
                                                    colorMode === 'light' ? "text-slate-800" : "text-foreground"
                                                  )}>{obj}</span>
                                               </div>
                                            ))}
                                         </div>
                                      </div>
                                      {/* Typical Contents */}
                                      <div className={cn(
                                         "p-6 rounded-[2rem] border space-y-4",
                                         colorMode === 'dark' ? "bg-slate-950 border-white/5" :
                                         colorMode === 'dim' ? "bg-slate-800 border-white/10" :
                                         colorMode === 'light' ? "bg-blue-50/50 border-blue-100" :
                                         "bg-slate-900 border-white/5"
                                      )}>
                                         <span className={cn(
                                            "text-[11px] font-black uppercase tracking-[0.2em]",
                                            colorMode === 'light' ? "text-blue-900" : "text-blue-400"
                                         )}>
                                            Conteúdos Típicos
                                         </span>
                                         <div className="flex flex-wrap gap-2">
                                            {n.typicalContents.map((c, i) => (
                                               <Badge key={i} variant="outline" className={cn(
                                                  "text-[9px] font-black uppercase tracking-widest px-3 py-1",
                                                  colorMode === 'light' ? "bg-white border-blue-200 text-blue-900" : "bg-white/5 border-white/10 text-blue-200/60"
                                               )}>
                                                  {c}
                                               </Badge>
                                            ))}
                                         </div>
                                      </div>
                                   </CardContent>
                                </Card>
                             ))}
                          </div>
                       ) : section.content ? (
                          <div className="w-full lg:col-span-2">
                             <Card className={cn(
                                "border-none shadow-2xl rounded-[3rem] overflow-hidden group w-full transition-all",
                                colorMode === 'light' ? "bg-white border border-slate-100" : "bg-card/60 backdrop-blur-sm"
                             )}>
                                <CardHeader className="p-8 pb-4">
                                   <div className="flex items-center gap-4 mb-3">
                                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                         <Target className="h-5 w-5" />
                                      </div>
                                      <CardTitle className={cn(
                                        "text-xl font-black uppercase tracking-tighter italic",
                                        colorMode === 'light' ? "text-slate-900" : "text-foreground"
                                      )}>{section.title}</CardTitle>
                                   </div>
                                   <p className={cn(
                                      "text-xs font-bold uppercase tracking-widest leading-relaxed",
                                      colorMode === 'light' ? "text-slate-500" : "text-muted-foreground"
                                   )}>
                                      Diretrizes e metas para excelência do setor
                                   </p>
                                </CardHeader>
                                <CardContent className="p-8 pt-4">
                                   <div className="grid md:grid-cols-2 gap-8 items-stretch">
                                      {/* Left Column: Objectives */}
                                      <div className="space-y-4">
                                         <span className={cn(
                                            "text-[11px] font-black uppercase tracking-[0.2em]",
                                            colorMode === 'light' ? "text-slate-900" : "text-primary/80"
                                         )}>
                                            Objetivos Estratégicos
                                         </span>
                                         <div className="space-y-2">
                                            {section.content.objectives.map((obj, i) => (
                                               <div key={i} className={cn(
                                                  "flex gap-4 items-start p-5 rounded-2xl border shadow-sm transition-all hover:border-primary/20",
                                                  colorMode === 'light' ? "bg-slate-50/50 border-slate-200" : "bg-background/50 border-border/20"
                                               )}>
                                                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                                  <span className={cn(
                                                     "text-xs font-bold leading-relaxed",
                                                     colorMode === 'light' ? "text-slate-900" : "text-foreground"
                                                  )}>{obj}</span>
                                               </div>
                                            ))}
                                         </div>
                                      </div>

                                      {/* Right Column: Expected Results (Highlighted) */}
                                      <div className={cn(
                                         "p-8 rounded-[2.5rem] border space-y-8 flex flex-col justify-center transition-all",
                                         colorMode === 'dark' ? "bg-slate-950 border-white/5 text-white" :
                                         colorMode === 'dim' ? "bg-slate-800 border-white/10 text-slate-100" :
                                         colorMode === 'light' ? "bg-blue-600 border-blue-700 text-white shadow-lg shadow-blue-500/10" :
                                         "bg-slate-900 border-white/5 text-white"
                                      )}>
                                         <div className="flex items-center gap-3">
                                            <div className={cn(
                                               "h-8 w-8 rounded-lg flex items-center justify-center",
                                               colorMode === 'light' ? "bg-white/20 text-white" : "bg-blue-500/20 text-blue-400"
                                            )}>
                                               <Gem className={cn("h-4 w-4", colorMode === 'light' ? "text-white" : "text-blue-400")} />
                                            </div>
                                            <span className={cn(
                                               "text-[11px] font-black uppercase tracking-[0.2em]",
                                               colorMode === 'light' ? "text-white" : "text-blue-400"
                                            )}>
                                               Resultados Esperados
                                            </span>
                                         </div>
                                         <div className="space-y-4">
                                            {section.content.expectedResults.map((res, i) => (
                                               <div key={i} className="flex gap-4 items-center group/res">
                                                  <div className={cn(
                                                     "h-2 w-2 rounded-full transition-all scale-100 group-hover/res:scale-125",
                                                     colorMode === 'light' ? "bg-white/40 group-hover/res:bg-white" : "bg-blue-500/40 group-hover/res:bg-blue-400"
                                                  )} />
                                                  <span className={cn(
                                                     "text-xs font-bold transition-colors flex-1",
                                                     colorMode === 'light' ? "text-white/90 group-hover/res:text-white" : "text-blue-50/90 group-hover/res:text-white"
                                                  )}>{res}</span>
                                               </div>
                                            ))}
                                         </div>
                                         
                                         <div className={cn(
                                            "mt-8 pt-8 border-t opacity-50",
                                            colorMode === 'light' ? "border-white/20" : "border-white/5"
                                         )}>
                                            <div className="flex items-center gap-2">
                                               < Rocket className={cn("h-3 w-3", colorMode === 'light' ? "text-white/50" : "text-blue-400/50")} />
                                               <span className={cn(
                                                  "text-[9px] font-bold uppercase tracking-[0.2em]",
                                                  colorMode === 'light' ? "text-white/40" : "text-blue-400/30"
                                               )}>
                                                  Foco em Impacto e Meta Global
                                               </span>
                                            </div>
                                         </div>
                                      </div>
                                   </div>
                                </CardContent>
                             </Card>
                          </div>
                       ) : section.indicators ? (
                          <div className="w-full lg:col-span-2 space-y-6">
                             <div className="flex items-center gap-3 px-4">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                   <Activity className="h-4 w-4" />
                                </div>
                                <h3 className={cn(
                                  "text-lg font-black uppercase tracking-tighter italic",
                                  colorMode === 'light' ? "text-slate-900" : "text-foreground"
                                )}>{section.title}</h3>
                             </div>
                             
                             <Card className={cn(
                               "border-none shadow-2xl rounded-[2.5rem] overflow-hidden border transition-all",
                               colorMode === 'light' ? "bg-white border-slate-200" : "bg-card/60 backdrop-blur-sm border-border/50"
                             )}>
                                <Table>
                                   <TableHeader className={cn(
                                     colorMode === 'light' ? "bg-slate-50" : "bg-muted/50"
                                   )}>
                                      <TableRow className="border-border/50 hover:bg-transparent">
                                         <TableHead className="w-[200px] text-[11px] font-black uppercase tracking-widest text-primary">Indicador</TableHead>
                                         <TableHead className="text-[11px] font-black uppercase tracking-widest text-primary">Descrição</TableHead>
                                         <TableHead className="text-[11px] font-black uppercase tracking-widest text-primary">Fórmula</TableHead>
                                         <TableHead className="w-[120px] text-right text-[11px] font-black uppercase tracking-widest text-primary">Periodicidade</TableHead>
                                      </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                      {section.indicators.map((indicator, idx) => (
                                         <TableRow key={idx} className={cn(
                                           "border-border/40 transition-colors group",
                                           colorMode === 'light' ? "hover:bg-slate-50" : "hover:bg-primary/5"
                                         )}>
                                            <TableCell className={cn(
                                              "font-black text-xs py-5 italic tracking-tight uppercase",
                                              colorMode === 'light' ? "text-slate-900" : "text-foreground"
                                            )}>
                                               {indicator.name}
                                            </TableCell>
                                            <TableCell className={cn(
                                              "text-xs font-medium leading-relaxed max-w-sm",
                                              colorMode === 'light' ? "text-slate-700" : "text-muted-foreground/80"
                                            )}>
                                               {indicator.description}
                                            </TableCell>
                                            <TableCell className="py-5">
                                               <code className={cn(
                                                  "text-xs font-bold px-3 py-1.5 rounded-lg border break-words",
                                                  colorMode === 'light' ? "bg-slate-100 border-slate-200 text-blue-900" : "bg-muted border-border/50 text-blue-900"
                                               )}>
                                                  {indicator.formula}
                                               </code>
                                            </TableCell>
                                            <TableCell className="text-right py-5">
                                               <Badge variant="outline" className={cn(
                                                 "rounded-full text-[9px] font-black uppercase tracking-tighter",
                                                 colorMode === 'light' ? "bg-white border-slate-300 text-slate-800" : "bg-background border-border"
                                               )}>
                                                  {indicator.periodicity}
                                               </Badge>
                                            </TableCell>
                                         </TableRow>
                                      ))}
                                   </TableBody>
                                </Table>
                             </Card>
                          </div>
                       ) : null}
                    </div>
                 ))}
              </div>
           </TabsContent>
        ))}
      </Tabs>

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn(
          "p-8 rounded-[2.5rem] border border-dashed flex flex-col items-center text-center space-y-4",
          colorMode === 'light' ? "bg-slate-50 border-slate-300" : "border-border"
        )}
      >
        <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center border border-border">
          <Flag className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h4 className={cn(
            "text-xs font-black uppercase tracking-widest",
            colorMode === 'light' ? "text-slate-950" : "text-foreground"
          )}>Sistematização de Objetivos</h4>
          <p className={cn(
            "text-[10px] font-bold uppercase leading-relaxed max-w-xl",
            colorMode === 'light' ? "text-slate-600" : "text-muted-foreground"
          )}>
            Este documento reflete a visão estratégica atual do setor dentro da Rede Inova Social. 
            Quaisquer alterações devem ser validadas pela Coordenação Geral do Projeto.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
