"use client";
// Build Stamp: 2026-04-18 20:16

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye, EarOff, FileText, X, Loader2, ArrowRight, Sparkles, History } from "lucide-react";
const logoPath = "/images/redeinova.png";
import VisitorCounter from "@/components/visitor-counter";
import { useState, useEffect } from "react";
import LogoCarousel from "@/components/logo-carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dataService } from "@/lib/data-service";
import { News, Sector } from "@/lib/mock-data";
import { CMSPageRenderer } from "@/components/cms/CMSPageRenderer";
import MainHeader from "@/components/main-header";
import { AnimatePresence } from "framer-motion";
import { ImageEditor } from "@/components/image-editor";
import ImpactGoals from "@/components/impact-goals";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, MapPin } from "lucide-react";
import { CMSBlock } from "@/lib/cms-schema";

function NewsListPublic() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = dataService.subscribeToNews((data) => {
        // Only show the latest 3 news on the landing page
      setNewsList(data.slice(0, 3));
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (!mounted) return <div className="h-48 flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  if (isLoading) {
    return (
      <div className="col-span-full flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (newsList.length === 0) {
      return (
          <div className="col-span-full text-center py-12 text-muted-foreground">
              Nenhuma notícia publicada ainda.
          </div>
      );
  }

  return (
    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
      {newsList.map((item, index) => (
        <div key={item.id}>
            <Card className="flex flex-col border-none shadow-xl hover:shadow-2xl transition-all overflow-hidden bg-white/60 backdrop-blur-md rounded-[3rem] group h-full ring-1 ring-black/5">
            <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                    {item.category}
                </span>
                </div>
                <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors line-clamp-2 leading-tight tracking-tighter italic uppercase">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 flex-1 flex flex-col">
                <p className="text-sm font-medium text-muted-foreground line-clamp-4 mb-6 italic">
                "{item.content}"
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-primary/10">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{item.author}</span>
                        {item.librasVideoUrl && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-3 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all text-[8px] font-black uppercase tracking-widest flex items-center gap-2 group/libras"
                                onClick={() => window.open(item.librasVideoUrl, '_blank')}
                            >
                                <Eye className="h-3 w-3" />
                                Libras
                            </Button>
                        )}
                    </div>
                    <Link href={`/noticias/${item.id}`} className="h-10 w-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all transform group-hover:rotate-12">
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </CardContent>
            </Card>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage({ params, mode = 'live', device = 'desktop' }: { 
  params?: { estudio?: string },
  mode?: 'draft' | 'preview' | 'live',
  device?: 'desktop' | 'tablet' | 'mobile'
}) {
  const isStudio = !!params?.estudio; // Check if we are in studio mode
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    municipality: "",
    sector: "ASCOM" as Sector,
    message: ""
  });

  const HERO_BLOCKS: Array<Partial<CMSBlock>> = [
    { id: "landing_hero_title", type: 'header', content: "Conectando Saberes e Realidades" },
    { id: "landing_hero_subtitle", type: 'text', content: "Agricultura familiar, tecnologia e inclusão unidos para transformar o Médio Sudoeste Baiano." }
  ];

  const FOOTER_BLOCKS: Array<Partial<CMSBlock>> = [
    { id: "footer_quote", type: 'text', content: "Tecnologia e inovação social combatendo as desigualdades através da alimentação saudável." }
  ];

  // CMS states governed by CMSPageRenderer now

  useEffect(() => {
    const userId = dataService.getCurrentUserId();
    const hasPermission = userId ? dataService.podeEditar(userId) : false;
    setCanEdit(hasPermission && isStudio);
  }, [isStudio]);

  return (
    <div className="flex flex-col min-h-screen bg-immersive overflow-hidden">
      <MainHeader />
      
      <main className="w-full flex-1 flex flex-col relative">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <section className="container px-8 md:px-12 lg:px-24 pt-32 pb-20 relative z-10">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 ring-1 ring-primary/20">
                    <Sparkles className="h-3 w-3" />
                    <span>Inovação Social</span>
                </div>
                <CMSPageRenderer 
                    pageId="landing_hero"
                    isStudio={isStudio}
                    mode={mode}
                    device={device}
                    defaultBlocks={HERO_BLOCKS}
                />
              </div>
              <div className="flex flex-wrap gap-6 pt-4">
                <Button asChild size="lg" className="rounded-full h-16 px-10 text-lg font-black uppercase tracking-tighter bg-primary shadow-[0_20px_40px_rgba(44,210,193,0.3)] hover:scale-105 transition-all">
                  <Link href="/jornada">Conheça a Jornada</Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="rounded-full h-16 px-10 text-lg font-black uppercase tracking-tighter border-2 border-primary/20 hover:bg-primary/5 transition-all">
                  <Link href="/laboratorio">Laboratório LISSA</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] scale-75" />
                <div className="relative z-10 p-8 md:p-12 glass-morphism rounded-[5rem] shadow-3xl hover:rotate-2 transition-transform duration-1000">
                    <Image
                        src={logoPath}
                        alt="Rede de Inovação Social"
                        width={600}
                        height={600}
                        className="mx-auto aspect-square overflow-hidden object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]"
                    />
                </div>
            </div>
          </div>
        </section>

        <section className="container px-8 md:px-12 lg:px-24 pt-32 pb-20 relative z-10">
          <ImpactGoals mode="public" />
        </section>

        <section className="py-32 relative">
            <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-right" />
            <div className="container px-8 md:px-12 lg:px-24 relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full w-fit">Feed Social</div>
                        <h2 
                          className="text-5xl md:text-7xl font-black tracking-tighter text-primary leading-none uppercase italic"
                        >
                          Feed de Notícias e Notificações
                        </h2>
                        <p 
                          className="text-muted-foreground text-xl font-medium italic opacity-70"
                        >
                            Acompanhe as últimas notícias, ações de campo e marcos importantes da nossa jornada territorial.
                        </p>
                    </div>
                    <Button variant="ghost" asChild className="rounded-full font-black uppercase tracking-widest text-[10px] group">
                        <Link href="/noticias" className="flex items-center gap-2">
                            Ver arquivo completo <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </Button>
                </div>
                <NewsListPublic />
            </div>
        </section>

        {/* 📋 SEÇÃO DE DEMANDAS / FALE CONOSCO */}
        <section id="contato" className="py-32 relative overflow-hidden">
            <div className="container px-8 md:px-12 lg:px-24 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-start">
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">
                                <FileText className="h-3 w-3" />
                                <span>Fale Conosco</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-primary leading-none uppercase italic">Ficou com<br />alguma <span className="text-slate-800">dúvida?</span></h2>
                            <p className="text-xl text-muted-foreground font-medium italic max-w-md">
                                "Nossa equipe multidisciplinar está pronta para ouvir as demandas do seu território e conectar saberes."
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6 group">
                                <div className="h-14 w-14 rounded-3xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all ring-1 ring-primary/10">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black uppercase tracking-tighter italic">Atuação Territorial</h4>
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Médio Sudoeste • Bahia</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-morphism p-10 md:p-14 rounded-[4rem] shadow-2xl relative">
                        <div className="absolute -top-10 -right-10 h-32 w-32 bg-primary/20 blur-[60px] rounded-full" />
                        
                        <form className="space-y-8 relative z-10" onSubmit={async (e) => {
                            e.preventDefault();
                            setIsSubmitting(true);
                            try {
                                await dataService.submitSiteDemand(formData);
                                toast({
                                    title: "🚀 Mensagem Enviada!",
                                    description: "Sua demanda já foi encaminhada para o setor responsável no dashboard do Rede Inova.",
                                });
                                setFormData({ name: "", email: "", municipality: "", sector: "ASCOM", message: "" });
                            } catch (error) {
                                toast({
                                    title: "❌ Erro ao enviar",
                                    description: "Não foi possível conectar com o servidor. Tente novamente em instantes.",
                                    variant: "destructive"
                                });
                            } finally {
                                setIsSubmitting(false);
                            }
                        }}>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Seu Nome</Label>
                                    <Input 
                                        id="name"
                                        placeholder="Ex: João Silva" 
                                        className="rounded-2xl h-14 bg-white/50 border-none ring-1 ring-black/5 focus:ring-primary transition-all font-medium"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">E-mail de Contato</Label>
                                    <Input 
                                        id="email"
                                        type="email"
                                        placeholder="seu@contato.com" 
                                        className="rounded-2xl h-14 bg-white/50 border-none ring-1 ring-black/5 focus:ring-primary transition-all font-medium"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label htmlFor="municipality" className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Município</Label>
                                    <Input 
                                        id="municipality"
                                        placeholder="Onde você mora?" 
                                        className="rounded-2xl h-14 bg-white/50 border-none ring-1 ring-black/5 focus:ring-primary transition-all font-medium"
                                        required
                                        value={formData.municipality}
                                        onChange={e => setFormData({...formData, municipality: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Núcleo de Interesse</Label>
                                    <select 
                                        className="rounded-2xl h-14 w-full bg-white/50 border-none ring-1 ring-black/5 focus:ring-primary transition-all font-medium px-4"
                                        value={formData.sector} 
                                        onChange={(e) => setFormData({...formData, sector: e.target.value as Sector})}
                                    >
                                        <option value="ASCOM">Comunicação (ASCOM)</option>
                                        <option value="SOCIAL">Social e Campo</option>
                                        <option value="CURADORIA">Científico e Pesquisa</option>
                                        <option value="COORD_GERAL">Geral e Administrativo</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Como podemos ajudar?</Label>
                                <Textarea 
                                    id="message"
                                    placeholder="Descreva sua dúvida ou demanda territorial..." 
                                    className="rounded-[2rem] min-h-[150px] bg-white/50 border-none ring-1 ring-black/5 focus:ring-primary transition-all font-medium p-6"
                                    required
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                />
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full h-16 rounded-[2rem] text-lg font-black uppercase tracking-tighter bg-primary shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : (
                                    <span className="flex items-center"><Send className="mr-2 h-5 w-5" /> Enviar Mensagem</span>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-20 border-y border-primary/5 bg-white/10 backdrop-blur-sm">
            <div className="container px-8 md:px-12 lg:px-24">
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Parceiros e Realizadores</span>
                    <LogoCarousel />
                </div>
            </div>
        </section>
      </main>

      <footer className="w-full py-20 bg-white relative z-10 border-t border-primary/5">
        <div className="container px-8 md:px-12 lg:px-24 flex flex-col items-center">
            <div className="grid md:grid-cols-3 gap-16 w-full mb-16">
                <div className="flex flex-col items-center md:items-start space-y-6">
                    <div className="flex items-center gap-4">
                        <Image src={logoPath} alt="Logo" width={60} height={60} className="drop-shadow-lg" />
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-primary leading-none uppercase tracking-tighter italic">Rede Inova</span>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-2 px-2 py-0.5 bg-primary/5 rounded-full">Médio Sudoeste Baiano</span>
                        </div>
                    </div>
                    <CMSPageRenderer 
                        pageId="landing_footer"
                        isStudio={isStudio}
                        mode={mode}
                        device={device}
                        defaultBlocks={FOOTER_BLOCKS}
                        className="text-center md:text-left"
                    />
                </div>
                <div className="flex flex-col items-center justify-center space-y-8">
                    <nav className="flex flex-wrap justify-center gap-8">
                        <Link href="/arquivo-historico" className="text-[10px] font-black text-primary hover:text-primary/70 transition-colors uppercase tracking-widest flex items-center gap-2">
                            <History className="h-3 w-3" /> Arquivo Histórico
                        </Link>
                        {["Transparência", "Termos", "Privacidade"].map(item => (
                            <Link key={item} href="#" className="text-[10px] font-black text-primary/60 hover:text-primary transition-colors uppercase tracking-widest">{item}</Link>
                        ))}
                    </nav>
                    <VisitorCounter />
                </div>
                <div className="flex flex-col items-center md:items-end justify-center space-y-4">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">IF Baiano / CNPq</p>
                        <p className="text-[10px] font-black text-primary tracking-widest uppercase mt-1">&copy; 2026 Todos os Direitos Reservados</p>
                    </div>
                </div>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent mb-8" />
            <p className="text-[8px] text-muted-foreground uppercase font-black tracking-[0.2em] opacity-40">
                Rede de Inovação Social - Sistema de Gestão de Conhecimento e Impacto
            </p>
        </div>
      </footer>
    </div>
  );
}
