"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layout, Users, FlaskConical, Gavel, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const studioPages = [
    {
        id: "landing",
        title: "Página Inicial (Portal)",
        desc: "Edite o banner herói, as frases de efeito e o feed de notícias.",
        icon: Layout,
        color: "bg-blue-500",
        href: "/gerenciar/estudio/inicio"
    },
    {
        id: "laboratorio",
        title: "Laboratório LISSA",
        desc: "Gerencie as estações (Cozinha, Horta, Jogos) e glossário Libras.",
        icon: FlaskConical,
        color: "bg-purple-600",
        href: "/gerenciar/estudio/lissa"
    },
    {
        id: "equipe",
        title: "Nossa Equipe",
        desc: "Atualize a mensagem de boas-vindas da equipe do projeto.",
        icon: Users,
        color: "bg-citrus-500",
        href: "/gerenciar/estudio/equipe"
    },
    {
        id: "transparencia",
        title: "Transparência",
        desc: "Edite a comunicação sobre a governança de recursos do CNPq.",
        icon: Gavel,
        color: "bg-slate-600",
        href: "/gerenciar/estudio/transparencia"
    }
];

export default function StudioHub() {
    return (
        <div className="p-8 space-y-8 min-h-screen bg-slate-50">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500 rounded-lg text-white shadow-lg">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Estúdio Digital</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Ambiente de rascunhos e controle visual do portal público.</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full">
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest animate-pulse">● Live Control Ativo</span>
                </div>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {studioPages.map((page, idx) => (
                    <motion.div
                        key={page.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="h-full border-none shadow-xl hover:shadow-2xl transition-all group rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-slate-200">
                            <CardHeader className="space-y-4">
                                <div className={`w-14 h-14 rounded-2xl ${page.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                    <page.icon className="h-7 w-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black text-slate-800 tracking-tight uppercase leading-none">{page.title}</CardTitle>
                                    <p className="text-xs text-slate-400 font-medium mt-2 leading-relaxed">{page.desc}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full h-12 rounded-xl bg-slate-900 hover:bg-orange-500 text-white font-black uppercase tracking-widest text-[10px] transition-all">
                                    <Link href={page.href}>
                                        Entrar no Estúdio <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="mt-16 bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 translate-y-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary blur-in">
                    <Sparkles className="h-10 w-10" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">O que é o Estúdio?</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1">
                        Este é o seu ambiente de rascunhos. Aqui você pode alterar textos e vídeos, visualizar como ficam no site original e somente quando estiver pronto, clicar em "Publicar". 
                        As alterações feitas aqui não são visíveis para o público externo até serem consolidadas.
                    </p>
                </div>
            </div>
        </div>
    );
}
