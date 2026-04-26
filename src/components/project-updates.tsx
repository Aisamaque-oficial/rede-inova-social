
"use client";

import { projectUpdates } from "@/lib/mock-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Zap, FlaskConical as Flask } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const iconMap = {
    lightbulb: Lightbulb,
    zap: Zap,
    flask: Flask,
};

export default function ProjectUpdates() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Nossas Inovações</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Bastidores do Projeto</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Acompanhe as atualizações, os bastidores e as inovações que estamos construindo.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl gap-8 py-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {projectUpdates.map((update) => {
                        const Icon = iconMap[update.icon as keyof typeof iconMap];
                        return (
                            <Card key={update.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <Badge variant="outline" className="mb-2 uppercase">{update.category}</Badge>
                                            <CardTitle className="text-lg">{update.title}</CardTitle>
                                        </div>
                                        <div className="bg-primary/10 p-3 rounded-full">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-muted-foreground">{update.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                <div className="flex justify-center mt-8">
                    <Button asChild size="lg">
                        <Link href="/bastidores">Explore os Bastidores</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
