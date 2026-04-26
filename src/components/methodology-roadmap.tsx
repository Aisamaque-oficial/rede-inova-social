"use client"

import React, { useRef } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { 
  Search, 
  Users, 
  Cpu, 
  Share2, 
  Zap, 
  Globe,
  TrendingUp,
  ArrowRight,
  Sprout
} from "lucide-react"
import { cn } from "@/lib/utils"

const stages = [
  {
    id: 1,
    title: "Semente",
    subtitle: "O Início de Tudo",
    desc: "Onde o compromisso com a mudança social nasce e se prepara para ganhar vida no território.",
    icon: Sprout,
    color: "orange-500",
    side: "right",
    actions: ["Planejamento", "Pactuação", "Equipe"],
    impact: "A base sólida para um projeto transformador."
  },
  {
    id: 2,
    title: "Conhecer o Chão",
    subtitle: "Diagnóstico Participativo",
    desc: "Mapeamos a realidade da produção e da alimentação em 13 municípios baianos, ouvindo as comunidades de perto.",
    icon: Search,
    color: "amber-500",
    side: "left",
    actions: ["Mapas de produção", "Entrevistas", "Relatórios"],
    impact: "Entender de onde viemos para saber para onde ir."
  },
  {
    id: 3,
    title: "Troca de Saberes",
    subtitle: "Formação e Empoderamento",
    desc: "Realizamos oficinas que unem o conhecimento das universidades com a sabedoria de quem lida com a terra.",
    icon: Users,
    color: "emerald-500",
    side: "right",
    actions: ["Rodas de conversa", "Oficinas TI", "Cursos"],
    impact: "Mais conhecimento para transformar a realidade."
  },
  {
    id: 4,
    title: "Motor LISSA",
    subtitle: "Inovação Tecnológica",
    desc: "Onde a mágica acontece: criamos aplicativos, jogos e materiais acessíveis (Libras e Voz).",
    icon: Cpu,
    color: "primary",
    isMotor: true,
    side: "left",
    actions: ["Lab LISSA", "Apps/Web", "Jogos"],
    impact: "Tecnologia a serviço da inclusão e da saúde."
  },
  {
    id: 5,
    title: "Colheita Social",
    subtitle: "Resultados e Impacto",
    desc: "Hora de mostrar o resultado nas feiras locais e compartilhar nossas vitórias com toda a sociedade.",
    icon: Share2,
    color: "primary",
    side: "right",
    actions: ["Feiras", "Seminários", "Artigos"],
    impact: "Impacto real que todo mundo pode participar."
  }
]

export default function MethodologyRoadmap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  // Smooth growth for the central spine
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <section ref={containerRef} className="py-24 bg-slate-900 overflow-hidden relative min-h-[200vh]">
      {/* Visual Header */}
      <div className="container px-4 md:px-6 relative z-20 mb-32">
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest"
          >
            <Globe className="w-3 h-3 text-primary" />
            Espinha Central do Crescimento
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white font-headline leading-tight">
            Metodologia <span className="text-primary not-italic underline decoration-white/20 decoration-dashed">PAP</span>
          </h2>
          <p className="max-w-2xl text-slate-400 text-lg font-medium leading-relaxed italic">
            Veja como o projeto cresce e floresce, do diagnóstico ao impacto social final.
          </p>
        </div>
      </div>

      <div className="container px-4 md:px-6 relative">
        {/* The Central Spine (The Stem) */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-1 hidden md:block">
           <svg className="w-full h-full" preserveAspectRatio="none">
              {/* Ghost Line (Rail) */}
              <line x1="50%" y1="0" x2="50%" y2="100%" className="stroke-slate-800" strokeWidth="4" />
              {/* Growing Stem */}
              <motion.line 
                x1="50%" y1="0" x2="50%" y2="100%" 
                className="stroke-primary" 
                strokeWidth="4"
                style={{ pathLength }}
                strokeDasharray="0 1"
              />
           </svg>
        </div>

        {/* Mobile Stem (Offset to the left) */}
        <div className="absolute left-4 top-0 bottom-0 w-1 md:hidden">
           <div className="h-full w-full bg-slate-800 rounded-full" />
           <motion.div 
             style={{ scaleY: scrollYProgress, originY: 0 }}
             className="absolute top-0 w-full bg-primary rounded-full"
           />
        </div>

        {/* The Stages */}
        <div className="relative space-y-32 md:space-y-64">
           {stages.map((stage, i) => {
             const isLeft = stage.side === "left"
             
             return (
               <div key={stage.id} className="relative flex flex-col md:flex-row items-center justify-center">
                  {/* The Connection Node (The Sprout) */}
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={cn(
                      "absolute left-4 md:left-1/2 -translate-x-1/2 z-30 w-12 h-12 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-xl",
                      stage.id <= 2 ? "bg-amber-500" : "bg-primary"
                    )}
                  >
                     {stage.isMotor ? <Zap className="w-5 h-5 text-white" /> : <div className="w-3 h-3 bg-white rounded-full" />}
                     {stage.isMotor && (
                        <div className="absolute inset-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        </div>
                     )}
                  </motion.div>

                  {/* Stage Card */}
                  <div className={cn(
                    "w-full md:w-1/2 px-12",
                    isLeft ? "md:text-right md:pr-16" : "md:text-left md:pl-16 md:order-2"
                  )}>
                     <motion.div
                       initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true, margin: "-100px" }}
                       transition={{ duration: 0.8, type: "spring" }}
                       className={cn(
                         "p-8 md:p-12 rounded-[3.5rem] bg-slate-800/40 backdrop-blur-xl border border-white/5 relative group cursor-default",
                         stage.isMotor && "border-primary/20 shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)]"
                       )}
                     >
                        {/* Stage Mark */}
                        <div className={cn(
                          "absolute top-6 flex items-center gap-2",
                          isLeft ? "md:right-10" : "md:left-10"
                        )}>
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Etapa 0{stage.id}</span>
                        </div>

                        <div className={cn(
                          "flex flex-col mb-6",
                          isLeft ? "md:items-end" : "md:items-start"
                        )}>
                           <div className={cn(
                             "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                             stage.id <= 2 ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
                           )}>
                              {React.createElement(stage.icon, { className: "w-8 h-8" })}
                           </div>
                           <h3 className="text-3xl md:text-4xl font-black italic text-white font-headline leading-tight">
                              {stage.subtitle}
                           </h3>
                        </div>

                        <div className="space-y-6">
                           <p className="text-lg md:text-xl text-slate-300 font-bold leading-relaxed italic">
                             "{stage.title}: {stage.desc}"
                           </p>
                           
                           <div className={cn(
                             "flex flex-wrap gap-2 pt-2",
                             isLeft ? "md:justify-end" : "md:justify-start"
                           )}>
                              {stage.actions.map((act, idx) => (
                                <span key={idx} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                   {act}
                                </span>
                              ))}
                           </div>

                           <div className={cn(
                             "flex gap-4 items-center p-6 rounded-3xl bg-black/20 border border-white/5",
                             isLeft ? "md:flex-row-reverse md:text-right" : "md:text-left"
                           )}>
                              <div className="p-3 rounded-2xl bg-white/5">
                                 <TrendingUp className="w-5 h-5 text-slate-500" />
                              </div>
                              <p className="text-xs font-bold text-slate-400 leading-relaxed">
                                {stage.impact}
                              </p>
                           </div>
                        </div>

                        {stage.isMotor && (
                           <div className="mt-8">
                              <button className="px-6 py-4 rounded-2xl bg-primary text-white font-black italic flex items-center gap-3 group/btn w-full justify-center">
                                 Conhecer Motor LISSA
                                 <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                           </div>
                        )}
                     </motion.div>
                  </div>

                  {/* Empty half to balance the grid on desktop */}
                  <div className="w-full md:w-1/2 hidden md:block" />
               </div>
             )
           })}
        </div>
      </div>

      {/* Decorative End (The Fruit/Result) */}
      <motion.div 
         initial={{ opacity: 0, scale: 0 }}
         whileInView={{ opacity: 1, scale: 1 }}
         className="mt-64 flex flex-col items-center text-center relative z-20"
      >
         <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-2xl animate-bounce-slow">
            <Zap className="w-12 h-12 text-white" />
         </div>
         <h4 className="mt-8 text-2xl font-black italic text-white font-headline">Maturidade e Impacto</h4>
         <p className="text-slate-500 font-bold max-w-sm">Onde a inovação se torna mudança social real no território.</p>
      </motion.div>
    </section>
  )
}
