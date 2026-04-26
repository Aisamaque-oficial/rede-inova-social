
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
  CalendarCheck2 
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { format, parseISO, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { communityEvents, fairs, teamEvents } from "@/lib/mock-data";
import LogoCarousel from "@/components/logo-carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import MainHeader from "@/components/main-header";
import { Calendar } from "@/components/ui/calendar";

const EventCard = ({ event }: { event: (typeof communityEvents)[0] }) => (
    <Card className="flex flex-col h-full">
        <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
            {event.status === 'realizado' ? 
                <CheckCircle className="h-5 w-5 text-green-500" aria-label="Realizado" /> : 
                <CalendarDays className="h-5 w-5 text-muted-foreground/80" aria-label="Previsto" />
            }
        </div>
        <CardDescription>{event.type}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
        <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>Carga horária: {event.duration}</span>
            </div>
            <div className="flex items-center gap-2">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span>Público: {event.audience}</span>
            </div>
                <div className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 mt-1 flex-shrink-0" />
                <span><span className="font-semibold text-foreground/80">Conteúdo:</span> {event.content}</span>
            </div>
                <div className="flex items-start gap-2">
                <Target className="h-4 w-4 mt-1 flex-shrink-0" />
                <span><span className="font-semibold text-foreground/80">Impacto:</span> {event.impact}</span>
            </div>
        </div>
        </CardContent>
        <CardFooter>
            <Badge variant="secondary" className="w-full justify-center">Produto: {event.product}</Badge>
        </CardFooter>
    </Card>
);



export default function EventsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const upcomingEvents = communityEvents.filter(e => e.status === 'previsto');
  const pastEvents = communityEvents.filter(e => e.status === 'realizado');

  const selectedEvent = selectedDate ? teamEvents.find(e => isSameDay(parseISO(e.date), selectedDate)) : undefined;

  return (
    <div className="flex flex-col min-h-screen pt-20">
       <MainHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Cronograma de Desenvolvimento</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Agenda de Planejamento</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Acompanhe os planejamentos realizados para o desenvolvimento de nossos cursos, oficinas e minicursos.
                </p>
              </div>
            </div>
             <div className="grid lg:grid-cols-[1fr_350px] gap-12 mt-12">
                <Tabs defaultValue="upcoming" className="w-full">
                    <div className="flex justify-start mb-6">
                        <TabsList>
                            <TabsTrigger value="upcoming">Próximos Eventos</TabsTrigger>
                            <TabsTrigger value="past">Eventos Realizados</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="upcoming">
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                            {upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)}
                        </div>
                    </TabsContent>
                    <TabsContent value="past">
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                            {pastEvents.map((event) => <EventCard key={event.id} event={event} />)}
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="space-y-6">
                    <Card className="border-primary/20 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-primary" />
                                Atividades da Equipe
                            </CardTitle>
                            <CardDescription>Planejamento e reuniões internas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border shadow-sm mx-auto"
                                modifiers={{
                                    reuniao: (date: Date) => teamEvents.some(e => e.type === 'reuniao' && isSameDay(parseISO(e.date), date)),
                                    atividade: (date: Date) => teamEvents.some(e => e.type === 'atividade' && isSameDay(parseISO(e.date), date))
                                }}
                                modifiersStyles={{
                                    reuniao: { fontWeight: 'bold', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%' },
                                    atividade: { fontWeight: 'bold', backgroundColor: '#10b981', color: 'white', borderRadius: '50%' }
                                }}
                            />
                            
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center gap-4 text-xs font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-3 w-3 rounded-full bg-primary" />
                                        <span>Reunião</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-3 w-3 rounded-full bg-green-500" />
                                        <span>Atividade</span>
                                    </div>
                                </div>

                                {selectedEvent ? (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-xl bg-secondary/50 border border-secondary"
                                    >
                                        <h4 className="font-bold text-primary leading-tight mb-1">{selectedEvent.title}</h4>
                                        <p className="text-xs text-muted-foreground mb-2">
                                            {format(parseISO(selectedEvent.date), "dd 'de' MMMM", { locale: ptBR })}
                                        </p>
                                        <p className="text-sm">{selectedEvent.description}</p>
                                    </motion.div>
                                ) : (
                                    <p className="text-xs text-center text-muted-foreground py-4">
                                        Selecione um dia destacado para ver detalhes.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
             </div>
          </div>
        </section>
        
        <Separator />

        <section id="feiras" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
            <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Ponto de Encontro</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Feiras de Agricultura Familiar</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Espaços de troca, comércio justo e fortalecimento da economia solidária em nossa região.
                        </p>
                    </div>
                </div>
                 <div className="mx-auto grid max-w-4xl gap-8 py-12 md:grid-cols-2">
                    {fairs.map((fair) => (
                        <Card key={fair.id} className="w-full">
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <Sprout className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle>{fair.name}</CardTitle>
                                        <CardDescription className="mt-1">{fair.description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-2 text-sm">
                                <div className="flex items-center gap-3">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{fair.location}</span>
                                </div>
                                 <div className="flex items-center gap-3">
                                    <CalendarCheck2 className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{fair.period}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            </div>
        </section>


        <LogoCarousel />
      </main>
      <footer className="flex flex-col gap-2 py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground text-center">
          © 2026. Rede de Inovação Social para o Combate às Desigualdades por meio da Alimentação Nutricional e Saudável | IF Baiano/CNPq
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Termos de Serviço
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Política de Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  );
}
