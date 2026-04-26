'use client';

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { Carrot, Apple, Soup, HeartPulse, Sprout, Sun, Droplets } from "lucide-react";

const steps = [
    {
        title: "Semeando Conhecimento",
        description: "Tudo começa com a informação. Levamos saberes sobre agricultura familiar e nutrição para as comunidades.",
        icon: Sprout,
        color: "bg-green-500",
        accent: "text-green-600",
    },
    {
        title: "Nutrindo a Mudança",
        description: "Com sol (energia) e água (apoio), as sementes da inovação social começam a germinar.",
        icon: Droplets,
        color: "bg-blue-500",
        accent: "text-blue-600",
    },
    {
        title: "Colhendo Saúde",
        description: "Produtos saudáveis e sustentáveis chegam às mesas, combatendo a desigualdade alimentar.",
        icon: Carrot,
        color: "bg-orange-500",
        accent: "text-orange-600",
    },
    {
        title: "Transformando Vidas",
        description: "O resultado final é uma comunidade mais forte, saudável e resiliente.",
        icon: HeartPulse,
        color: "bg-red-500",
        accent: "text-red-600",
    }
];

export default function InteractiveNutritionJourney() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section ref={containerRef} className="py-24 bg-background relative overflow-hidden">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-20">
                    <motion.h2 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-3xl md:text-5xl font-bold text-primary font-headline"
                    >
                        O Caminho da Alimentação Consciente
                    </motion.h2>
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                        Acompanhe como transformamos realidades através da integração entre terra, tecnologia e cuidado social.
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Connection Line */}
                    <div className="absolute left-[22px] md:left-1/2 top-0 bottom-0 w-1 bg-muted -translate-x-1/2 z-0 hidden md:block" />
                    <motion.div 
                        style={{ scaleY: smoothProgress, originY: 0 }}
                        className="absolute left-[22px] md:left-1/2 top-0 bottom-0 w-1 bg-primary -translate-x-1/2 z-10 origin-top hidden md:block" 
                    />

                    <div className="space-y-24">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className={`relative flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                >
                                    {/* Icon Circle */}
                                    <div className="relative z-20 flex-shrink-0">
                                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${step.color} border-4 border-background flex items-center justify-center text-white shadow-xl`}>
                                            <step.icon size={28} />
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className={`flex-1 p-8 rounded-3xl bg-card border-2 border-primary/10 shadow-lg hover:shadow-2xl transition-all hover:border-primary/30 group ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                                        <h3 className={`text-2xl font-bold mb-3 ${step.accent} font-headline group-hover:scale-105 transition-transform origin-left`}>
                                            {step.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                    
                                    {/* Visualization Side */}
                                    <div className="flex-1 hidden md:flex items-center justify-center">
                                        <motion.div
                                            animate={{ 
                                                rotate: [0, 5, -5, 0],
                                                scale: [1, 1.05, 1]
                                            }}
                                            transition={{ 
                                                duration: 4, 
                                                repeat: Infinity,
                                                delay: index * 0.5
                                            }}
                                            className="w-48 h-48 bg-primary/5 rounded-full flex items-center justify-center relative"
                                        >
                                            <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full animate-spin-slow" />
                                            <step.icon size={80} className={`${step.accent} opacity-40`} />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Organic Bottom Transition */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-secondary/20 to-transparent pointer-events-none" />
        </section>
    );
}
