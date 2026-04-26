
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { bastidoresItems, type BastidorItem } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import MainHeader from "@/components/main-header";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { useParams } from "next/navigation";

const categories = {
    'planejamento': { title: 'Planejamento do Projeto', desc: 'Reuniões, brainstorms e os alinhamentos estratégicos que guiam nossas ações.' },
    'pesquisa': { title: 'Atividades de Pesquisa', desc: 'Fotos das investigações, análises e descobertas científicas do nosso projeto.' },
    'extensao': { title: 'Atividades de Extensão', desc: 'Imagens das nossas ações junto à comunidade e impacto social.' },
    'produtos': { title: 'Desenvolvimento de Produtos', desc: 'O processo de criação das nossas tecnologias sociais e ferramentas.' },
    'videos': { title: 'Vídeos', desc: 'Documentários, tutoriais e registros audiovisuais das ações.' },
    'making-of': { title: 'Making Of', desc: 'Os bastidores das nossas produções, eventos e registros de campo.' }
};

const BastidorCard = ({ item }: { item: BastidorItem }) => {
    const itemImage = PlaceHolderImages.find(img => img.id === item.imagePlaceholderId);

    const cardContent = (
        <Card className="flex flex-col h-full overflow-hidden group cursor-pointer border-none shadow-lg hover:shadow-2xl transition-all rounded-[2rem] bg-white/50 backdrop-blur-sm">
            {itemImage && (
                <div className="aspect-video relative overflow-hidden">
                    <Image
                        src={itemImage.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {item.type === 'video' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                            <PlayCircle className="h-16 w-16 text-white/80" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )}
            <CardHeader className="p-6">
                <CardTitle className="text-xl font-bold tracking-tight italic uppercase text-primary group-hover:translate-x-1 transition-transform">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{item.description}</p>
            </CardContent>
        </Card>
    );

    if (item.type === 'video' && item.videoUrl) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    {cardContent}
                </DialogTrigger>
                <DialogContent className="max-w-4xl aspect-video p-0 border-none bg-black/90 backdrop-blur-xl overflow-hidden rounded-[2rem]">
                   <DialogHeader className="sr-only">
                        <DialogTitle>Vídeo: {item.title}</DialogTitle>
                   </DialogHeader>
                   <iframe 
                        className="w-full h-full"
                        src={item.videoUrl} 
                        title={`Vídeo: ${item.title}`}
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen>
                    </iframe>
                </DialogContent>
            </Dialog>
        );
    }

    if (item.type === 'foto' && itemImage) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    {cardContent}
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 border-none bg-white/95 backdrop-blur-xl overflow-hidden rounded-[2.5rem]">
                   <DialogHeader className="p-8 pb-0">
                        <DialogTitle className="text-2xl font-black italic uppercase text-primary">{item.title}</DialogTitle>
                   </DialogHeader>
                   <div className="p-8 pt-4">
                        <div className="relative aspect-video rounded-[1.5rem] overflow-hidden shadow-2xl">
                            <Image
                                src={itemImage.imageUrl}
                                alt={item.title}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <p className="text-base text-muted-foreground mt-6 leading-relaxed italic">"{item.description}"</p>
                   </div>
                </DialogContent>
            </Dialog>
        );
    }

    return cardContent;
}

export default function BastidoresCategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const config = categories[category as keyof typeof categories] || { title: 'Galeria', desc: 'Exploração dos bastidores do projeto.' };
  
  const items = bastidoresItems.filter(i => i.category === category);

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-immersive">
      <MainHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mb-12">
                <Link href="/bastidores" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:translate-x-[-4px] transition-transform mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para Bastidores
                </Link>
                <div className="space-y-4">
                    <h2 className="text-4xl font-black tracking-tighter sm:text-6xl italic uppercase text-primary leading-none">
                        {config.title}
                    </h2>
                    <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed italic font-medium">
                       {config.desc}
                    </p>
                </div>
            </div>
            
            <div className="h-px w-full bg-gradient-to-r from-primary/20 via-primary/5 to-transparent mb-16" />

            {items.length > 0 ? (
                <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => <BastidorCard key={item.id} item={item} />)}
                </div>
            ) : (
                <div className="text-center py-24 bg-white/30 backdrop-blur-sm rounded-[3rem] border border-dashed border-primary/20">
                    <p className="text-muted-foreground font-medium italic">Nenhuma foto encontrada nesta categoria ainda.</p>
                </div>
            )}
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-4 py-12 w-full shrink-0 items-center px-4 md:px-6 border-t border-primary/5 bg-white/20">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
          © 2026. Rede de Inovação Social | IF Baiano/CNPq
        </p>
      </footer>
    </div>
  );
}
