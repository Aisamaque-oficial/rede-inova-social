
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  FlaskConical, 
  Book, 
  BookOpen,
  Video, 
  Gamepad2, 
  Sprout, 
  Apple, 
  ShoppingCart, 
  Ear,
  Download,
  Info,
  ArrowRight,
  Play,
  MousePointer2,
  Navigation,
  Sparkles,
  Library,
  Quote,
  ChevronDown,
  Zap
} from "lucide-react";
import { authoralMaterials, AuthoralMaterial, TeamEvent, librasOriginals, librasShorts, librasDocs, LibrasVideo, librasGlossary } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import MainHeader from "@/components/main-header";
import { Badge } from "@/components/ui/badge";
import { ReactNode, createElement } from "react";
import React from "react";
import { dataService } from "@/lib/data-service";
import { CMSPageRenderer } from "@/components/cms/CMSPageRenderer";
import { CMSBlock } from "@/lib/cms-schema";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { MaterialReader } from "@/components/material-reader";
import { ScientificFragments } from "@/components/scientific-fragments";
import { ImageEditor } from "@/components/image-editor";

export default function LaboratorioPage({ params }: { params?: { estudio?: string } }) {
  const isStudio = !!params?.estudio;
  const [activeStation, setActiveStation] = useState<string>("map");
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<AuthoralMaterial | null>(null);
  const [showGlossary, setShowGlossary] = useState<boolean>(false);
  const [activeGlossaryModule, setActiveGlossaryModule] = useState<string>('eixo-imunologico');
  const [activeTermKey, setActiveTermKey] = useState<string | null>(null);
  const [termSearch, setTermSearch] = useState<string>('');
  const [canEditContent, setCanEditContent] = useState(false);
  const [librasView, setLibrasView] = useState<'glossary' | 'fragments'>('glossary');

  useEffect(() => {
    const userId = dataService.getCurrentUserId();
    const hasPermission = userId ? dataService.podeEditar(userId) : false;
    // REGRA DE OURO: Editor visual (lápis) só aparece no Estúdio
    setCanEditContent(hasPermission && isStudio);
  }, [activeGlossaryModule, isStudio]);

  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const bgX = useTransform(springX, [0, 1920], [-20, 20]);
  const bgY = useTransform(springY, [0, 1080], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const stations = [
    { id: "nutricao", label: "Cozinha Nutricional", icon: Apple, color: "bg-orange-500", description: "Aprenda sobre comida de verdade e escolhas conscientes." },
    { id: "materiais", label: "Biblioteca de Saberes", icon: Book, color: "bg-blue-500", description: "Acervo de guias, e-books e cartilhas autorais." },
    { id: "libras", label: "Mediação em Libras", icon: Ear, color: "bg-purple-600", description: "Núcleo de tradução técnica, letramento científico e mediação linguística." },
    { id: "agricultura", label: "Horta Comunitária", icon: Sprout, color: "bg-green-600", description: "A força da agricultura familiar e sustentabilidade." },
    { id: "jogos", label: "Arena de Desafios", icon: Gamepad2, color: "bg-indigo-600", description: "Minigames e testes de conhecimento divertidos." },
  ];

  const getMaterialImage = (imagePlaceholderId: string | undefined) => {
    if (!imagePlaceholderId) return null;
    return PlaceHolderImages.find((img) => img.id === imagePlaceholderId);
  };

  return (
    <div 
        className="flex flex-col min-h-screen pt-20 bg-[#fdfcf8] overflow-hidden selection:bg-primary/30"
        onMouseMove={handleMouseMove}
    >
      <MainHeader />
      
      <main className="flex-1 flex flex-col relative">
        {/* Elementos de fundo dinâmicos */}
        <motion.div 
            style={{ x: bgX, y: bgY }}
            className="absolute inset-0 pointer-events-none opacity-20"
        >
            <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[1px] border-primary/5 rounded-full scale-150" />
        </motion.div>

        {activeStation === "map" ? (
            <section className="flex-1 flex flex-col items-center justify-center container px-4 py-8 z-10 transition-all">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-6 ring-1 ring-primary/20 backdrop-blur-sm">
                        <FlaskConical className="h-4 w-4" />
                        <span>LISSA - Laboratório de Inovação Social e Segurança Alimentar</span>
                    </div>
                    <CMSPageRenderer 
                        pageId="lab_hero"
                        isStudio={isStudio}
                        defaultBlocks={[
                            { id: "lab_hero_title", type: 'header', content: "Laboratório LISSA" },
                            { id: "lab_hero_subtitle", type: 'text', content: '"Explore o futuro da inovação social através da segurança alimentar."' }
                        ]}
                    />
                </motion.div>

                {/* Mapa Central */}
                <div className="relative w-full max-w-5xl aspect-[16/10] md:aspect-[21/9] flex items-center justify-center">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 w-full px-4">
                        {stations.map((station, index) => (
                            <motion.div
                                key={station.id}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                                onMouseEnter={() => setHoveredStation(station.id)}
                                onMouseLeave={() => setHoveredStation(null)}
                                onClick={() => setActiveStation(station.id)}
                                className="group cursor-pointer flex flex-col items-center"
                            >
                                <motion.div 
                                    whileHover={{ y: -15, scale: 1.1 }}
                                    className={`w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] ${station.color} flex items-center justify-center text-white shadow-2xl relative transition-all duration-500 overflow-hidden group-hover:ring-[12px] group-hover:ring-primary/5`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <station.icon className="h-12 w-12 md:h-16 md:w-16 drop-shadow-lg group-hover:rotate-12 transition-transform duration-500" />
                                </motion.div>
                                
                                <div className="mt-6 text-center">
                                    <CMSPageRenderer 
                                        pageId={`lab_station_${station.id}_meta`}
                                        isStudio={isStudio}
                                        defaultBlocks={[
                                            { id: `lab_station_${station.id}_label`, type: 'text', content: station.label }
                                        ]}
                                    />
                                    <AnimatePresence>
                                        {hoveredStation === station.id && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="text-[10px] text-muted-foreground max-w-[140px] mt-2 font-bold leading-tight"
                                            >
                                                {station.description}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="mt-20 flex flex-col items-center gap-4 text-primary/40 animate-pulse">
                    <Navigation className="h-6 w-6" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Selecione uma estação</span>
                </div>
            </section>
        ) : (
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 container px-4 py-12 z-10"
            >
                {/* Cabeçalho da Estação */}
                <div className="flex items-center justify-between mb-12">
                    <Button 
                        variant="ghost" 
                        onClick={() => setActiveStation("map")}
                        className="group flex items-center gap-2 hover:bg-primary/5 font-black text-xs uppercase tracking-widest"
                    >
                        <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        Mapa
                    </Button>
                    <div className="flex items-center gap-4">
                        <motion.div 
                            layoutId="activeIcon"
                            className={`p-5 rounded-3xl ${stations.find(s => s.id === activeStation)?.color} text-white shadow-2xl`}
                        >
                            {createElement(stations.find(s => s.id === activeStation)?.icon || FlaskConical, { className: "h-8 w-8" })}
                        </motion.div>
                        <div>
                            <CMSPageRenderer 
                                pageId={`lab_station_${activeStation}_header`}
                                isStudio={isStudio}
                                defaultBlocks={[
                                    { id: `lab_station_${activeStation}_full_label`, type: 'text', content: stations.find(s => s.id === activeStation)?.label || "" }
                                ]}
                            />
                            <div className="flex items-center gap-2 mt-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Estação LISSA Ativa</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTEÚDO DINÂMICO DA ESTAÇÃO */}
                <Card className="bg-white/60 backdrop-blur-2xl rounded-[4rem] p-8 md:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.05)] border-none ring-1 ring-white">
                    {activeStation === "nutricao" && (
                        <div className="space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                             <div className="grid md:grid-cols-2 gap-16 items-center">
                                <div className="space-y-8 text-center md:text-left">
                                    <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-4 py-2">Infanto-Juvenil</Badge>
                                    <CMSPageRenderer 
                                        pageId="lab_cozinha"
                                        isStudio={isStudio}
                                        defaultBlocks={[
                                            { id: "lab_nutri_title", type: 'header', content: "Crescendo com Saúde" },
                                            { id: "lab_nutri_desc", type: 'text', content: 'Para adolescentes e crianças, o laboratório oferece uma dinâmica de imersão para aproximar o conceito de "comida de verdade".' }
                                        ]}
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-primary/5 hover:translate-y-[-5px] transition-transform">
                                            <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
                                                <Info className="h-5 w-5" />
                                            </div>
                                            <h4 className="font-black text-sm text-primary uppercase mb-2">Curiosidade</h4>
                                            <p className="text-xs font-medium text-muted-foreground">Você sabia que alimentos roxos ajudam na memória para estudar?</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-primary/5 hover:translate-y-[-5px] transition-transform">
                                            <div className="h-10 w-10 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 text-orange-500">
                                                <Play className="h-5 w-5" />
                                            </div>
                                            <h4 className="font-black text-sm text-orange-500 uppercase mb-2">Mini-Aula</h4>
                                            <p className="text-xs font-medium text-muted-foreground">O caminho do alimento da terra ao prato.</p>
                                        </div>
                                    </div>
                                </div>
                                <ImageEditor 
                                    pageId="lab_cozinha_image"
                                    defaultSrc="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop" 
                                    alt="Alimentação Saudável" 
                                    fill 
                                    className="object-cover"
                                    isStudio={isStudio}
                                    canEdit={canEditContent}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                <Button className="absolute bottom-8 left-8 rounded-full bg-white text-primary hover:bg-white/90 font-black px-8 py-6 text-sm uppercase tracking-tighter shadow-2xl group">
                                    <Sparkles className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" /> Iniciar Experiência
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeStation === "materiais" && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-1000 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {authoralMaterials.map((material) => {
                                const itemImage = getMaterialImage(material.imagePlaceholderId);
                                return (
                                <Card key={material.id} className="flex flex-col h-full hover:shadow-2xl transition-all group rounded-[3rem] overflow-hidden border-none bg-white shadow-xl ring-1 ring-black/5">
                                    {itemImage && (
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        <Image src={itemImage.imageUrl} alt={material.title} fill className="object-cover group-hover:rotate-2 group-hover:scale-110 transition-transform duration-1000" />
                                        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <div className="bg-white p-5 rounded-3xl shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
                                                <Download className="h-8 w-8 text-primary" />
                                            </div>
                                        </div>
                                    </div>
                                    )}
                                    <CardHeader className="p-8 pb-4">
                                        <Badge className="w-fit mb-4 bg-primary/5 text-primary border-none font-black text-[9px] uppercase tracking-widest">{material.id.split('-')[0]}</Badge>
                                        <CardTitle className="text-2xl font-black leading-tight text-primary tracking-tighter">
                                            {material.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-8 flex-1">
                                        <div className="text-sm font-medium text-muted-foreground leading-relaxed line-clamp-3 italic">
                                            "{material.description}"
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-8 pt-4">
                                        <Button 
                                            className="w-full rounded-2xl h-14 font-black uppercase tracking-tighter bg-primary text-white shadow-lg hover:shadow-primary/20 gap-3"
                                            onClick={() => setSelectedMaterial(material)}
                                        >
                                            <Play className="h-5 w-5" />
                                            Ler Agora (Acessível)
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )})}
                        </div>
                    )}

                    {activeStation === "libras" && (() => {
                        const currentModule = librasGlossary.find(m => m.id === activeGlossaryModule);
                        const totalTerms = librasGlossary.reduce((acc, m) => acc + m.terms.length, 0);
                        const activeTermObj = currentModule?.terms.find((t: any) => t.term === activeTermKey) ?? null;

                        return (
                        <div className="animate-in fade-in duration-700 -mx-8 md:-mx-16 mt-[-4rem] overflow-hidden">

                            {/* ── HERO SECTION ── */}
                            <div className="bg-gradient-to-br from-[#0b1e36] via-[#0f2a4a] to-[#071525] text-white px-8 md:px-16 pt-16 pb-20 relative overflow-hidden">
                                {/* Decorative floating signs */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                                    {['🤟','👋','🖐️','✌️','🤙'].map((sign, i) => (
                                        <span key={i} className="absolute text-6xl opacity-[0.04] animate-pulse" style={{
                                            top: `${[15,60,30,70,45][i]}%`,
                                            left: `${[5, 20, 55, 75, 92][i]}%`,
                                            animationDelay: `${i * 0.9}s`,
                                            fontSize: `${[5,8,6,9,7][i]}rem`
                                        }}>{sign}</span>
                                    ))}
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"/>
                                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4"/>
                                </div>

                                <div className="max-w-7xl mx-auto relative z-10">
                                    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
                                        <div className="space-y-5 max-w-2xl">
                                            <div className="flex flex-wrap gap-2">
                                                <span className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-sm">
                                                    🤟 Sistema de Mediação Científica
                                                </span>
                                                <span className="inline-flex items-center gap-2 bg-white/10 text-white/70 border border-white/10 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-sm">
                                                    Consulta Terminológica Bilíngue
                                                </span>
                                            </div>
                                            <CMSPageRenderer 
                                                pageId="lab_libras"
                                                isStudio={isStudio}
                                                defaultBlocks={[
                                                    { id: "lab_libras_title", type: 'header', content: "Mediação em Libras" },
                                                    { id: "lab_libras_desc", type: 'text', content: "Sistema bilíngue de consulta terminológica em Segurança Alimentar. Selecione um eixo temático ou busque um termo diretamente." }
                                                ]}
                                                className="text-left"
                                            />
                                        </div>

                                        {/* Stats */}
                                        <div className="flex gap-4 shrink-0">
                                            {[
                                                { val: librasGlossary.length.toString(), label: 'Eixos' },
                                                { val: totalTerms.toString(), label: 'Termos Mediados' },
                                            ].map((s, i) => (
                                                <div key={i} className="bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-center backdrop-blur-md min-w-[100px]">
                                                    <div className="text-3xl font-black text-primary">{s.val}</div>
                                                    <div className="text-[9px] font-black uppercase tracking-widest text-white/40 mt-1">{s.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ── EIXOS TEMÁTICOS + BUSCA ── */}
                                    <div className="mt-10 space-y-4">
                                        {/* Search bar */}
                                        <div className="relative">
                                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1 0 4.5 4.5a7.5 7.5 0 0 0 12.15 12.15z" /></svg>
                                            <input
                                                type="text"
                                                placeholder="Buscar termo em todos os eixos..."
                                                value={termSearch}
                                                onChange={e => setTermSearch(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm font-medium rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
                                            />
                                            {termSearch && (
                                                <button onClick={() => setTermSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-xs font-black">✕</button>
                                            )}
                                        </div>
                                        {/* Eixos */}
                                        <div className="flex flex-wrap gap-3">
                                            {librasGlossary.map((eixo) => {
                                                const isActive = activeGlossaryModule === eixo.id;
                                                return (
                                                    <button
                                                        key={eixo.id}
                                                        onClick={() => { setActiveGlossaryModule(eixo.id); setTermSearch(''); }}
                                                        className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight transition-all duration-300 border ${
                                                            isActive
                                                            ? 'bg-primary text-white border-primary shadow-[0_0_20px_rgba(44,210,193,0.25)] scale-105'
                                                            : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                                                        }`}
                                                        title={eixo.title}
                                                    >
                                                        <span className="text-base leading-none">{eixo.emoji}</span>
                                                        <span className="hidden md:inline whitespace-nowrap">{eixo.title.split('—')[0].trim().replace(/^Eixo (de |do |)\s*/i, '')}</span>
                                                        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── BILINGUAL CONTENT AREA ── */}
                            <div className="bg-[#f5f4f0] px-8 md:px-16 py-16">
                                <div className="max-w-7xl mx-auto">
                                    
                                    {/* ── SUB-NAVEGAÇÃO LIBRAS ── */}
                                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8 border-b border-primary/10 pb-10">
                                        <div className="flex bg-white/50 p-2 rounded-2xl ring-1 ring-primary/10 backdrop-blur-sm">
                                            <button 
                                                onClick={() => setLibrasView('glossary')}
                                                className={cn(
                                                    "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                                    librasView === 'glossary' 
                                                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                                                        : "text-muted-foreground hover:text-primary"
                                                )}
                                            >
                                                <Library className="h-4 w-4 inline-block mr-2" />
                                                Explorar Termos
                                            </button>
                                            <button 
                                                onClick={() => setLibrasView('fragments')}
                                                className={cn(
                                                    "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                                    librasView === 'fragments' 
                                                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                                                        : "text-muted-foreground hover:text-primary"
                                                )}
                                            >
                                                <Zap className="h-4 w-4 inline-block mr-2" />
                                                Fragmentos Científicos
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-black text-muted-foreground/60 uppercase tracking-widest italic">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                                            Conteúdo atualizado semanalmente
                                        </div>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {librasView === 'glossary' ? (
                                        <motion.div
                                            key={activeGlossaryModule}
                                            initial={{ opacity: 0, y: 24 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -16 }}
                                            transition={{ duration: 0.45, ease: "easeOut" }}
                                            className="max-w-4xl mx-auto items-start"
                                        >
                                            {/* Text & Terms */}
                                            <div className="lg:col-span-7 space-y-6">
                                                {/* Search Results Overlay */}
                                                {termSearch && (() => {
                                                    const results = librasGlossary.flatMap(e =>
                                                        e.terms
                                                            .filter((t: any) => t.term.toLowerCase().includes(termSearch.toLowerCase()) || t.description.toLowerCase().includes(termSearch.toLowerCase()))
                                                            .map((t: any) => ({ ...t, eixoTitle: e.title.split('—')[0].trim(), eixoEmoji: e.emoji, eixoId: e.id }))
                                                    );
                                                    return (
                                                        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm ring-1 ring-black/5">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-4">
                                                                {results.length} {results.length === 1 ? 'resultado' : 'resultados'} para "{termSearch}"
                                                            </p>
                                                            {results.length === 0 ? (
                                                                <p className="text-sm text-slate-400 italic">Nenhum termo encontrado nos eixos de mediação.</p>
                                                            ) : (
                                                                <div className="grid sm:grid-cols-2 gap-3">
                                                                    {results.map((r, i) => (
                                                                        <button key={i} onClick={() => { setActiveGlossaryModule(r.eixoId); setActiveTermKey(r.term || null); setTermSearch(''); }}
                                                                            className="text-left p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all group">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <span className="text-sm">{r.eixoEmoji}</span>
                                                                                <span className="text-[9px] font-black uppercase tracking-widest text-primary/50">{r.eixoTitle}</span>
                                                                            </div>
                                                                            <p className="font-black text-sm text-slate-800 group-hover:text-primary transition-colors uppercase tracking-tight">{r.term}</p>
                                                                            <p className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-2">{r.description}</p>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()}

                                                {/* Eixo Header Card */}
                                                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm ring-1 ring-black/5 flex items-center gap-5">
                                                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl shrink-0">
                                                        {currentModule?.emoji}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-1">Eixo de Mediação Ativo</p>
                                                        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{currentModule?.title}</h3>
                                                        <p className="text-sm text-slate-500 font-medium mt-1 leading-snug">{currentModule?.description}</p>
                                                    </div>
                                                </div>

                                                {/* Text Content */}
                                                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm ring-1 ring-black/5 relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-teal-400 to-transparent rounded-t-[2.5rem]"/>
                                                    <div className="flex items-center gap-3 mb-6 text-primary/40">
                                                        <BookOpen className="h-5 w-5" />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Conteúdo Técnico-Científico</span>
                                                    </div>
                                                    <div
                                                        className="prose prose-slate max-w-none"
                                                        dangerouslySetInnerHTML={{ __html: currentModule?.content || "" }}
                                                    />
                                                </div>

                                                {/* Terms Grid */}
                                                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm ring-1 ring-black/5">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="flex items-center gap-3">
                                                            <Sparkles className="h-5 w-5 text-primary" />
                                                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                                                                Terminologia deste eixo — clique para traduzir em Libras
                                                            </h4>
                                                        </div>
                                                        {activeTermObj && (
                                                            <button
                                                                onClick={() => setActiveTermKey(null)}
                                                                className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors flex items-center gap-1"
                                                            >
                                                                <ArrowRight className="h-3 w-3 rotate-180"/> Limpar
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="space-y-3">
                                                        {currentModule?.terms.slice(0, 6).map((term: any, i: number) => {
                                                            const isActive = activeTermKey === term.term && !!term.videoUrl;
                                                            return (
                                                                <motion.div
                                                                    key={i}
                                                                    layout
                                                                    className={`group relative rounded-3xl border transition-all duration-300 overflow-hidden ${
                                                                        isActive
                                                                        ? 'border-primary/30 bg-primary/5 shadow-sm'
                                                                        : 'bg-white border-slate-200 hover:border-primary/20 hover:bg-slate-50'
                                                                    }`}
                                                                >
                                                                    <button
                                                                        onClick={() => term.videoUrl && setActiveTermKey(isActive ? null : term.term)}
                                                                        className="w-full text-left p-5 flex items-start gap-4 focus:outline-none"
                                                                    >
                                                                        <span className={`shrink-0 h-8 w-8 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                                                                            isActive ? 'bg-primary text-white shadow-md' : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                                                                        }`}>
                                                                            {i + 1}
                                                                        </span>
                                                                        <div className="flex-1 min-w-0 pt-0.5">
                                                                            <div className={`font-black text-base uppercase tracking-tight transition-colors leading-tight ${
                                                                                isActive ? 'text-primary' : 'text-slate-800'
                                                                            }`}>
                                                                                {term.term}
                                                                            </div>
                                                                            {!isActive && (
                                                                                <div className="text-xs font-medium leading-snug mt-1.5 text-slate-500 line-clamp-2 pr-4">
                                                                                    {term.description}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        {term.videoUrl && (
                                                                            <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                                                isActive
                                                                                ? 'bg-primary/10 text-primary rotate-180'
                                                                                : 'bg-white border border-slate-200 text-slate-400 group-hover:border-primary/30 group-hover:bg-primary/5 shadow-sm'
                                                                            }`}>
                                                                                <ChevronDown className="h-4 w-4" />
                                                                            </div>
                                                                        )}
                                                                    </button>

                                                                    <AnimatePresence>
                                                                        {isActive && (
                                                                            <motion.div
                                                                                initial={{ height: 0, opacity: 0 }}
                                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                                exit={{ height: 0, opacity: 0 }}
                                                                                className="px-5 pb-5 pt-0 overflow-hidden"
                                                                            >
                                                                                <div className="pl-4 md:pl-12 border-t border-primary/10 pt-5 mt-2 flex flex-col md:flex-row gap-6">
                                                                                    
                                                                                    {/* TEXT CONTENT (LEFT) */}
                                                                                    <div className="flex-1 space-y-5">
                                                                                        <p className="text-sm font-medium text-slate-700 leading-relaxed pr-2 md:pr-8">
                                                                                            {term.description}
                                                                                        </p>
                                                                                        
                                                                                        {term.examples && term.examples.length > 0 && (
                                                                                            <div className="bg-white/60 rounded-2xl p-4 border border-slate-200/60 shadow-sm space-y-3">
                                                                                                <div className="flex items-center gap-2 text-primary">
                                                                                                    <Quote className="h-4 w-4 fill-primary/10" />
                                                                                                    <span className="text-[10px] font-black uppercase tracking-widest">Exemplos de Uso</span>
                                                                                                </div>
                                                                                                <ul className="space-y-2">
                                                                                                    {term.examples.map((ex: any, idx: number) => (
                                                                                                        <li key={idx} className="text-[13px] font-medium text-slate-600 leading-relaxed flex items-start gap-2.5">
                                                                                                            <span className="text-primary text-[10px] select-none mt-1">►</span>
                                                                                                            {ex}
                                                                                                        </li>
                                                                                                    ))}
                                                                                                </ul>
                                                                                            </div>
                                                                                        )}

                                                                                        {term.related && term.related.length > 0 && (
                                                                                            <div className="flex items-center gap-2.5 flex-wrap pt-2">
                                                                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ver também:</span>
                                                                                                {term.related.map((rel: any, idx: number) => (
                                                                                                    <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none text-[10px] px-3 py-1">
                                                                                                        {rel}
                                                                                                    </Badge>
                                                                                                ))}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>

                                                                                    {/* VIDEO CONTENT (RIGHT INLINE) */}
                                                                                    {term.videoUrl && (
                                                                                        <div className="md:w-[260px] lg:w-[280px] shrink-0 mt-4 md:mt-0">
                                                                                            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border ring-4 ring-primary/10 relative shadow-xl shadow-primary/5">
                                                                                                <iframe
                                                                                                    src={`${term.videoUrl.replace('watch?v=', 'embed/')}?autoplay=1&mute=1&loop=1&controls=0`}
                                                                                                    className="absolute inset-0 w-full h-[150%] top-1/2 -translate-y-1/2 scale-150 pointer-events-none"
                                                                                                    allow="autoplay; encrypted-media"
                                                                                                    title={`Tradução de ${term.term}`}
                                                                                                />
                                                                                                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-xl flex items-center gap-2 border border-white/10">
                                                                                                    <Ear className="h-4 w-4 text-primary animate-pulse" />
                                                                                                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Traduzindo</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}

                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </motion.div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Link Público do Glossário */}
                                                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
                                                        <Link href="/glossario" className="group flex items-center text-sm font-black text-primary hover:text-teal-600 uppercase tracking-tighter transition-colors px-6 py-3 rounded-2xl hover:bg-primary/5">
                                                            <Library className="h-5 w-5 mr-3 group-hover:-translate-y-1 transition-transform" />
                                                            Consultar Glossário Completo
                                                            <ArrowRight className="h-4 w-4 ml-3 group-hover:translate-x-1 transition-transform" />
                                                        </Link>
                                                    </div>
                                                </div>

                                                {/* Validation Notice */}
                                                <div className="flex items-center gap-4 px-6 py-4 bg-primary/5 rounded-2xl border border-primary/10">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                                                    <p className="text-sm font-bold text-slate-600 italic">
                                                    <CMSPageRenderer 
                                                        pageId="lab_glossary_notice"
                                                        isStudio={isStudio}
                                                        defaultBlocks={[
                                                            { id: "lab_validation_notice", type: 'text', content: '"Este conteúdo foi validado por especialistas em Libras e Nutrição da equipe LISSA."' }
                                                        ]}
                                                    />
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                        ) : (
                                        <motion.div
                                            key="fragments-view"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.45 }}
                                        >
                                            <ScientificFragments activeAxisId={activeGlossaryModule} />
                                        </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                        );
                    })()}



                    {activeStation === "agricultura" && (
                         <div className="animate-in fade-in slide-in-from-top-12 duration-1000 bg-[#f9faf5] rounded-[5rem] p-12 md:p-24 shadow-inner ring-1 ring-black/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-5">
                                <Sprout className="h-64 w-64 text-green-800" />
                            </div>
                            <div className="flex flex-col md:flex-row gap-16 items-center relative z-10">
                                <div className="md:w-1/3">
                                    <div className="bg-white p-12 rounded-[4rem] shadow-2xl text-center border-t-[12px] border-green-600">
                                        <Sprout className="h-28 w-28 text-green-600 mx-auto mb-8" />
                                        <CMSPageRenderer 
                                            pageId="lab_horta_badge"
                                            isStudio={isStudio}
                                            defaultBlocks={[
                                                { id: "lab_horta_badge_title", type: 'text', content: "Horta" },
                                                { id: "lab_horta_badge_subtitle", type: 'text', content: "Produção Local" }
                                            ]}
                                            className="flex flex-col items-center gap-1"
                                        />
                                    </div>
                                </div>
                                    <div className="md:w-2/3 space-y-10 text-center md:text-left">
                                        <CMSPageRenderer 
                                            pageId="lab_horta_main"
                                            isStudio={isStudio}
                                            defaultBlocks={[
                                                { id: "lab_horta_title", type: 'header', content: "Nossa Terra, Nossa Gente" },
                                                { id: "lab_horta_desc", type: 'text', content: "A agricultura familiar produz vida. No LISSA, valorizamos quem planta com consciência e colhe com amor." }
                                            ]}
                                        />
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8">
                                        {[
                                            { val: "70%", label: "Produção", color: "text-primary" },
                                            { val: "Puro", label: "Sem veneno", color: "text-green-600" },
                                            { val: "Regional", label: "Forte", color: "text-orange-600" }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white p-8 rounded-[3rem] shadow-xl">
                                                <div className={`text-5xl font-black ${stat.color} mb-2 tracking-tighter italic`}>{stat.val}</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                         </div>
                    )}

                    {activeStation === "jogos" && (
                        <div className="animate-in zoom-in-90 duration-1000">
                            <Card className="bg-[#0a0a0a] text-white min-h-[600px] rounded-[5rem] flex items-center justify-center text-center overflow-hidden relative shadow-3xl">
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,#111_25%,transparent_25%),linear-gradient(-45deg,#111_25%,transparent_25%)] bg-[length:40px_40px] opacity-20" />
                                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-primary via-blue-600 to-green-500 blur-[2px]" />
                                <CardContent className="space-y-10 relative z-10 px-8">
                                    <div className="relative inline-block">
                                        <Gamepad2 className="h-32 w-32 mx-auto text-primary animate-bounce duration-[3s]" />
                                        <div className="absolute -inset-8 bg-primary/30 blur-[60px] rounded-full" />
                                    </div>
                                    <CMSPageRenderer 
                                        pageId="lab_jogos"
                                        isStudio={isStudio}
                                        defaultBlocks={[
                                            { id: "lab_jogos_title", type: 'header', content: "Gaming Area" },
                                            { id: "lab_jogos_desc", type: 'text', content: "Prepare-se para desafios épicos no mundo da nutrição. O jogo está prestes a começar." }
                                        ]}
                                        className="text-center"
                                    />
                                    <Button className="bg-primary text-white hover:bg-white hover:text-black rounded-full font-black px-16 py-10 text-2xl shadow-[0_20px_50px_rgba(44,210,193,0.4)] transition-all uppercase tracking-tighter">
                                        Entrar no Ranking
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </Card>
            </motion.div>
        )}
      </main>

      <footer className="w-full py-16 border-t bg-white mt-auto">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col items-center md:items-start group">
                  <div className="flex items-center gap-4 mb-4">
                       <Image src="/assets/logotransparente.png" alt="Logo" width={60} height={60} className="hover:rotate-[360deg] transition-transform duration-1000" />
                       <div className="flex flex-col">
                           <span className="font-black text-primary text-3xl tracking-tighter uppercase leading-none italic">LISSA</span>
                           <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-2">Laboratório de Inovação Social e Segurança Alimentar</span>
                       </div>
                  </div>
                  <p className="text-sm font-bold text-muted-foreground/60 max-w-sm text-center md:text-left italic">
                <CMSPageRenderer 
                    pageId="lab_footer"
                    isStudio={isStudio}
                    defaultBlocks={[
                        { id: "lab_footer_quote", type: 'text', content: '"Transformando a segurança alimentar através da tecnologia e união."' }
                    ]}
                    className="max-w-2xl mx-auto"
                />
                  </p>
            </div>
            <nav className="flex gap-12">
                {["Início", "Agenda", "LISSA"].map((nav) => (
                    <Link 
                        key={nav}
                        href={nav === "Início" ? "/" : `/${nav.toLowerCase()}`} 
                        className="text-xs font-black text-primary hover:text-primary/60 transition-colors tracking-[0.3em] uppercase underline decoration-primary/20 underline-offset-8"
                    >
                        {nav}
                    </Link>
                ))}
            </nav>
            <div className="text-right flex flex-col items-center md:items-end">
                <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase mb-4">Rede de Inovação Social © 2026</p>
                <div className="flex gap-3">
                    {[1, 2, 3, 4].map(i => <div key={i} className={`h-2 w-2 rounded-full ${i === 1 ? 'bg-primary' : 'bg-primary/10'}`} />)}
                </div>
            </div>
        </div>
        <AnimatePresence>
            {selectedMaterial && (
                <MaterialReader 
                    material={selectedMaterial} 
                    onClose={() => setSelectedMaterial(null)} 
                />
            )}
        </AnimatePresence>

        {/* MODAL DO GLOSSÁRIO TERMINOLÓGICO */}
        <AnimatePresence>
            {showGlossary && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" onClick={() => setShowGlossary(false)} />
                    
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="relative w-full max-w-6xl h-full max-h-[90vh] bg-[#fdfcf8] rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
                    >
                        {/* Header Modal */}
                        <div className="flex flex-col md:flex-row items-center justify-between p-12 md:px-16 md:py-10 border-b border-primary/5 bg-white">
                            <div>
                                <h2 className="text-4xl font-black text-primary tracking-tighter uppercase italic">Glossário Terminológico</h2>
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">LISSA — Mediação Linguística e Científica</p>
                            </div>
                            <Button 
                                variant="ghost" 
                                onClick={() => setShowGlossary(false)}
                                className="mt-4 md:mt-0 font-black uppercase text-xs tracking-widest hover:bg-red-50 hover:text-red-500 rounded-full h-14 w-14"
                            >
                                Sair
                            </Button>
                        </div>

                        {/* Conteúdo Modal */}
                        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                            {/* Menu de Módulos */}
                            <div className="w-full md:w-80 bg-slate-50 p-8 border-r border-primary/5 overflow-y-auto">
                                <span className="text-[10px] font-black uppercase text-primary/40 tracking-[0.2em] mb-6 block">Módulos de Aprendizado</span>
                                <div className="space-y-4">
                                    {librasGlossary.map((module) => (
                                        <button
                                            key={module.id}
                                            onClick={() => setActiveGlossaryModule(module.id)}
                                            className={`w-full p-6 rounded-3xl text-left transition-all group ${
                                                activeGlossaryModule === module.id 
                                                ? 'bg-primary text-white shadow-xl translate-x-2' 
                                                : 'bg-white hover:bg-primary/5 text-primary/60 hover:text-primary'
                                            }`}
                                        >
                                            <h4 className="font-black text-sm leading-tight uppercase italic">{module.title}</h4>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Detalhes do Módulo */}
                            <div className="flex-1 p-12 md:p-16 overflow-y-auto bg-white/40">
                                 <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeGlossaryModule}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-10"
                                    >
                                        <div className="space-y-2">
                                            <Badge className="bg-primary/10 text-primary border-none">Conhecimento Técnico</Badge>
                                            <h3 className="text-4xl font-black text-primary tracking-tighter italic">
                                                {librasGlossary.find(m => m.id === activeGlossaryModule)?.title}
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {librasGlossary.find(m => m.id === activeGlossaryModule)?.terms.map((item: any, i: number) => (
                                                <motion.div 
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-primary/5 hover:shadow-xl hover:border-primary/20 transition-all group"
                                                >
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="h-4 w-4 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]" />
                                                        <h4 className="text-xl font-black text-primary uppercase italic tracking-tighter group-hover:text-purple-600 transition-colors uppercase">
                                                            {item.term}
                                                        </h4>
                                                    </div>
                                                    <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                                                        {item.description}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                 </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
      </footer>
    </div>
  );
}
