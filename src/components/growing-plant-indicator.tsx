"use client"

import React, { useEffect, useState } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { 
  Zap, 
  FlaskConical, 
  Leaf, 
  Sprout, 
  CheckCircle2,
  Trophy
} from "lucide-react"
import { cn } from "@/lib/utils"

const stages = [
  { id: 1, label: "Semente", icon: Sprout, threshold: 0.1, color: "text-orange-500", bg: "bg-orange-500" },
  { id: 2, label: "Diagnóstico", icon: Leaf, threshold: 0.35, color: "text-amber-500", bg: "bg-amber-500" },
  { id: 3, label: "Formação", icon: FlaskConical, threshold: 0.6, color: "text-emerald-500", bg: "bg-emerald-500" },
  { id: 4, label: "Motor LISSA", icon: Zap, threshold: 0.85, color: "text-primary", bg: "bg-primary", isMotor: true },
  { id: 5, label: "Colheita", icon: Trophy, threshold: 0.98, color: "text-primary", bg: "bg-primary" },
]

export default function GrowingPlantIndicator() {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // To track which stages are reached
  const [activeStage, setActiveStage] = useState(1)

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(v => {
      const stage = stages.findLast(s => v >= s.threshold)
      if (stage) setActiveStage(stage.id)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 h-[60vh] flex flex-col items-center pointer-events-none select-none">
      {/* Background Rail */}
      <div className="absolute top-0 bottom-0 w-1 bg-slate-200/20 rounded-full" />
      
      {/* Growing Stem (Animated Path) */}
      <motion.div 
        style={{ scaleY, originY: 0 }}
        className="absolute top-0 w-1 bg-gradient-to-b from-primary/80 to-primary rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
      />

      <div className="relative h-full w-20 flex flex-col justify-between py-10">
        {stages.map((stage) => {
          const isReached = activeStage >= stage.id
          const Icon = stage.icon

          return (
            <div 
              key={stage.id} 
              className={cn(
                "relative group flex items-center justify-end gap-3 transition-opacity duration-500",
                isReached ? "opacity-100" : "opacity-30"
              )}
            >
              {/* Tooltip/Label */}
              <motion.div 
                initial={false}
                animate={{ x: isReached ? 0 : 20, opacity: isReached ? 1 : 0 }}
                className={cn(
                  "absolute right-full mr-4 px-3 py-1 rounded-lg border backdrop-blur-md text-[10px] font-black uppercase tracking-widest whitespace-nowrap",
                  isReached ? "bg-white/90 border-primary/20 text-primary" : "bg-white/40 border-slate-200 text-slate-400"
                )}
              >
                {stage.label}
              </motion.div>

              {/* Stage Node (Blooming Flower/Leaf) */}
              <div className="relative">
                <motion.div
                  initial={false}
                  animate={{ 
                    scale: isReached ? 1 : 0.8,
                    rotate: isReached ? 0 : -45
                  }}
                  className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-colors duration-500",
                    isReached ? `bg-white border-primary shadow-xl` : "bg-slate-100 border-slate-200"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isReached ? stage.color : "text-slate-300")} />
                </motion.div>

                {/* Motor LISSA Energy Effect */}
                {stage.isMotor && isReached && (
                  <div className="absolute inset-0">
                    <span className="flex h-full w-full relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-10 w-10 bg-primary/20"></span>
                    </span>
                  </div>
                )}

                {/* Blooming Petals/Leaves (Simple SVG lines) */}
                {isReached && (
                   <motion.div 
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     className="absolute -top-2 -right-2"
                   >
                     <div className="w-4 h-4 bg-emerald-500 rounded-full blur-[2px] opacity-40 animate-pulse" />
                   </motion.div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Growing Percentage Label */}
      <motion.div 
        className="absolute -bottom-8 font-black italic text-primary text-xs flex items-center gap-1"
      >
        <Leaf className="w-3 h-3 fill-primary" />
        {Math.round(activeStage * 20)}% Concluído
      </motion.div>
    </div>
  )
}
