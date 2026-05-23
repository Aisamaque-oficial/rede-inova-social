"use client"

import React, { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
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
    title: "A Semente da Rede",
    subtitle: "🌱 ETAPA 01",
    desc: "A Rede Inova nasce da articulação entre instituições públicas, comunidades, pesquisadores e movimentos sociais comprometidos com a construção de soluções coletivas para o combate às desigualdades sociais por meio da alimentação saudável.",
    quote: "Toda transformação social começa quando diferentes pessoas, saberes e territórios decidem caminhar juntos.",
    icon: Sprout,
    image: "/assets/sementeetapa01.JPG",
    color: "#10b981", // emerald-500
    side: "right",
    actions: ["Pactuação", "Articulação", "Territórios"],
    impact: "O início da construção coletiva da Rede de Inovação Social."
  },
  {
    id: 2,
    title: "Escuta e Diagnóstico Territorial",
    subtitle: "🧭 ETAPA 02",
    desc: "Nesta etapa, o projeto organiza processos de escuta, mapeamento social e levantamento de demandas relacionadas à alimentação, produção local, acessibilidade e desenvolvimento comunitário nos municípios envolvidos.",
    quote: "Antes de propor soluções, precisamos compreender os territórios, ouvir as comunidades e reconhecer suas realidades.",
    icon: Search,
    image: "/images/jornada/listening.png",
    color: "#b45309", // amber-700
    side: "left",
    actions: ["Mapeamento", "Escuta", "Território"],
    impact: "Conhecer o território é o primeiro passo para transformar realidades."
  },
  {
    id: 3,
    title: "Formação, Participação e Construção Coletiva",
    subtitle: "🤝 ETAPA 03",
    desc: "O projeto desenvolverá oficinas, rodas de conversa, ações educativas e processos formativos voltados ao fortalecimento da participação comunitária, da segurança alimentar e da circulação acessível do conhecimento.",
    quote: "A transformação social acontece quando ciência e comunidade constroem conhecimento juntas.",
    icon: Users,
    image: "/images/jornada/formation.png",
    color: "#2563eb", // blue-600
    side: "right",
    actions: ["Oficinas", "Rodas de Conversa", "Autonomia"],
    impact: "Formação como instrumento de autonomia, inclusão e fortalecimento territorial."
  },
  {
    id: 4,
    title: "Inovação Social e Tecnológica",
    subtitle: "💡 ETAPA 04",
    desc: "Nesta etapa, a Rede Inova estruturará o Laboratório de Inovação Social em Segurança Alimentar (LISSA), espaço voltado ao desenvolvimento de soluções acessíveis, materiais educativos, plataformas digitais e tecnologias sociais conectadas às demandas do território.",
    quote: "Tecnologia, acessibilidade e inovação a serviço das pessoas e dos territórios.",
    icon: Cpu,
    image: "/images/jornada/lissa.png",
    color: "#6366f1", // indigo-500
    isMotor: true,
    side: "left",
    actions: ["Lab LISSA", "Tecnologias Sociais", "Acessibilidade"],
    impact: "Construindo tecnologias sociais conectadas à realidade das comunidades."
  },
  {
    id: 5,
    title: "Resultados Esperados e Transformação Social",
    subtitle: "🌾 ETAPA 05",
    desc: "O projeto busca fortalecer redes comunitárias, ampliar o acesso à informação, incentivar práticas alimentares saudáveis, promover inclusão social e consolidar ações sustentáveis de inovação social no Médio Sudoeste Baiano.",
    quote: "O impacto social nasce quando conhecimento, participação e território geram mudanças reais na vida das pessoas.",
    icon: Share2,
    image: "/images/jornada/market.png",
    color: "#064e3b", // green-900
    side: "right",
    actions: ["Inclusão", "Práticas Saudáveis", "Sustentabilidade"],
    impact: "Resultados construídos coletivamente entre ciência, território e sociedade."
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
    <section ref={containerRef} className="py-24 bg-[#0a0f0d] overflow-hidden relative min-h-[200vh]">
      {/* Organic Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6.png')] z-0" />
      
      {/* Decorative Organic Blobs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      {/* Visual Header */}
      <div className="container px-4 md:px-6 relative z-20 mb-32">
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400/80 text-[10px] font-black uppercase tracking-widest"
          >
            <Sprout className="w-3 h-3 text-emerald-500" />
            Construção Coletiva e Articulação
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white font-headline leading-tight">
            Nossa <span className="text-primary not-italic underline decoration-white/20 decoration-dashed">Jornada</span>
          </h2>
          <p className="max-w-2xl text-slate-400 text-lg font-medium leading-relaxed italic">
            Conheça o caminho da construção coletiva da nossa Rede de Inovação Social.
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
                             `bg-${stage.color}/10 text-${stage.color}`
                           )}
                           style={{ backgroundColor: `${stage.color}10`, color: stage.color }}
                           >
                              {React.createElement(stage.icon, { className: "w-8 h-8" })}
                           </div>
                           <h3 className="text-3xl md:text-4xl font-black italic text-white font-headline leading-tight">
                               {stage.title}
                           </h3>
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 mt-2">{stage.subtitle}</span>
                        </div>

                         <div className="mb-8 overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl relative group/img bg-black/20">
                            <div className="absolute inset-0 transition-colors duration-500 z-10 bg-black/40 group-hover/img:bg-black/0" />
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 1.5 }}
                            >
                                <Image 
                                    src={stage.image} 
                                    alt={stage.title} 
                                    width={800} 
                                    height={450} 
                                    className="w-full h-auto transition-transform duration-700 object-cover aspect-video"
                                />
                            </motion.div>
                         </div>

                        <div className="space-y-6">
                           <p className="text-sm md:text-base text-slate-400 font-bold leading-relaxed">
                             {stage.desc}
                           </p>

                           <blockquote className={cn(
                              "text-lg md:text-xl text-slate-200 font-black leading-tight italic border-l-4 pl-4 py-2",
                              stage.id <= 2 ? "border-amber-500" : "border-emerald-500"
                           )}>
                              "{stage.quote}"
                           </blockquote>
                           
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
                                 <TrendingUp className="w-5 h-5 text-emerald-500/50" />
                              </div>
                              <p className="text-xs font-bold text-slate-400 leading-relaxed">
                                {stage.impact}
                              </p>
                           </div>
                        </div>

                        {stage.isMotor && (
                           <div className="mt-8">
                              <Link href="/laboratorio" className="px-6 py-4 rounded-2xl bg-emerald-600 text-white font-black italic flex items-center gap-3 group/btn w-full justify-center hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-900/20">
                                 Conhecer o LISSA
                                 <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                              </Link>
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
         initial={{ opacity: 0, y: 50 }}
         whileInView={{ opacity: 1, y: 0 }}
         className="mt-64 flex flex-col items-center text-center relative z-20 pb-32"
      >
         <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-2xl animate-pulse">
            <Zap className="w-12 h-12 text-white" />
         </div>
         <h4 className="mt-8 text-4xl md:text-6xl font-black italic text-white font-headline uppercase tracking-tighter">Rede em Movimento</h4>
         <p className="text-slate-400 font-bold max-w-2xl text-xl mt-6">
            A inovação social não termina em um projeto. Ela continua nas comunidades, nas pessoas e nos territórios transformados coletivamente.
         </p>
      </motion.div>
    </section>
  )
}
