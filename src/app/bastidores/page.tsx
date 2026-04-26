
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Video, Users, FlaskConical, Wrench, ClipboardList } from "lucide-react";
import LogoCarousel from "@/components/logo-carousel";
import MainHeader from "@/components/main-header";

const categories = [
    {
        title: "Planejamento do Projeto",
        description: "Reuniões, brainstorms e alinhamentos estratégicos da equipe.",
        href: "/bastidores/planejamento",
        icon: ClipboardList,
    },
    {
        title: "Atividades de Pesquisa",
        description: "Fotos das investigações, análises e descobertas do projeto.",
        href: "/bastidores/pesquisa",
        icon: FlaskConical,
    },
    {
        title: "Atividades de Extensão",
        description: "Imagens das nossas ações junto à comunidade.",
        href: "/bastidores/extensao",
        icon: Users,
    },
    {
        title: "Desenvolvimento de Produtos",
        description: "O processo de criação das nossas tecnologias sociais.",
        href: "/bastidores/produtos",
        icon: Wrench,
    },
    {
        title: "Vídeos",
        description: "Documentários, tutoriais e registros em vídeo.",
        href: "/bastidores/videos",
        icon: Video,
    },
    {
        title: "Making Of",
        description: "Os bastidores das nossas produções e eventos.",
        href: "/bastidores/making-of",
        icon: Camera,
    }
];

export default function BastidoresPage() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
       <MainHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Por Trás das Câmeras</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Bastidores do Projeto</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore os momentos de criação, os preparativos e as histórias por trás das nossas ações navegando pelas categorias abaixo.
                </p>
              </div>
            </div>
             <div className="grid gap-8 py-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link key={category.href} href={category.href} className="group">
                    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                      <CardHeader className="flex-row items-center gap-4">
                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <CardTitle>{category.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
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
