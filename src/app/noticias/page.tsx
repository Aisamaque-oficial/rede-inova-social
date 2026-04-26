
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { dataService } from "@/lib/data-service";
import { News } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import LogoCarousel from "@/components/logo-carousel";
import MainHeader from "@/components/main-header";
import { 
    Calendar, 
    Search, 
    Filter, 
    ChevronRight, 
    Clock, 
    Newspaper,
    Archive,
    Loader2,
    Pin,
    Badge as BadgeUI
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function NewsArchivePage() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  useEffect(() => {
    const unsubscribe = dataService.subscribeToNews((data) => {
      setNewsList(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getNewsImage = (imagePlaceholderId: string | undefined) => {
    if (!imagePlaceholderId) return null;
    return PlaceHolderImages.find(img => img.id === imagePlaceholderId);
  }

  // Grupa notícias por Mês/Ano para o seletor
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    newsList.forEach(item => {
        const date = new Date(item.publishedAt);
        const monthLabel = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
        months.add(monthLabel);
    });
    
    const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    
    return Array.from(months).sort((a, b) => {
        const [mA, yA] = a.split(' ');
        const [mB, yB] = b.split(' ');
        const dateA = new Date(Number(yA), monthNames.indexOf(mA.toLowerCase()));
        const dateB = new Date(Number(yB), monthNames.indexOf(mB.toLowerCase()));
        return dateB.getTime() - dateA.getTime();
    });
  }, [newsList]);

  // Filtra e ordena as notícias
  const filteredAndSortedNews = useMemo(() => {
    let filtered = newsList.filter(n => n.status === 'active' || n.status === 'fixed');
    
    if (selectedMonth !== "all") {
        filtered = filtered.filter(item => {
            const monthLabel = new Date(item.publishedAt).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
            return monthLabel === selectedMonth;
        });
    }

    return filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [newsList, selectedMonth]);

  // Agrupa por Dia para exibição
  const groupedByDay = useMemo(() => {
    const groups: { [key: string]: News[] } = {};
    filteredAndSortedNews.forEach(item => {
        const dayLabel = new Date(item.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
        if (!groups[dayLabel]) groups[dayLabel] = [];
        groups[dayLabel].push(item);
    });
    return groups;
  }, [filteredAndSortedNews]);

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-white">
      <MainHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 bg-slate-50/50 border-b border-slate-100">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-primary italic ring-1 ring-primary/20">
                <Archive className="h-3 w-3" /> Transparência e História
              </div>
              <h1 className="text-4xl font-black tracking-tighter sm:text-6xl text-slate-900 uppercase italic">
                Arquivo de Notícias
              </h1>
              <p className="text-lg font-medium text-muted-foreground leading-relaxed">
                Acompanhe a trajetória completa do projeto Rede Inovação Social através do nosso registro histórico de publicações e marcos.
              </p>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="container px-4 md:px-6 py-6 overflow-x-auto">
                <div className="flex items-center gap-4 min-w-max">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mr-4">
                        <Filter className="h-4 w-4" /> Filtrar Mês:
                    </div>
                    <Button 
                        variant={selectedMonth === 'all' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setSelectedMonth('all')}
                        className="rounded-full font-bold px-6"
                    >
                        Todos os Meses
                    </Button>
                    {availableMonths.map((month) => (
                        <Button 
                            key={month}
                            variant={selectedMonth === month ? 'default' : 'outline'} 
                            size="sm" 
                            onClick={() => setSelectedMonth(month)}
                            className="rounded-full font-bold px-6 capitalize"
                        >
                            {month}
                        </Button>
                    ))}
                </div>
            </div>
        </div>

        {/* Content Section */}
        <section className="w-full py-12 bg-white min-h-[600px]">
          <div className="container px-4 md:px-6">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Carregando Histórico...</p>
                </div>
            ) : filteredAndSortedNews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
                    <Newspaper className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-bold uppercase italic tracking-tight">Nenhuma publicação encontrada</h3>
                    <p className="text-sm font-medium">Tente alterar o filtro de data acima.</p>
                </div>
            ) : (
                <div className="space-y-20 max-w-5xl mx-auto">
                    {Object.keys(groupedByDay).map((day) => (
                        <div key={day} className="space-y-8">
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-black uppercase italic tracking-tighter text-primary/80 whitespace-nowrap min-w-max">
                                    {day}
                                </h2>
                                <div className="h-px w-full bg-slate-100" />
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                                {groupedByDay[day].map((item) => {
                                    const itemImage = getNewsImage(item.imagePlaceholderId);
                                    return (
                                        <Card key={item.id} className="group flex flex-col overflow-hidden border-none shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-xl transition-all duration-500 bg-white ring-1 ring-slate-100">
                                            <div className="aspect-[21/9] relative overflow-hidden">
                                                <Image 
                                                    src={item.thumbnailUrl || itemImage?.imageUrl || ""} 
                                                    alt={item.title} 
                                                    fill 
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    data-ai-hint={itemImage?.imageHint}
                                                />
                                                <div className="absolute top-4 left-4 flex gap-2">
                                                    {item.status === 'fixed' && (
                                                        <Badge className="bg-amber-500 text-white border-none text-[8px] font-black h-5 px-2 flex gap-1">
                                                            <Pin className="h-2 w-2" /> DESTAQUE
                                                        </Badge>
                                                    )}
                                                    <span className="text-[9px] font-black uppercase tracking-widest bg-white/90 backdrop-blur px-2 py-1 rounded shadow-sm text-primary">
                                                        {item.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <CardHeader className="p-6">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(item.publishedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    <span className="mx-1">•</span>
                                                    <span>por {item.author}</span>
                                                </div>
                                                <CardTitle className="text-xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">
                                                    {item.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="px-6 pb-6 pt-0">
                                                <p className="text-sm font-medium text-slate-600 leading-relaxed line-clamp-3 italic">
                                                    "{item.content}"
                                                </p>
                                                <Button asChild variant="link" className="p-0 h-auto mt-4 font-black uppercase text-[10px] tracking-[0.2em] text-primary group-hover:translate-x-2 transition-transform">
                                                    <Link href={`/noticias/${item.id}`}>
                                                        Ler Registro Completo <ChevronRight className="h-3 w-3 ml-1" />
                                                    </Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>
        </section>
        <LogoCarousel />
      </main>
      
      <footer className="bg-slate-900 py-12 w-full text-white">
        <div className="container px-4 md:px-6">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left space-y-4 max-w-md">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Sobre o Arquivo</h3>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">
                        Este registro faz parte do compromisso de transparência da Rede Inovação Social, 
                        mantendo todas as comunicações técnicas e sociais acessíveis ao público e parceiros institucionais.
                    </p>
                </div>
                <div className="flex flex-col items-center md:items-end gap-2">
                    <p className="text-xs font-bold text-slate-400 text-center md:text-right">
                    © 2026. Rede de Inovação Social | IF Baiano & CNPq
                    </p>
                    <nav className="flex gap-4 sm:gap-6">
                    <Link href="#" className="text-xs font-bold hover:text-primary transition-colors">
                        Termos de Uso
                    </Link>
                    <Link href="#" className="text-xs font-bold hover:text-primary transition-colors">
                        Privacidade
                    </Link>
                    </nav>
                </div>
           </div>
        </div>
      </footer>
    </div>
  );
}
