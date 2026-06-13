"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Clock, 
  Users, 
  BookOpen, 
  Target, 
  CheckCircle, 
  CalendarDays, 
  Sprout, 
  Building2, 
  CalendarCheck2,
  Image as ImageIcon,
  ArrowRight,
  Sparkles,
  FolderOpen
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { communityEvents, fairs, teamEvents } from "@/lib/mock-data";
import LogoCarousel from "@/components/logo-carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import MainHeader from "@/components/main-header";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

const STAGGER_CHILDREN_VARIANTS = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const EventCard = ({ event, index }: { event: any, index: number }) => {
    const gradients = [
        "from-blue-500/20 to-purple-500/20",
        "from-emerald-500/20 to-teal-500/20",
        "from-orange-500/20 to-red-500/20",
        "from-pink-500/20 to-rose-500/20"
    ];
    const gradient = gradients[index % gradients.length];
    const hasGallery = event.gallery && event.gallery.length > 0;

    return (
        <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="h-full">
            <Card className="flex flex-col h-full overflow-hidden border-primary/10 shadow-lg hover:shadow-xl transition-all duration-500 group bg-card/50 backdrop-blur-sm">
                
                {/* Imagem de Apresentação (Capa) com modal de Galeria/Pasta */}
                {event.imageUrl ? (
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="w-full h-52 relative overflow-hidden bg-muted cursor-pointer">
                                <Image src={event.imageUrl} alt={event.title} fill className={`object-cover transition-transform duration-700 group-hover:scale-110 ${event.imagePosition || 'object-center'}`} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                                    <div className="flex flex-col items-center gap-2 text-white">
                                        {hasGallery ? (
                                            <>
                                                <FolderOpen className="w-10 h-10" />
                                                <span className="font-bold tracking-widest uppercase text-sm">Abrir Pasta de Fotos</span>
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="w-10 h-10" />
                                                <span className="font-bold tracking-widest uppercase text-sm">Ver Imagem</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                    <Badge variant={event.status === 'realizado' ? 'secondary' : 'default'} className="shadow-lg backdrop-blur-md bg-white/20 text-white border-white/30">
                                        {event.status === 'realizado' ? 'Realizado' : 'Previsto'}
                                    </Badge>
                                </div>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl bg-black/95 border-none p-0 overflow-hidden">
                            <DialogHeader className="absolute top-4 left-4 z-50">
                                <DialogTitle className="text-white drop-shadow-md text-xl">{event.title}</DialogTitle>
                            </DialogHeader>
                            <div className="w-full aspect-video md:aspect-[16/9] relative flex items-center justify-center p-4 pt-16">
                                {hasGallery ? (
                                    <Carousel className="w-full max-w-3xl">
                                        <CarouselContent>
                                            {event.gallery.map((img: string, i: number) => (
                                                <CarouselItem key={i} className="flex items-center justify-center">
                                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                                                        <Image src={img} alt={`Foto ${i+1}`} fill className="object-contain" />
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious className="left-2 bg-white/10 hover:bg-white/20 text-white border-none" />
                                        <CarouselNext className="right-2 bg-white/10 hover:bg-white/20 text-white border-none" />
                                    </Carousel>
                                ) : (
                                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                                        <Image src={event.imageUrl} alt={event.title} fill className="object-contain" />
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                ) : (
                    <div className={cn("w-full h-40 relative flex flex-col items-center justify-center bg-gradient-to-br transition-colors", gradient)}>
                        {event.status === 'realizado' ? (
                            <>
                                <ImageIcon className="w-10 h-10 mb-2 text-foreground/40 group-hover:scale-110 transition-transform duration-500" />
                                <span className="text-xs font-semibold uppercase tracking-widest text-foreground/50">Galeria Pendente</span>
                            </>
                        ) : (
                            <CalendarDays className="w-12 h-12 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
                        )}
                        <div className="absolute top-4 left-4">
                            <Badge variant={event.status === 'realizado' ? 'secondary' : 'default'} className="shadow-md">
                                {event.status === 'realizado' ? 'Realizado' : 'Previsto'}
                            </Badge>
                        </div>
                    </div>
                )}
                
                <CardHeader className="relative -mt-6 bg-card/90 backdrop-blur-md mx-4 rounded-xl shadow-sm border border-primary/5 pt-4 pb-4 z-10 group-hover:-translate-y-2 transition-transform duration-500">
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl leading-tight line-clamp-2">{event.title}</CardTitle>
                        {event.status === 'realizado' ? 
                            <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-1" aria-label="Realizado" /> : 
                            <CalendarDays className="h-5 w-5 text-primary flex-shrink-0 mt-1" aria-label="Previsto" />
                        }
                    </div>
                    <CardDescription className="text-primary font-medium">{event.type}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-muted-foreground">
                        {event.dateDisplay && (
                            <div className="col-span-2 flex items-center gap-2 bg-secondary/50 p-2 rounded-md">
                                <CalendarDays className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="truncate font-medium text-foreground/80" title={event.dateDisplay}>{event.dateDisplay}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded-md">
                            <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="truncate" title={event.duration}>{event.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded-md">
                            <Users className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="truncate" title={event.audience}>{event.audience}</span>
                        </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-1.5 rounded-md mt-0.5"><BookOpen className="h-4 w-4 text-primary" /></div>
                            <span className="leading-relaxed"><span className="font-semibold text-foreground/90">Conteúdo:</span> {event.content}</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-1.5 rounded-md mt-0.5"><Target className="h-4 w-4 text-primary" /></div>
                            <span className="leading-relaxed"><span className="font-semibold text-foreground/90">Impacto:</span> {event.impact}</span>
                        </div>
                    </div>
                </CardContent>
                
                <CardFooter className="pt-2 pb-6">
                    <div className="w-full bg-gradient-to-r from-secondary to-secondary/40 p-3 rounded-lg border border-primary/10 flex items-center gap-3">
                        <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-xs font-medium text-foreground/80 line-clamp-1">Produto: {event.product}</span>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default function EventsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const upcomingEvents = communityEvents.filter(e => e.status === 'previsto');
  const pastEvents = communityEvents.filter(e => e.status === 'realizado');

  const selectedEvent = selectedDate ? teamEvents.find(e => isSameDay(parseISO(e.date), selectedDate)) : undefined;

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-background selection:bg-primary/30">
       <MainHeader />
      <main className="flex-1">
        
        {/* Hero Imersivo */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/30 -z-10" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />
            
            <div className="container px-4 md:px-6 relative z-10">
                <motion.div 
                    initial="hidden"
                    animate="show"
                    variants={STAGGER_CHILDREN_VARIANTS}
                    className="flex flex-col items-center justify-center space-y-6 text-center max-w-3xl mx-auto"
                >
                    <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20 backdrop-blur-sm">
                        <CalendarDays className="h-4 w-4" />
                        <span>Cronograma e Eventos</span>
                    </motion.div>
                    
                    <motion.h1 variants={FADE_UP_ANIMATION_VARIANTS} className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                        Nossa <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Agenda</span>
                    </motion.h1>
                    
                    <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-muted-foreground md:text-xl leading-relaxed max-w-[800px]">
                        Acompanhe os planejamentos, cursos, oficinas e feiras. Juntos, construindo uma rede de inovação social e impacto.
                    </motion.p>
                </motion.div>
            </div>
        </section>

        {/* Conteúdo Principal: Bento Grid e Calendário */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
             <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">
                
                {/* Lado Esquerdo: Abas e Cards */}
                <div className="w-full order-2 lg:order-1">
                    <Tabs defaultValue="past" className="w-full">
                        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                            <h3 className="text-2xl font-bold tracking-tight">Cursos e Oficinas</h3>
                            <TabsList className="bg-secondary/50 backdrop-blur-sm border border-border/50 p-1 rounded-full h-auto">
                                <TabsTrigger value="upcoming" className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all">
                                    Próximos
                                </TabsTrigger>
                                <TabsTrigger value="past" className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all">
                                    Realizados
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        
                        <TabsContent value="upcoming" className="mt-0 outline-none">
                            <motion.div 
                                initial="hidden" animate="show" variants={STAGGER_CHILDREN_VARIANTS}
                                className="grid gap-6 sm:grid-cols-1 md:grid-cols-2"
                            >
                                {upcomingEvents.map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
                                {upcomingEvents.length === 0 && (
                                    <div className="col-span-full py-12 text-center text-muted-foreground bg-secondary/20 rounded-2xl border border-dashed">
                                        Nenhum evento futuro programado no momento.
                                    </div>
                                )}
                            </motion.div>
                        </TabsContent>
                        
                        <TabsContent value="past" className="mt-0 outline-none">
                             <motion.div 
                                initial="hidden" animate="show" variants={STAGGER_CHILDREN_VARIANTS}
                                className="grid gap-6 sm:grid-cols-1 md:grid-cols-2"
                            >
                                {pastEvents.map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Lado Direito: Calendário */}
                <div className="space-y-6 order-1 lg:order-2">
                    <Card className="border-primary/10 shadow-2xl bg-card/80 backdrop-blur-xl overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-16 -translate-y-16"></div>
                        <CardHeader className="pb-4 border-b border-border/50 bg-background/50">
                            <CardTitle className="text-xl flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <CalendarDays className="h-5 w-5" />
                                </div>
                                Agenda da Equipe
                            </CardTitle>
                            <CardDescription>Planejamentos e reuniões internas</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {isMounted && (
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    locale={ptBR}
                                    className="rounded-2xl border-none bg-transparent mx-auto p-0 w-fit flex justify-center [--cell-size:2.5rem] md:[--cell-size:2.8rem]"
                                    modifiers={{
                                        reuniao: (date: Date) => teamEvents.some(e => e.type === 'reuniao' && isSameDay(parseISO(e.date), date)),
                                        atividade: (date: Date) => teamEvents.some(e => e.type === 'atividade' && isSameDay(parseISO(e.date), date))
                                    }}
                                    modifiersClassNames={{
                                        reuniao: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1.5 after:w-1.5 after:bg-primary after:rounded-full font-bold",
                                        atividade: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1.5 after:w-1.5 after:bg-emerald-500 after:rounded-full font-bold",
                                        selected: "bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/30 after:hidden"
                                    }}
                                />
                            )}
                            
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center justify-center gap-6 text-xs font-medium bg-secondary/50 p-3 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                        <span>Reunião</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                        <span>Atividade</span>
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {selectedEvent ? (
                                        <motion.div 
                                            key={selectedEvent.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 relative overflow-hidden group"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                {selectedEvent.type === 'reuniao' ? <Users className="w-16 h-16" /> : <Target className="w-16 h-16" />}
                                            </div>
                                            <Badge className="mb-3" variant={selectedEvent.type === 'reuniao' ? 'default' : 'secondary'}>
                                                {selectedEvent.type === 'reuniao' ? 'Reunião' : 'Atividade'}
                                            </Badge>
                                            <h4 className="font-bold text-lg leading-tight mb-1 text-foreground">{selectedEvent.title}</h4>
                                            <p className="text-sm font-medium text-primary mb-3">
                                                {format(parseISO(selectedEvent.date), "dd 'de' MMMM", { locale: ptBR })}
                                            </p>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{selectedEvent.description}</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-col items-center justify-center py-8 text-center"
                                        >
                                            <div className="bg-secondary p-4 rounded-full mb-3 text-muted-foreground">
                                                <CalendarDays className="w-6 h-6 opacity-50" />
                                            </div>
                                            <p className="text-sm text-muted-foreground max-w-[200px]">
                                                Selecione um dia destacado no calendário para ver os detalhes.
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </CardContent>
                    </Card>
                </div>
             </div>
          </div>
        </section>
        
        {/* Separator Decorativo */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-8" />

        {/* Seção de Feiras */}
        <section id="feiras" className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="container px-4 md:px-6 relative z-10">
                 <motion.div 
                    initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
                    variants={STAGGER_CHILDREN_VARIANTS}
                    className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
                >
                    <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="inline-block rounded-full bg-emerald-500/10 text-emerald-600 px-4 py-1.5 text-sm font-medium border border-emerald-500/20 backdrop-blur-sm">
                        Ponto de Encontro
                    </motion.div>
                    <motion.h2 variants={FADE_UP_ANIMATION_VARIANTS} className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl">
                        Feiras de Agricultura Familiar
                    </motion.h2>
                    <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="max-w-[800px] text-muted-foreground md:text-xl leading-relaxed">
                        Espaços de troca, comércio justo e fortalecimento da economia solidária em nossa região. Conectando quem produz a quem consome.
                    </motion.p>
                </motion.div>
                 
                 <motion.div 
                    initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
                    variants={STAGGER_CHILDREN_VARIANTS}
                    className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-2"
                >
                    {fairs.map((fair, i) => (
                        <motion.div key={fair.id} variants={FADE_UP_ANIMATION_VARIANTS}>
                            <Card className="w-full h-full overflow-hidden group hover:shadow-xl hover:border-emerald-500/30 transition-all duration-500 bg-card/80 backdrop-blur-sm">
                                <CardHeader className="relative pb-4">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700" />
                                    <div className="flex items-start gap-4">
                                        <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 text-white transform group-hover:rotate-12 transition-transform duration-500">
                                            <Sprout className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 mt-1">
                                            <CardTitle className="text-xl">{fair.name}</CardTitle>
                                            <CardDescription className="mt-2 text-sm leading-relaxed">{fair.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-3 bg-secondary/40 p-4 rounded-xl border border-border/50">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="p-1.5 bg-background rounded-md shadow-sm">
                                                <Building2 className="h-4 w-4 text-emerald-600" />
                                            </div>
                                            <span className="font-medium text-foreground/80">{fair.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="p-1.5 bg-background rounded-md shadow-sm">
                                                <CalendarCheck2 className="h-4 w-4 text-emerald-600" />
                                            </div>
                                            <span className="font-medium text-foreground/80">{fair.period}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                 </motion.div>
            </div>
        </section>

        <section className="py-12 bg-background border-t">
            <LogoCarousel />
        </section>
      </main>
      
      <footer className="flex flex-col gap-2 py-8 w-full shrink-0 items-center px-4 md:px-6 border-t bg-secondary/20">
        <p className="text-xs text-muted-foreground text-center font-medium max-w-2xl">
          © 2026. Rede de Inovação Social para o Combate às Desigualdades por meio da Alimentação Nutricional e Saudável | IF Baiano/CNPq
        </p>
        <nav className="flex gap-4 sm:gap-6 mt-2">
          <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4">
            Termos de Serviço
          </Link>
          <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4">
            Política de Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  );
}
