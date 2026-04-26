
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CalendarDays, Clock, Users } from "lucide-react";
import { communityEvents } from "@/lib/mock-data";

export default function HomeEventsSection() {
    const upcomingEvents = communityEvents.filter(e => e.status === 'previsto').slice(0, 3);

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Nossa Agenda</div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Próximas Oficinas e Minicursos</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      Participe de nossas atividades formativas. Juntos, fortalecemos nossa rede e conhecimento.
                    </p>
                  </div>
                </div>

                <div className="grid gap-8 py-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingEvents.map((event) => (
                        <Card key={event.id} className="flex flex-col h-full">
                            <CardHeader>
                                <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                                <CardDescription>{event.type}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 flex-shrink-0" />
                                    <span>Carga horária: {event.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4 flex-shrink-0" />
                                    <span>Público: {event.audience}</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Badge variant="secondary" className="w-full justify-center">Produto: {event.product}</Badge>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-center mt-8">
                    <Button asChild size="lg">
                        <Link href="/eventos">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            Ver todos os eventos
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
